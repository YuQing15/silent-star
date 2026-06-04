import type { User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from './supabase/client'
import { getSiteRedirectUrl } from './supabase/config'

export type UserRole = 'user' | 'translator' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  role: UserRole
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
}

export function generateHandle(nameOrEmail: string) {
  const base = nameOrEmail.split('@')[0] || 'silent-reader'
  const handle = base.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 24)
  return handle || 'silentreader'
}

function normalizeRole(role: unknown): UserRole {
  return role === 'admin' || role === 'translator' ? role : 'user'
}

export function mapSupabaseUser(user: User | null): AuthUser | null {
  if (!user) return null

  const metadata = user.user_metadata ?? {}
  const appMetadata = user.app_metadata ?? {}
  const role = normalizeRole(appMetadata.role ?? metadata.role)
  const displayName = metadata.display_name || metadata.name || user.email?.split('@')[0] || 'Silent Star reader'

  return {
    id: user.id,
    name: displayName,
    email: user.email ?? '',
    avatarUrl: metadata.avatar_url || null,
    role,
  }
}

export const mockAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
}

export function getUserRole(user: AuthUser | null | undefined): UserRole {
  return user?.role ?? 'user'
}

export function isAdmin(userOrRole: AuthUser | UserRole | null | undefined) {
  const role = typeof userOrRole === 'string' ? userOrRole : getUserRole(userOrRole)
  return role === 'admin'
}

export function isTranslator(userOrRole: AuthUser | UserRole | null | undefined) {
  const role = typeof userOrRole === 'string' ? userOrRole : getUserRole(userOrRole)
  return role === 'translator'
}

export function canAccessAdmin(authOrUser: AuthState | AuthUser | null | undefined) {
  const user = authOrUser && 'isAuthenticated' in authOrUser ? authOrUser.user : authOrUser
  return isAdmin(user) || isTranslator(user)
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithPassword(email: string, password: string, displayName?: string) {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getSiteRedirectUrl('/login'),
      data: {
        display_name: displayName,
        role: 'user',
      },
    },
  })
}

export async function sendPasswordResetEmail(email: string) {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: getSiteRedirectUrl('/reset-password'),
  })
}

export async function preparePasswordRecoverySession() {
  const supabase = createSupabaseBrowserClient()
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
  const accessToken = hashParams.get('access_token')
  const refreshToken = hashParams.get('refresh_token')

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return { ready: false, error }
    window.history.replaceState({}, document.title, url.pathname)
  }

  if (accessToken && refreshToken) {
    const { error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
    if (error) return { ready: false, error }
    window.history.replaceState({}, document.title, url.pathname)
  }

  const { data, error } = await supabase.auth.getSession()
  if (error) return { ready: false, error }

  return {
    ready: Boolean(data.session),
    error: null,
  }
}

export async function updatePassword(newPassword: string) {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.updateUser({ password: newPassword })
}

export async function updatePasswordWithCurrentPassword(email: string, currentPassword: string, newPassword: string) {
  const supabase = createSupabaseBrowserClient()
  const authResult = await supabase.auth.signInWithPassword({ email, password: currentPassword })

  if (authResult.error) {
    return { data: null, error: authResult.error }
  }

  return supabase.auth.updateUser({ password: newPassword })
}

export async function signOut() {
  const supabase = createSupabaseBrowserClient()
  return supabase.auth.signOut()
}

export const authRoutes = {
  login: '/login',
  signup: '/signup',
  dashboard: '/profile',
  admin: '/admin',
}


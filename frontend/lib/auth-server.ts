import { canAccessAdmin, getUserRole, isAdmin, isTranslator, mapSupabaseUser, type AuthState, type AuthUser } from './auth'
import { hasSupabaseEnv } from './supabase/config'
import { createSupabaseServerClient } from './supabase/server'

export { canAccessAdmin, getUserRole, isAdmin, isTranslator }

export async function getCurrentUser(): Promise<AuthUser | null> {
  if (!hasSupabaseEnv()) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.getUser()
  if (error) return null
  return mapSupabaseUser(data.user)
}

export async function getCurrentAuthState(): Promise<AuthState> {
  const user = await getCurrentUser()
  return {
    user,
    isAuthenticated: Boolean(user),
  }
}

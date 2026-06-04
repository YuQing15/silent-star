import { createSupabaseBrowserClient } from './supabase/client'

export interface UserProfile {
  id: string
  display_name: string | null
  avatar_url: string | null
  updated_at?: string | null
}

export interface ProfileUpdateInput {
  userId: string
  displayName: string
  avatarUrl?: string | null
}

export async function getProfile(userId: string): Promise<UserProfile | null> {
  const supabase = createSupabaseBrowserClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) return null
  return data
}

export async function updateProfile({ userId, displayName, avatarUrl }: ProfileUpdateInput) {
  const supabase = createSupabaseBrowserClient()
  const payload: UserProfile = {
    id: userId,
    display_name: displayName,
    avatar_url: avatarUrl ?? null,
    updated_at: new Date().toISOString(),
  }

  const profileResult = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })
    .select('id, display_name, avatar_url, updated_at')
    .single()

  if (profileResult.error) return profileResult

  await supabase.auth.updateUser({
    data: {
      display_name: displayName,
      avatar_url: avatarUrl ?? null,
    },
  })

  return profileResult
}

export async function uploadAvatar(userId: string, file: File) {
  const supabase = createSupabaseBrowserClient()
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${userId}/avatar-${Date.now()}.${extension}`

  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, cacheControl: '3600', contentType: file.type || undefined })

  if (error) {
    return {
      publicUrl: null,
      error,
      message: 'Avatar storage is not ready yet. Create the avatars bucket in Supabase Storage, then try again.',
    }
  }

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return {
    publicUrl: data.publicUrl,
    error: null,
    message: null,
  }
}


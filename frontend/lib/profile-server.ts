import type { UserProfile } from './profile'
import { hasSupabaseEnv } from './supabase/config'
import { createSupabaseServerClient } from './supabase/server'

export async function getProfileServer(userId: string): Promise<UserProfile | null> {
  if (!hasSupabaseEnv()) return null

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar_url, updated_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) return null
  return data
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

export function hasSupabaseEnv() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}

export function getSiteUrl() {
  if (!siteUrl) {
    throw new Error('Missing NEXT_PUBLIC_SITE_URL. Add it to .env.local.')
  }

  return siteUrl.replace(/\/$/, '')
}

export function getSiteRedirectUrl(path: `/${string}`) {
  return `${getSiteUrl()}${path}`
}

export function getSiteRedirectPath(path: `/${string}`) {
  const redirectUrl = new URL(getSiteRedirectUrl(path))
  return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
}

export function getSupabaseConfig() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local.')
  }

  return {
    supabaseUrl,
    supabaseAnonKey,
  }
}


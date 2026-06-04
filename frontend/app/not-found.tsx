import Link from 'next/link'
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-display font-bold mb-4" style={{ color: 'var(--accent)' }}>404</p>
        <h1 className="font-display text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Page not found
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>
          The page you're looking for doesn't exist.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="btn-primary">Go Home</Link>
          <Link href="/novels" className="btn-outline">Browse Novels</Link>
        </div>
      </div>
    </div>
  )
}

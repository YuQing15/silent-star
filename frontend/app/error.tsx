'use client'
export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-5xl mb-4">⚠️</p>
        <h2 className="font-display text-2xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Something went wrong
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
          An unexpected error occurred.
        </p>
        <button onClick={reset} className="btn-primary">Try Again</button>
      </div>
    </div>
  )
}

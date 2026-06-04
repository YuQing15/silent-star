export function Skeleton({ className = '', style = {} }: { className?: string; style?: React.CSSProperties }) {
  return <div className={`skeleton ${className}`} style={style} />
}

export function NovelCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
      <Skeleton style={{ aspectRatio: '2/3', width: '100%' }} />
      <div className="p-2.5 space-y-2">
        <Skeleton style={{ height: 14, width: '85%' }} />
        <Skeleton style={{ height: 14, width: '60%' }} />
        <Skeleton style={{ height: 12, width: '40%' }} />
      </div>
    </div>
  )
}

export function NovelGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => <NovelCardSkeleton key={i} />)}
    </div>
  )
}

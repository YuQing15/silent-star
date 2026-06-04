'use client'
import { useState } from 'react'
import { Star } from 'lucide-react'

export function RatingWidget() {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  return (
    <div className="flex items-center gap-1">
      {[...Array(10)].map((_, i) => (
        <button
          key={i}
          onMouseEnter={() => setHovered(i + 1)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => setSelected(i + 1)}
          className="transition-transform hover:scale-125"
        >
          <Star
            size={18}
            className={`transition-colors ${i < (hovered || selected) ? 'text-profile-mauve fill-profile-mauve' : 'text-profile-mauve/25'}`}
          />
        </button>
      ))}
      {selected > 0 && (
        <span className="ml-2 text-sm font-medium text-profile-mauve">{selected}/10</span>
      )}
    </div>
  )
}

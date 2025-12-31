"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

type Playlist = {
  id: string
  name: string
}

export function PlaylistSidebar({
  onSelect,
}: {
  onSelect: (playlistId: string | null) => void
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    fetch("http://localhost:3000/api/playlists")
      .then(res => res.json())
      .then(setPlaylists)
  }, [])

  return (
    <aside className="w-64 border-r p-4 space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-start"
        onClick={() => onSelect(null)}
      >
        🎧 Biblioteca
      </Button>

      <div className="pt-4 space-y-1">
        {playlists.map(p => (
          <Button
            key={p.id}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onSelect(p.id)}
          >
            {p.name}
          </Button>
        ))}
      </div>
    </aside>
  )
}

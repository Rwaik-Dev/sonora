"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Headphones } from "lucide-react"

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
    <aside className="w-64 border-r border-violet-700 p-4 space-y-2">
      <Button
        variant="ghost"
        className="w-full justify-start pl-0 hover:pl-2"
        onClick={() => onSelect(null)}
      >
        <p className="font-bold text-lg flex items-center gap-2"><Headphones className="w-8 h-8" /> Biblioteca</p>
      </Button>

      <div className="pt-4 space-y-1">
        <p className="font-bold">Minhas playlists</p>
        {playlists.map(p => (
          <Button
            key={p.id}
            variant="ghost"
            className="w-full justify-start pl-0 hover:pl-2"
            onClick={() => onSelect(p.id)}
          >
            {p.name}
          </Button>
        ))}
      </div>
    </aside>
  )
}

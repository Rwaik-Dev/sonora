"use client"

import { useEffect, useState } from "react"
import { TrackRow } from "../player/TrackRow"
import { Button } from "@/components/ui/button"

type Track = {
  id: string
  title: string
  artist?: string
}

export function PlaylistView({
  playlistId,
  onPlay,
  onPlayAll
}: {
  playlistId: string
  onPlay: (index: number, tracks: Track[]) => void
  onPlayAll: (tracks: Track[]) => void
}) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [name, setName] = useState("")



  useEffect(() => {
    fetch(`http://localhost:3000/api/playlists/${playlistId}`)
      .then(res => res.json())
      .then(data => {
        setName(data.name)
        setTracks(data.tracks)
      })
  }, [playlistId])

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">{name}</h1>
        <Button
          className="mb-6 bg-violet-800 hover:bg-violet-700"
          onClick={() => onPlayAll(tracks)}
          variant={"default"}
        >
          ▶ Reproduzir playlist
        </Button>
      </div>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            onPlay={() => onPlay(index, tracks)}
          />
        ))}
      </div>
    </div>
  )
}

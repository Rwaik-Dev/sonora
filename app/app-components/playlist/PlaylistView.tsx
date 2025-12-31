"use client"

import { useEffect, useState } from "react"
import { TrackRow } from "../player/TrackRow"

type Track = {
  id: string
  title: string
  artist?: string
}

export function PlaylistView({
  playlistId,
  onPlay,
}: {
  playlistId: string
  onPlay: (index: number) => void
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
      <h1 className="text-2xl font-bold mb-6">{name}</h1>

      <div className="space-y-2">
        {tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            onPlay={() => onPlay(index)}
          />
        ))}
      </div>
    </div>
  )
}

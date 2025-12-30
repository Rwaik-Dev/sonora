"use client"

import { useEffect } from "react"
import { TrackRow } from "./TrackRow"

export type Track = {
  id: string
  title: string
  artist?: string
}

export function TrackList({
  tracks,
  setTracks,
  onPlay,
}: {
  tracks: Track[]
  setTracks: (t: Track[]) => void
  onPlay: (index: number) => void
}) {
  useEffect(() => {
    fetch("http://localhost:3000/api/tracks/get-tracks")
      .then(res => res.json())
      .then(setTracks)
  }, [setTracks])

  return (
    <div className="space-y-2">
      {tracks.map((track, index) => (
        <TrackRow
          key={track.id}
          track={track}
          onPlay={() => onPlay(index)}
        />
      ))}
    </div>
  )
}


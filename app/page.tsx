"use client"

import { useState } from "react"
import { Track, TrackList } from "@/app/app-components/player/TrackList"
import { PlayerBar } from "@/app/app-components/player/PlayerBar"
import { PlaylistView } from "./app-components/playlist/PlaylistView"
import { PlaylistSidebar } from "./app-components/playlist/PlaylistSidebar"

export default function Home() {
  const [view, setView] = useState<"library" | "playlist">("library")
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  function selectPlaylist(id: string | null) {
    if (id) {
      setView("playlist")
      setPlaylistId(id)
    } else {
      setView("library")
      setPlaylistId(null)
    }
    setCurrentIndex(null)
  }

  return (
    <div className="flex h-screen">
      <PlaylistSidebar onSelect={selectPlaylist} />

      <main className="flex-1 p-6 pb-28 overflow-y-auto">
        {view === "library" && (
          <TrackList
            tracks={tracks}
            setTracks={setTracks}
            onPlay={setCurrentIndex}
          />
        )}

        {view === "playlist" && playlistId && (
          <PlaylistView
            playlistId={playlistId}
            onPlay={setCurrentIndex}
          />
        )}
      </main>

      <PlayerBar
        track={tracks[currentIndex ?? -1]}
        onNext={() =>
          currentIndex !== null &&
          setCurrentIndex(i => (i! + 1) % tracks.length)
        }
        onPrev={() =>
          currentIndex !== null &&
          setCurrentIndex(i =>
            (i! - 1 + tracks.length) % tracks.length
          )
        }
      />
    </div>
  )
}

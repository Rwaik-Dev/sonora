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

  function playPlaylist(tracks: Track[]) {
    setTracks(tracks)
    setCurrentIndex(0)
  }

  function next() {
    setCurrentIndex(i => {
      if (i === null) return null
      if (i >= tracks.length - 1) return i
      return i + 1
    })
  }
  
  function prev() {
    setCurrentIndex(i => {
      if (i === null) return null
      if (i <= 0) return i
      return i - 1
    })
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
            onPlay={(index) => {
              setTracks(tracks)
              setCurrentIndex(index)
            }}
            onPlayAll={playPlaylist}
          />
        )}
      </main>

      <PlayerBar
        track={tracks[currentIndex ?? -1]}
        onNext={next}
        onPrev={prev}
      />

    </div>
  )
}

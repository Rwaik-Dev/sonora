"use client"

import { useState } from "react"
import { Track, TrackList } from "@/app/app-components/player/TrackList"
import { PlayerBar } from "@/app/app-components/player/PlayerBar"
import { PlaylistView } from "./app-components/playlist/PlaylistView"
import { PlaylistSidebar } from "./app-components/playlist/PlaylistSidebar"

type RepeatMode = "off" | "one" | "all"


export default function Home() {
  const [libraryTracks, setLibraryTracks] = useState<Track[]>([])
  const [tracks, setTracks] = useState<Track[]>([])
  const [originalTracks, setOriginalTracks] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [isShuffled, setIsShuffled] = useState(false)
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("off")

  const [view, setView] = useState<"library" | "playlist">("library")
  const [playlistId, setPlaylistId] = useState<string | null>(null)


  function selectPlaylist(id: string | null) {
    if (id) {
      setView("playlist")
      setPlaylistId(id)
    } else {
      setView("library")
      setPlaylistId(null)
    }
  }

  function shuffleKeepingCurrent(
    list: Track[],
    currentIndex: number) {
    const current = list[currentIndex]
    const rest = list.filter((_, index) => index !== currentIndex)

    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[rest[i], rest[j]] = [rest[j], rest[i]]
    }

    return [current, ...rest]
  }

  function toggleShuffle() {
    if (!tracks.length || currentIndex === null) return

    if (!isShuffled) {
      const shuffled = shuffleKeepingCurrent(tracks, currentIndex)

      setOriginalTracks(tracks)
      setTracks(shuffled)
      setCurrentIndex(0)
      setIsShuffled(true)
    } else {
      const currentTrack = tracks[currentIndex]
      const newIndex = originalTracks.findIndex(track => track.id === currentTrack.id) 

      setTracks(originalTracks)
      setCurrentIndex(newIndex)
      setIsShuffled(false)
    }
  }

  function next() {
    if (currentIndex === null) return
  
    const nextIndex = currentIndex + 1
  
    if (nextIndex < tracks.length) {
      setCurrentIndex(nextIndex)
      return
    }
  
   if (repeatMode === "all") {
      setCurrentIndex(0)
    }
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
            tracks={libraryTracks}
            setTracks={setLibraryTracks}
            onPlay={(index) => {
              setOriginalTracks(libraryTracks);
              setTracks(libraryTracks);
              setCurrentIndex(index);
              setIsShuffled(false);
            }}
          />
        )}

        {view === "playlist" && playlistId && (
          <PlaylistView
            playlistId={playlistId}
            onPlay={(index, playlistTracks) => {
              setOriginalTracks(playlistTracks)
              setTracks(playlistTracks)
              setCurrentIndex(index)
              setIsShuffled(false)
            }}
            onPlayAll={(playlistTracks) => {
              setOriginalTracks(playlistTracks)
              setTracks(playlistTracks)
              setCurrentIndex(0)
              setIsShuffled(false)
            }}
          />
        )}
      </main>

      <PlayerBar
        track={tracks[currentIndex ?? -1]}
        onNext={next}
        onPrev={prev}
        onShuffle={toggleShuffle}
        isShuffled={isShuffled}
        repeatMode={repeatMode}
        onToggleRepeat={() => {
          setRepeatMode(prev => {
            if (prev === "off") return "all"
            if (prev === "all") return "one"
            return "off"
          })
        }}
      />

    </div>
  )
}

"use client"

import { useState } from "react"
import { Track, TrackList } from "@/app/app-components/player/TrackList"
import { PlayerBar } from "@/app/app-components/player/PlayerBar"

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)

  function playByIndex(index:number){
    setCurrentIndex(index)
  }

  function next(){
    if(currentIndex === null) return
    setCurrentIndex((currentIndex + 1) % tracks.length)
  }

  function prev (){
    if(currentIndex === null) return
    setCurrentIndex((currentIndex - 1 + tracks.length) % tracks.length)
  }



  return (
    <main className="p-6 pb-24 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Minha biblioteca</h1>

      <TrackList
        tracks={tracks}
        setTracks={setTracks}
        onPlay={playByIndex}
      />

      <PlayerBar
        track={tracks[currentIndex ?? -1]}
        onNext={next}
        onPrev={prev}
      />
    </main>
  )
}

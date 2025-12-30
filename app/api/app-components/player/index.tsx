"use client"

import { useEffect, useRef } from "react"

export function AudioPlayer({ trackId }: { trackId: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    async function load() {
      const res = await fetch(`http://localhost:3000/api/stream/${trackId}`)
      const { streamUrl } = await res.json()

      if (audioRef.current) {
        audioRef.current.src = streamUrl
      }
    }

    load()
  }, [trackId])

  return <audio ref={audioRef} controls />
}

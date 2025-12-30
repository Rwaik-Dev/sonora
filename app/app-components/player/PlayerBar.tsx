/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { Slider } from "@/components/ui/slider"

export function PlayerBar({
  track,
  onNext,
  onPrev,
}: {
  track?: { id: string; title: string }
  onNext: () => void
  onPrev: () => void
}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    if (!track) return

    async function load() {
      const res = await fetch(`http://localhost:3000/api/stream/${track?.id}`)
      const { streamUrl } = await res.json()

      if (audioRef.current) {
        audioRef.current.src = streamUrl
        audioRef.current.play()
        setPlaying(true)
      }
    }

    load()
  }, [track, track?.id])

  function format(sec: number) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4 space-y-2">
      <audio
        ref={audioRef}
        onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={e =>
          setDuration(e.currentTarget.duration)
        }
        onEnded={onNext}
      />

      <div className="flex justify-center items-center gap-4">
        <Button size="icon" variant="ghost" onClick={onPrev}>
          <SkipBack />
        </Button>

        <Button
          size="icon"
          onClick={() => {
            if (!audioRef.current) return
            playing
              ? audioRef.current.pause()
              : audioRef.current.play()
            setPlaying(!playing)
          }}
        >
          {playing ? <Pause /> : <Play />}
        </Button>

        <Button size="icon" variant="ghost" onClick={onNext}>
          <SkipForward />
        </Button>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <span>{format(current)}</span>

        <Slider
          value={[current]}
          max={duration}
          step={1}
          onValueChange={([v]) => {
            if (audioRef.current) {
              audioRef.current.currentTime = v
            }
          }}
        />

        <span>{format(duration)}</span>
      </div>
    </div>
  )
}

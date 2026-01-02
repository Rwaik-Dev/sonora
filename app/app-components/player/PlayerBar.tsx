/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Repeat2,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Shuffle } from "lucide-react"

type RepeatMode = "off" | "one" | "all"

export function PlayerBar({
  track,
  onNext,
  onPrev,
  onShuffle,
  isShuffled,
  repeatMode,
  onToggleRepeat
}: {
  track?: { id: string; title: string }
  onNext: () => void
  onPrev: () => void
  onShuffle: () => void
  isShuffled: boolean
  repeatMode: RepeatMode,
  onToggleRepeat: () => void

}) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  // const [repeatMode, setRepeatMode] = useState<RepeatMode>("off")

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

  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = volume
    audioRef.current.muted = muted
  }, [volume, muted])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!audioRef.current) return

      switch (e.code) {
        case "Space":
          e.preventDefault()
          playing
            ? audioRef.current.pause()
            : audioRef.current.play()
          setPlaying(!playing)
          break
        case "ArrowRight":
          audioRef.current.currentTime += 5
          break
        case "ArrowLeft":
          audioRef.current.currentTime -= 5
          break
        case "ArrowUp":
          setVolume(v => Math.min(1, v + 0.1))
          break
        case "ArrowDown":
          setVolume(v => Math.max(0, v - 0.1))
          break
        case "KeyM":
          setMuted(!muted)
          break
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [playing, muted])

  function format(sec: number) {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-violet-900 bg-background p-4 space-y-2 flex items-end justify-between gap-8">
      <div className="w-full">
        <audio
          ref={audioRef}
          onTimeUpdate={e => setCurrent(e.currentTarget.currentTime)}
          onLoadedMetadata={e =>
            setDuration(e.currentTarget.duration)
          }
          onEnded={() => {
            if (repeatMode === "one") {
              audioRef.current?.play()
              return
            }

            onNext()
          }}
        />

        <div className="flex justify-center items-center gap-2 flex-col">
          <p className="text-muted-foreground text-sm">
            {track?.title}
          </p>
          <div className="flex justify-center items-center gap-2">
            <Button size="icon" variant="ghost" onClick={onPrev}>
              <SkipBack />
            </Button>

            <Button
              size="icon"
              className="bg-violet-600 hover:bg-violet-700 text-white"
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
      <div className="h-auto">
        <div className="flex justify-center gap-1 mb-2">
          <Button
            size="icon"
            variant={isShuffled ? "default" : "ghost"}
            onClick={onShuffle}
            className={isShuffled ? "text-violet-500 bg-accent/50 hover:bg-accent border-violet-500/30 border" : ""}
          >
            <Shuffle />
          </Button>
          <Button
            size={"icon"}
            variant={"default"}
            onClick={onToggleRepeat}
            className={repeatMode !== "off" ? "text-violet-500 bg-accent/50 hover:bg-accent border-violet-500/30 border" : "text-white bg- hover:bg-accent"}
          >
            {repeatMode === "off" && <Repeat />}
            {repeatMode === "all" && <Repeat2 />}
            {repeatMode === "one" && <Repeat1 />}
          </Button>

        </div>
        <div className="flex items-center gap-2 w-32">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setMuted(!muted)}
            className={muted || volume === 0 ? "text-violet-500 bg-accent/50 hover:bg-accent " : ""}
          >
            {muted || volume === 0 ? <VolumeX /> : <Volume2 />}
          </Button>

          <Slider
            value={[muted ? 0 : volume * 100]}
            max={100}
            step={1}
            onValueChange={([v]) => {
              setVolume(v / 100)
              setMuted(v === 0)
            }}
          />
        </div>
      </div>
    </div>
  )
}

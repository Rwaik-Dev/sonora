import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export function TrackRow({
  track,
  onPlay,
}: {
  track: {
    id: string
    title: string
    artist?: string
  }
  onPlay: (id: string) => void
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-3">
      <div>
        <p className="font-medium">{track.title}</p>
        {track.artist && (
          <p className="text-sm text-muted-foreground">
            {track.artist}
          </p>
        )}
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => onPlay(track.id)}
      >
        <Play className="h-5 w-5" />
      </Button>
    </div>
  )
}

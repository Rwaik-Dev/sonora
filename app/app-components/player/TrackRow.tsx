import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import AddToPlaylistDialog from "../playlist/AddToPlaylistDialog"

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
    <div className="flex items-center justify-between rounded-lg p-3 bg-accent/50">
      <div>
        <p className="font-medium">{track.title}</p>
        {track.artist && (
          <p className="text-sm text-muted-foreground">
            {track.artist}
          </p>
        )}
      </div>

      <div className="">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => onPlay(track.id)}
          className="mr-2 hover:text-violet-600"
        >
          <Play className="h-5 w-5" />
        </Button>

        <AddToPlaylistDialog trackId={track.id} />
      </div>
    </div>
  )
}

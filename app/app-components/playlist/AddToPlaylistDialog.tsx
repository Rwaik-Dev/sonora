"use client"
import { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

type Playlist = {
    id: string,
    name: string
}

export default function AddToPlaylistDialog({ trackId }: { trackId: string }) {

    const [playlists, setPlaylists] = useState<Playlist[]>([])
    const [newName, setNewName] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (!open) return;

        fetch("http://localhost:3000/api/playlists")
            .then(res => res.json())
            .then(setPlaylists)

    }, [open])

    async function createPlaylist() {
        if (!newName) return;

        const res = await fetch("http://localhost:3000/api/playlists", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName })
        })

        const playlist = await res.json()

        setPlaylists(p => [...p, playlist])
        setNewName("")
    }

    async function addToPlaylist(playlistId: string) {
        await fetch(`http://localhost:3000/api/playlists/${playlistId}/tracks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ trackId })
        })

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="ghost" className='hover:text-violet-600'>
                    <Plus className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar à playlist</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    {playlists.map((playlist, index) => (

                        <Button
                            key={index}
                            variant="ghost"
                            className="w-full justify-start hover:bg-violet-900"
                            onClick={() => addToPlaylist(playlist.id)}
                        >
                            {playlist.name}
                        </Button>
                    ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                    <Input
                        placeholder="Nova playlist"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <Button onClick={createPlaylist} className="w-full">
                        Criar playlist
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

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

type Playlist = [
    id: string,
    name: string
]

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

    async function addToPlaylist(playlistId:string){
        
    }

    return (
        <div>AddToPlaylistDialog</div>
    )
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)

    if (!session?.user.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const playlist = await prisma.playlist.findUnique({
        where: { id: (await params).id },
        include: {
            tracks: {
                include: {
                    track: true
                }
            }
        }
    })

    if (!playlist || playlist.userId !== session.user.id) {
        return NextResponse.json({ error: "Playlist nao encontrada" }, { status: 404 })
    }

    return NextResponse.json({
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.map(track => track.track)
    })
}
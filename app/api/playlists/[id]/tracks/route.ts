import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

/**
 * Adicionar música à playlist
 */
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

    const id = (await params).id

    const { trackId } = await req.json()

    await prisma.playlistTrack.create({
        data: {
            playlistId: id,
            trackId,
        },
    })

    return NextResponse.json({ ok: true }, { status: 201 })
}

/**
 * Remover música da playlist
 */
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

    const { trackId } = await req.json()

    const id = (await params).id

    await prisma.playlistTrack.delete({
        where: {
            playlistId_trackId: {
                playlistId: id,
                trackId,
            },
        },
    })

    return NextResponse.json({ ok: true })
}

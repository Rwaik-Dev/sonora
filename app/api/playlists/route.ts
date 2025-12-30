import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Criar playlist
export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
        return NextResponse.json({ error: "Nome da playlist é obrigatório" }, { status: 400 });
    }

    const playlist = await prisma.playlist.create({
        data: {
            name: name,
            userId: session.user.id
        }
    })

    return NextResponse.json(playlist, { status: 201 });
}

//Listar playlist de usuarios
export async function GET() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id)
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })

    const playlists = await prisma.playlist.findMany({
        where: { userId: session.user.id },
        orderBy: { name: "asc" },
    })

    return NextResponse.json(playlists)
}
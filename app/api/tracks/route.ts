import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const {
    title,
    artist,
    album,
    duration,
    contentType,
    key,
  } = await req.json()

  if (!title || !contentType || !key) {
    return NextResponse.json(
      { error: "Campos obrigatórios ausentes" },
      { status: 400 }
    )
  }

  const track = await prisma.track.create({
    data: {
      userId: session.user.id,
      title,
      artist,
      album,
      duration,
      contentType,
      key,
    },
  })

  return NextResponse.json(track, { status: 201 })
}

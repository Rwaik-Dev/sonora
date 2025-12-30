import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import {
  S3Client,
  GetObjectCommand,
} from "@aws-sdk/client-s3"

import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function GET(
  req: Request,
  {params}:{params:Promise<{id : string}>}
) {
  const session = await getServerSession(authOptions)

  const id  = (await params).id;

  if (!id) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
  }

  const track = await prisma.track.findUnique({
    where: { id: id },
  })

  if (!track || track.userId !== session.user.id) {
    return NextResponse.json(
      { error: "Música não encontrada" },
      { status: 404 }
    )
  }

  const bucket = await prisma.bucket.findUnique({
    where: { userId: session.user.id },
  })

  if (!bucket) {
    return NextResponse.json(
      { error: "Bucket não encontrado" },
      { status: 404 }
    )
  }

  const client = new S3Client({
    region: "auto",
    endpoint: bucket.endpoint,
    credentials: {
      accessKeyId: bucket.accessKeyId,
      secretAccessKey: bucket.secretAccessKey,
    },
  })

  const command = new GetObjectCommand({
    Bucket: bucket.bucketName,
    Key: track.key,
    ResponseContentType: track.contentType,
  })

  const streamUrl = await getSignedUrl(client, command, {
    expiresIn: 60 * 5, // 5 minutos
  })

  return NextResponse.json({ streamUrl })
}

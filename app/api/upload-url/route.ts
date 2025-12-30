import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3"


import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Não autenticado" }, { status: 401 })
    }

    const { filename, contentType } = await req.json();

    if (!filename || !contentType) {
        return NextResponse.json({ error: "Dados inválidos" }, { status: 400 })
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

    const key = `tracks/${crypto.randomUUID()}-${filename}`

    const command = new PutObjectCommand({
        Bucket: bucket.bucketName,
        Key: key,
        ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(client, command, {
        expiresIn: 60 * 5, // 5 minutos
    })

    console.log("uploadUrl: ", uploadUrl)

    return NextResponse.json({
        uploadUrl,
        key
    })

}
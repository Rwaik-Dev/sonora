import { authOptions } from '@/lib/auth';
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { bucketSchema } from './schema';

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return NextResponse.json(
            { error: "Não autenticado" },
            { status: 401 }
        )
    }

    const body = await req.json()

    const parsed = bucketSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.flatten().fieldErrors },
            { status: 400 }
        )
    }

    const { accountId, bucketName, endpoint } = parsed.data

    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    })

    if (!user) {
        return NextResponse.json(
            { error: "Usuário não encontrado" },
            { status: 404 }
        )
    }

    const existingBucket = await prisma.bucket.findUnique({
        where: { userId: user.id }
    })

    if (existingBucket) {
        return NextResponse.json(
            { error: "Usuário ja possui um bucket cadastrado" },
            { status: 409 }
        )
    }

    const bucket = await prisma.bucket.create({
        data: {
            userId: user.id,
            accountId,
            bucketName,
            endpoint
        }
    })

    return NextResponse.json(bucket, { status: 201 })

}
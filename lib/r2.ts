/* eslint-disable @typescript-eslint/no-explicit-any */
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

type ValidadeR2Input = {
    endpoint: string,
    accessKeyId: string,
    secretAccessKey: string,
    bucketName: string,
}

export async function validateR2Connection({
    endpoint,
    accessKeyId,
    secretAccessKey,
    bucketName,
}: ValidadeR2Input) {
    const client = new S3Client({
        region: "auto",
        endpoint,
        credentials: {
            accessKeyId,
            secretAccessKey,
        }
    })

    try {
        await client.send(
            new ListObjectsV2Command({
                Bucket: bucketName,
                MaxKeys: 1,
            })
        )
        return { success: true }
    } catch (e: any) {
        return {
            success: false,
            error: e.name || "Erro ao conectar no R2"
        }
    }
}
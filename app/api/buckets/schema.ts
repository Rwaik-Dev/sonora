import {z} from "zod"

export const bucketSchema = z.object({
    accountId: z.string().min(1, "Account ID is required"),
    bucketName: z.string().min(1, "Bucket name is required"),
    endpoint: z.string().url( "Invalid endpoint"),
})

export type bucketInput = z.infer<typeof bucketSchema>
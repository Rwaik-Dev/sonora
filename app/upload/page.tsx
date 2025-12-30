/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from 'react'

const handleUpload = async (file: any) => {
    try {
        const urlRes = await fetch("http://localhost:3000/api/upload-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                filename: file.name,
                contentType: file.type,
            }),
        })

        if (!urlRes.ok) throw new Error("Erro ao gerar URL assinada")

        const { uploadUrl, key } = await urlRes.json()

        console.log({ url: uploadUrl, key: key })

        // 2️⃣ upload direto no R2
        const uploadRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file
        })

        if (!uploadRes.ok) throw new Error(`Erro no upload R2: ${uploadRes.statusText}`)

        // 3️⃣ salvar metadata no banco
        await fetch("http://localhost:3000/api/tracks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: file.name.replace(".mp3", ""),
                contentType: file.type,
                key,
            }),
        })
    } catch (error) {
        console.error("Falha no processo de upload:", error)
    }
}

export default function UploadPage() {
    const [file, setFile] = useState<File | undefined>(undefined);
    console.log(file)

    return (
        <div className='w-screen h-screen flex justify-center bg-primary '>
            <div className='mt-6 border p-4 rounded-md h-min bg-card'>
                <h1>Upload de Músicas</h1>
                <p>Faça o upload das sua música aqui.</p>
                <form action="" method="post" className='flex flex-col mt-2 gap-2' onSubmit={(e) => {
                    e.preventDefault()
                    if (file) handleUpload(file)
                }}>
                    <input type="file" accept="audio/*" className='' onChange={(e) => setFile(e.target.files?.[0])} />
                    <button type="submit" className='shadow-md text-primary rounded-md p-2 bg-violet-500 font-bold'>Upload</button>
                </form>
            </div>
        </div>
    )
}

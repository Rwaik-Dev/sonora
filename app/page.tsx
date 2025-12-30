import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AudioPlayer } from "./api/app-components/player"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="p-6">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <div className="">
        <AudioPlayer trackId="cmjrjsp2k0001g4cvd46osc2s" />
      </div>
    </main>
  )
}

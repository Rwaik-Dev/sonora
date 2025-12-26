import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="p-6">
      <pre>{JSON.stringify(session, null, 2)}</pre>
    </main>
  )
}

"use client"
import { useSession } from "next-auth/react"
import { signIn, signOut } from "@/auth/helpers"

export default function AuthButton() {
  const session = useSession()

  return session?.data?.user ? (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded"
      onClick={async () => {
        await signOut()
        await signIn()
      }}>
      {session.data?.user?.name} : Sign Out
    </button>
  ) : (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={async () => await signIn()}>
      Sign In
    </button>
  )
}

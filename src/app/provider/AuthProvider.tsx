"use client"
import Loading from "@/app/components/Loading"
import LoginPage from "@/app/components/LoginPage"
import { trpc } from "@/app/trpc/client"

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, data: user } = trpc.user.user.useQuery()

  if (isLoading) {
    return <Loading />
  }

  if (!user) {
    return <LoginPage />
  }

  return <>{children}</>
}

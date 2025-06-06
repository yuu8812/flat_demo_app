import MainPage from "@/app/components/MainPage"
import type { FC } from "react"
import { Toaster } from "sonner"
import { AuthProvider } from "./provider/AuthProvider"

const Home: FC = async () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <MainPage />
    </AuthProvider>
  )
}

export default Home

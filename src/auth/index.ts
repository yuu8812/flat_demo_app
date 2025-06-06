import { prisma } from "@/prisma_client"
import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { type NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

// 認証APIのベースパス

export const BASE_PATH = "/api/auth"

const authOptions: NextAuthConfig = {
  providers: [Google],
  // 認証APIのベースパス
  basePath: BASE_PATH,
  // シークレットキーの設定
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma)
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions)

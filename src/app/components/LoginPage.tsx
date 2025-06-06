"use client"

import { signIn } from "next-auth/react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-white text-center mb-6">メモアプリにログイン</h1>

        {/* ログインボタン */}
        <button onClick={() => signIn()} type="button" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
          ログインする
        </button>
      </div>
    </div>
  )
}

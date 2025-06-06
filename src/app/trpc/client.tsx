"use client"
import { type QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createTRPCReact, httpBatchLink } from "@trpc/react-query"
import type React from "react"
import { useState } from "react"
import { makeQueryClient } from "./query-client"
import type { AppRouter } from "./routers/_app"

/**
 * Client-Side (SPA) 向けの tRPC client.
 */
export const trpc = createTRPCReact<AppRouter>({})

// tRPC client のシングルトン共有.
let clientQueryClientSingleton: QueryClient | undefined = undefined
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient()
  }
  // Browser: use singleton pattern to keep the same query client
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  return (clientQueryClientSingleton ??= makeQueryClient())
}

/**
 * TRPC Provider (wrapper component) for layout.tsx.
 */
export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient()

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "/api/trpc"
        })
      ]
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  )
}

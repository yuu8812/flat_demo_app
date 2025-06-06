import { auth } from "@/auth"
import { initTRPC } from "@trpc/server"
import { cache } from "react"

/**
 * tRPC 応答時に参照できるコンテキストの生成関数.
 */
export const createTRPCContext = cache(async () => {
  const session = await auth()

  if (!session) {
    // If there is no session, return an empty context.
    // This is useful for public routes where authentication is not required.
    return {}
  }

  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { userId: session?.user?.id ?? "" }
})

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<typeof createTRPCContext>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
})

// Base router and procedure helpers
export const createTRPCRouter = t.router

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized: User ID is required")
  }
  return next({
    ctx: {
      userId: ctx.userId
    }
  })
})

export const createCallerFactory = t.createCallerFactory
export const baseProcedure = t.procedure

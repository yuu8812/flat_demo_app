import { userRouter } from "@/app/trpc/routers/user"
import { createTRPCRouter } from "../init"
import { memoRouter } from "./memo"

export const appRouter = createTRPCRouter({
  memo: memoRouter,
  user: userRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

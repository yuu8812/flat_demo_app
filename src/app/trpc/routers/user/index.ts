import { baseProcedure, createTRPCRouter } from "@/app/trpc/init"
import { auth } from "@/auth"

export const userRouter = createTRPCRouter({
  // 単体取得
  user: baseProcedure.query(async () => {
    const user = await auth()
    return user
  })
})

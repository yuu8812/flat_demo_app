import { prisma } from "@/prisma_client"
import { z } from "zod"
import { protectedProcedure, createTRPCRouter } from "../../init"

const memoGetByIdSchema = z.object({
  id: z.string().cuid()
})

const memoCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required")
})

const memoUpdateSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required")
})

const memoDeleteSchema = z.object({
  id: z.string().cuid()
})

export const memoRouter = createTRPCRouter({
  // 単体取得
  getById: protectedProcedure.input(memoGetByIdSchema).query(async ({ input, ctx }) => {
    const memo = await prisma.memo.findUnique({
      where: { id: input.id, deletedAt: null, userId: ctx.userId }
    })
    return memo
  }),

  // 全件取得
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const memos = await prisma.memo.findMany({ where: { deletedAt: null, userId: ctx.userId }, orderBy: { createdAt: "desc" } })
    return memos
  }),

  // 作成
  create: protectedProcedure.input(memoCreateSchema).mutation(async ({ input, ctx }) => {
    const memo = await prisma.memo.create({
      data: {
        userId: ctx.userId,
        title: input.title,
        content: input.content
      }
    })
    return memo
  }),

  // 更新
  update: protectedProcedure.input(memoUpdateSchema).mutation(async ({ input, ctx }) => {
    const memo = await prisma.memo.update({
      where: { id: input.id, deletedAt: null, userId: ctx.userId },
      data: {
        title: input.title,
        content: input.content
      }
    })
    return memo
  }),

  // 論理削除
  delete: protectedProcedure.input(memoDeleteSchema).mutation(async ({ input, ctx }) => {
    const memo = await prisma.memo.update({
      where: { id: input.id, deletedAt: null, userId: ctx.userId },
      data: { deletedAt: new Date() }
    })
    return memo
  })
})

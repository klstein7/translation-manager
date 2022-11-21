import { CreateSourceSchema, UpdateSourceSchema } from "@/schema/sources";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const sourceRouter = router({
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.source.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          domain: true,
          createdBy: true,
          translations: {
            include: {
              language: true,
              createdBy: true,
            },
            orderBy: {
              language: {
                name: "asc",
              },
            },
          },
        },
      });
    }),
  find: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.source.findMany({
      include: {
        domain: true,
        createdBy: true,
        translations: {
          include: {
            language: true,
            createdBy: true,
          },
          orderBy: {
            language: {
              name: "asc",
            },
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });
  }),
  create: publicProcedure
    .input(CreateSourceSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.source.create({
        data: {
          ...input,
          translations: {
            create: input.translations?.map((translation) => ({
              ...translation,
            })),
          },
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.source.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: publicProcedure
    .input(UpdateSourceSchema)
    .mutation(({ ctx, input }) => {
      return ctx.prisma.source.update({
        where: {
          id: input.id,
        },
        data: input,
      });
    }),
});

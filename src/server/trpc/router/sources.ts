import { CreateSourceSchema } from "@/schema/sources";
import { publicProcedure, router } from "../trpc";

export const sourceRouter = router({
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
});

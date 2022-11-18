import { z } from "zod";
import { CreateTranslationSchema } from "./translations";

export const SourceSchema = z.object({
  id: z.string(),
  key: z.string().min(1),
  text: z.string().min(1),
  domainId: z.string().min(1),
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateSourceSchema = SourceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
}).merge(
  z.object({
    translations: z.array(CreateTranslationSchema),
  })
);

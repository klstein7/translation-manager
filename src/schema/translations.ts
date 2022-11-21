import { z } from "zod";

export const TranslationSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  languageId: z.string().min(1),
  createdById: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateTranslationSchema = TranslationSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  createdById: true,
});

export const UpdateTranslationSchema = TranslationSchema.partial({
  text: true,
  languageId: true,
}).omit({
  createdAt: true,
  updatedAt: true,
  createdById: true,
});

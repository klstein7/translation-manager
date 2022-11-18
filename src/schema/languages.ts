import { z } from "zod";

export const LanguageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  code: z.string().min(1),
});

export const CreateLanguageSchema = LanguageSchema.omit({
  id: true,
});

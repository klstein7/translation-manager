import { z } from "zod";

export const DomainSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export const CreateDomainSchema = DomainSchema.omit({
  id: true,
});

import { trpc } from "@/utils/trpc";

export const useCreateDomain = () => {
  const context = trpc.useContext();
  return trpc.domains.create.useMutation({
    onSuccess: () => {
      context.domains.find.invalidate();
    },
  });
};

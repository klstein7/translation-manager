import { trpc } from "@/utils/trpc";

export const useCreateSource = () => {
  const context = trpc.useContext();
  return trpc.sources.create.useMutation({
    onSuccess: () => {
      context.sources.find.invalidate();
    },
  });
};

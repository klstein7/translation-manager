import { trpc } from "@/utils/trpc";

export const useDeleteSource = () => {
  const context = trpc.useContext();
  return trpc.sources.delete.useMutation({
    onSuccess: () => {
      context.sources.find.invalidate();
    },
  });
};

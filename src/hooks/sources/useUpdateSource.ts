import { trpc } from "@/utils/trpc";

export const useUpdateSource = () => {
  const context = trpc.useContext();
  return trpc.sources.update.useMutation({
    onSuccess: ({ id }) => {
      context.sources.get.invalidate({ id });
    },
  });
};

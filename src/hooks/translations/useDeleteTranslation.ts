import { trpc } from "@/utils/trpc";

export const useDeleteTranslation = () => {
  const context = trpc.useContext();
  return trpc.translations.delete.useMutation({
    onSuccess: ({ sourceId }) => {
      context.sources.get.invalidate({ id: sourceId });
    },
  });
};

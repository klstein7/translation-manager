import { useCreateLanguage } from "@/hooks";
import { CreateLanguageSchema } from "@/schema";
import { Stack, TextInput, Group, Button } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { z } from "zod";

export type CreateLanguageFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const CreateLanguageForm = ({
  onSuccess,
  onCancel,
}: CreateLanguageFormProps) => {
  const createLanguageMutation = useCreateLanguage();
  const form = useForm<z.infer<typeof CreateLanguageSchema>>({
    validate: zodResolver(CreateLanguageSchema),
    initialValues: {
      name: "",
      code: "",
    },
  });
  return (
    <Stack align="stretch">
      <TextInput
        variant="filled"
        label="Name"
        description="The name of the language (unique)"
        placeholder="e.g. French"
        {...form.getInputProps("name")}
      />
      <TextInput
        variant="filled"
        label="Code"
        description="The language code of the language (unique)"
        placeholder="e.g. fr"
        {...form.getInputProps("code")}
      />
      <Group position="right" spacing="xs">
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="xs"
          loading={createLanguageMutation.isLoading}
          onClick={async () => {
            form.validate();
            if (form.isValid()) {
              await createLanguageMutation.mutateAsync(form.values);
              onSuccess?.();
            }
          }}
        >
          Add
        </Button>
      </Group>
    </Stack>
  );
};

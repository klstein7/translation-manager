import { useCreateDomain } from "@/hooks";
import { CreateDomainSchema } from "@/schema";
import { Button, Group, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { z } from "zod";

export type CreateDomainFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const CreateDomainForm = ({
  onSuccess,
  onCancel,
}: CreateDomainFormProps) => {
  const createDomainMutation = useCreateDomain();
  const form = useForm<z.infer<typeof CreateDomainSchema>>({
    validate: zodResolver(CreateDomainSchema),
    initialValues: {
      name: "",
    },
  });
  return (
    <Stack align="stretch">
      <TextInput
        label="Name"
        description="The name of the domain (unique)"
        placeholder="e.g. payments-webapp"
        {...form.getInputProps("name")}
      />
      <Group position="right" spacing="xs">
        <Button size="xs" color="gray" variant="subtle" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          size="xs"
          loading={createDomainMutation.isLoading}
          onClick={async () => {
            form.validate();
            if (form.isValid()) {
              await createDomainMutation.mutateAsync(form.values);
              onSuccess?.();
            }
          }}
        >
          Create
        </Button>
      </Group>
    </Stack>
  );
};

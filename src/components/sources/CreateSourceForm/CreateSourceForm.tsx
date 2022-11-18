import { CreateDomainForm } from "@/components/domains";
import { CreateTranslationForm } from "@/components/translations/CreateTranslationForm";
import { useCreateSource, useDomains } from "@/hooks";
import { CreateSourceSchema } from "@/schema/sources";
import {
  Box,
  Button,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { createFormContext, zodResolver } from "@mantine/form";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { MdAdd } from "react-icons/md";
import type { z } from "zod";

export const [FormProvider, useFormContext, useForm] =
  createFormContext<z.infer<typeof CreateSourceSchema>>();

export const CreateSourceForm = () => {
  const createTranslationMutation = useCreateSource();
  const theme = useMantineTheme();
  const domains = useDomains();

  const [showDomainForm, setShowDomainForm] = useState(false);

  const form = useForm({
    validate: zodResolver(CreateSourceSchema),
    initialValues: {
      domainId: "",
      key: "",
      text: "",
      translations: [
        {
          languageId: "",
          text: "",
        },
      ],
    },
  });

  const domainSelectItems = useMemo(() => {
    return (
      domains.data?.map((domain) => ({
        label: domain.name,
        value: domain.id,
      })) ?? []
    );
  }, [domains.data]);

  useEffect(() => {
    if (form.values.domainId) {
      setShowDomainForm(false);
    }
  }, [form.values.domainId]);

  return (
    <FormProvider form={form}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await createTranslationMutation.mutateAsync(values);
        })}
      >
        <Stack align="stretch">
          <TextInput
            variant="filled"
            label="Key"
            description="A unique key to assign to this translation"
            placeholder="e.g. pre_authorized_payments"
            {...form.getInputProps("key")}
          />
          <Group align="flex-end">
            <Select
              clearable
              searchable
              variant="filled"
              label="Domain"
              description="The domain this translation belongs to"
              placeholder="Select domain..."
              data={domainSelectItems}
              sx={{ flex: 1 }}
              rightSection={
                domains.isLoading && <Loader size={20} color="blue" />
              }
              {...form.getInputProps("domainId")}
            />
            {!showDomainForm && !form.values.domainId && (
              <Button
                color="gray"
                variant="subtle"
                leftIcon={<MdAdd />}
                sx={{ flex: 0 }}
                onClick={() => setShowDomainForm(!showDomainForm)}
              >
                Add
              </Button>
            )}
          </Group>
          <AnimatePresence>
            {showDomainForm && (
              <Box
                p="md"
                component={motion.div}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                sx={{
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.colors.dark[5]}`,
                }}
              >
                <CreateDomainForm
                  onCancel={() => setShowDomainForm(false)}
                  onSuccess={() => {
                    setShowDomainForm(false);
                  }}
                />
              </Box>
            )}
          </AnimatePresence>
          <Textarea
            variant="filled"
            label="Source text"
            description="The text to be translated (in English)"
            placeholder="e.g. Pre-authorized Payments"
            minRows={4}
            {...form.getInputProps("text")}
          />
          <Stack spacing="xs">
            <Group align="center" position="apart">
              <Text weight={500}>Attach translations</Text>
              <Button
                size="xs"
                variant="subtle"
                color="gray"
                leftIcon={<MdAdd />}
                onClick={() => {
                  form.insertListItem("translations", {
                    text: "",
                    languageId: "",
                  });
                }}
              >
                Add another
              </Button>
            </Group>
            {form.values.translations?.map((translation, index) => (
              <CreateTranslationForm
                key={`create-translation-${index}`}
                translation={translation}
                index={index}
              />
            ))}
          </Stack>
          <Group position="right" pt="md" spacing="xs">
            <Button variant="subtle" color="gray">
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
};

import { CreateDomainForm } from "@/components/domains";
import { CreateTranslationForm } from "@/components/translations/CreateTranslationForm";

import { useCreateSource, useDomains, useLanguages } from "@/hooks";
import { CreateSourceSchema } from "@/schema/sources";
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Loader,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { createFormContext, zodResolver } from "@mantine/form";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { MdAdd, MdDelete } from "react-icons/md";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import type { z } from "zod";

export const [FormProvider, useFormContext, useForm] =
  createFormContext<z.infer<typeof CreateSourceSchema>>();

export type CreateSourceFormProps = {
  onSuccess?: () => void;
  onCancel?: () => void;
};

export const CreateSourceForm = ({
  onCancel,
  onSuccess,
}: CreateSourceFormProps) => {
  const createSourceMutation = useCreateSource();
  const theme = useMantineTheme();
  const domains = useDomains();
  const languages = useLanguages();

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const getLanguage = (id: string) => {
    return languages.data?.find((language) => language.id === id);
  };

  const [showDomainForm, setShowDomainForm] = useState(false);

  const form = useForm({
    validate: zodResolver(CreateSourceSchema),
    initialValues: {
      domainId: "",
      key: "",
      text: "",
      translations: [],
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

  return (
    <FormProvider form={form}>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await createSourceMutation.mutateAsync(values);
          onSuccess?.();
        })}
      >
        <Stack align="stretch">
          <TextInput
            label="Key"
            description="A unique key to assign to this translation"
            placeholder="e.g. pre_authorized_payments"
            {...form.getInputProps("key")}
          />
          <Group align="flex-end">
            <Select
              clearable
              searchable
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
                color="blue"
                variant="subtle"
                leftIcon={<MdAdd />}
                sx={{ flex: 0 }}
                onClick={() => setShowDomainForm(!showDomainForm)}
              >
                New
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
                  border: `1px solid ${theme.colors.gray[1]}`,
                  backgroundColor: theme.white,
                }}
              >
                <Text size="xs" color="dimmed">
                  Create new domain
                </Text>
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
            label="Source text"
            description="The text to be translated (in English)"
            placeholder="e.g. Pre-authorized Payments"
            minRows={4}
            {...form.getInputProps("text")}
          />
          <Stack ref={parent} spacing="xs">
            <Group align="center">
              <Text weight={500}>Add translations</Text>
              {form.errors.translations && (
                <Text color="red" size="xs">
                  {form.errors.translations}
                </Text>
              )}
            </Group>
            {form.values.translations?.map((translation, index) => (
              <Group
                key={`translation-${index}`}
                p="sm"
                position="apart"
                align="center"
                sx={{
                  backgroundColor: theme.white,
                  borderRadius: theme.radius.sm,
                }}
              >
                <Group align="center" spacing="lg">
                  <Text color="dimmed">{index + 1}</Text>
                  <Box>
                    <Text size="xs" color="dimmed">
                      {getLanguage(translation.languageId)?.name}
                    </Text>
                    <Text size="md" weight={500}>
                      {translation.text}
                    </Text>
                  </Box>
                </Group>
                <Tooltip label="Remove translation" position="left">
                  <ActionIcon
                    onClick={() => {
                      form.removeListItem("translations", index);
                    }}
                  >
                    <MdDelete />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ))}
            <CreateTranslationForm
              existingLanguages={form.values.translations.map(
                (t) => t.languageId
              )}
              onSubmit={(values) => {
                form.insertListItem("translations", values);
                form.setFieldError("translations", undefined);
              }}
            />
          </Stack>
          <Group position="right" pt="md" spacing="xs">
            <Button variant="subtle" color="gray" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" loading={createSourceMutation.isLoading}>
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
};

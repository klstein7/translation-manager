import { CreateTranslationForm } from "@/components/translations/CreateTranslationForm";
import {
  useCreateTranslation,
  useDeleteTranslation,
  useDomains,
  useSource,
  useUpdateSource,
  useUpdateTranslation,
} from "@/hooks";
import { BaseLayout } from "@/layouts/BaseLayout";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  ActionIcon,
  Alert,
  Anchor,
  Box,
  Breadcrumbs,
  Button,
  Divider,
  FocusTrap,
  Group,
  LoadingOverlay,
  Select,
  Space,
  Spoiler,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { Prism } from "@mantine/prism";
import { IconHome } from "@tabler/icons";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { MdAdd, MdDelete, MdEdit, MdWarning } from "react-icons/md";

const TranslationPage = () => {
  const router = useRouter();
  const domains = useDomains();
  const modals = useModals();

  const updateSourceMutation = useUpdateSource();
  const createTranslationMutation = useCreateTranslation();
  const updateTranslationMutation = useUpdateTranslation();
  const deleteTranslationMutation = useDeleteTranslation();

  const [editing, setEditing] = useState<string>();
  const theme = useMantineTheme();
  const source = useSource();

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const domainSelectItems = useMemo(() => {
    return (
      domains.data?.map((domain) => ({
        label: domain.name,
        value: domain.id,
      })) ?? []
    );
  }, [domains.data]);

  if (source.isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <BaseLayout>
      <Stack
        p="lg"
        sx={{
          backgroundColor: theme.colors.gray[1],
          borderRadius: theme.radius.sm,
          boxShadow: theme.shadows.md,
          border: `1px solid ${theme.colors.gray[2]}`,
        }}
      >
        <Breadcrumbs>
          <Anchor color="indigo" size="sm" onClick={() => router.push("/")}>
            <Group align="center" spacing={5}>
              <IconHome size={15} />
              Dashboard
            </Group>
          </Anchor>
          <Anchor
            color="indigo"
            size="sm"
            onClick={() => router.push(`/s/${source.data?.id}`)}
          >
            {source.data?.key}
          </Anchor>
        </Breadcrumbs>
        <Box>
          {editing === "domainId" ? (
            <FocusTrap>
              <Select
                pb="xs"
                defaultValue={source.data?.domainId}
                data={domainSelectItems}
                sx={{ maxWidth: "350px" }}
                onChange={async (domainId) => {
                  await updateSourceMutation.mutateAsync({
                    ...source.data,
                    id: source.data?.id as string,
                    domainId: domainId as string,
                  });
                  showNotification({
                    title: "Domain updated",
                    message: "The domain has been updated successfully!",
                    color: "green",
                  });
                }}
                onBlur={() => setEditing(undefined)}
              />
            </FocusTrap>
          ) : (
            <Group align="center" spacing={5}>
              <Text color="dimmed">{source.data?.domain.name}</Text>
              <Tooltip label="Edit domain">
                <ActionIcon
                  color="gray"
                  size="sm"
                  onClick={() => setEditing("domainId")}
                >
                  <MdEdit size={12} />
                </ActionIcon>
              </Tooltip>
            </Group>
          )}
          <Text mt={-10} sx={{ fontSize: 32, fontWeight: 800 }}>
            {source.data?.key}
          </Text>
        </Box>
        <Box>
          <Text color="dimmed">Source text</Text>
          {editing === "sourceText" ? (
            <FocusTrap>
              <Textarea
                py={3}
                defaultValue={source.data?.text}
                onBlur={async (e) => {
                  if (e.target.value !== source.data?.text) {
                    await updateSourceMutation.mutateAsync({
                      ...source.data,
                      id: source.data?.id as string,
                      text: e.target.value,
                    });
                    showNotification({
                      title: "Source text updated",
                      message: "The source text has been updated successfully!",
                      color: "green",
                    });
                  }
                  setEditing(undefined);
                }}
              />
            </FocusTrap>
          ) : (
            <Group align="center" spacing={5}>
              <Text size="xl" weight="bold">
                {source.data?.text}
              </Text>
              <Tooltip label="Edit source text">
                <ActionIcon
                  color="gray"
                  size="sm"
                  onClick={() => setEditing("sourceText")}
                >
                  <MdEdit size={13} />
                </ActionIcon>
              </Tooltip>
            </Group>
          )}
        </Box>
        <Divider />
        <Box>
          <Text color="dimmed">Translations</Text>
          <Stack ref={parent} spacing="xs">
            {source.data?.translations.map((translation) => (
              <Stack key={translation.id} spacing={0}>
                {editing === translation.id ? (
                  <FocusTrap>
                    <Textarea
                      py={3}
                      defaultValue={translation.text}
                      onBlur={async (e) => {
                        if (e.target.value !== translation.text) {
                          await updateTranslationMutation.mutateAsync({
                            ...translation,
                            text: e.target.value,
                          });
                          showNotification({
                            title: "Translation updated",
                            message:
                              "The translation has been updated successfully!",
                            color: "green",
                          });
                        }
                        setEditing(undefined);
                      }}
                    />
                  </FocusTrap>
                ) : (
                  <Group align="center" spacing={5}>
                    <Text size="xl" weight="bold">
                      {translation.text}
                    </Text>
                    <Tooltip
                      label={`Edit ${translation.language.name} translation`}
                    >
                      <ActionIcon
                        color="gray"
                        size="xs"
                        onClick={() => setEditing(translation.id)}
                      >
                        <MdEdit size={13} />
                      </ActionIcon>
                    </Tooltip>
                    <Tooltip
                      label={`Delete ${translation.language.name} translation`}
                    >
                      <ActionIcon
                        color="gray"
                        size="xs"
                        onClick={() => {
                          modals.openConfirmModal({
                            title: "Delete translation",
                            labels: {
                              cancel: "Cancel",
                              confirm: "Delete",
                            },
                            confirmProps: {
                              color: "red",
                              leftIcon: <MdDelete />,
                            },
                            onConfirm: async () => {
                              await deleteTranslationMutation.mutateAsync({
                                id: translation.id,
                              });
                              showNotification({
                                title: "Translation deleted",
                                message: "The translation has been deleted!",
                                color: "red",
                              });
                            },
                            children: (
                              <Alert
                                variant="outline"
                                icon={<MdWarning />}
                                color="red"
                                title="Are you sure?"
                              >
                                Are you sure you want to delete this
                                translation? This action cannot be undone.
                              </Alert>
                            ),
                          });
                        }}
                      >
                        <MdDelete size={13} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                )}
                <Text size="sm" color="dimmed">
                  {translation.language.name}
                </Text>
              </Stack>
            ))}
          </Stack>
          <Space h="sm" />
          {editing === "addTranslation" ? (
            <CreateTranslationForm
              existingLanguages={
                source.data?.translations.map(
                  (translation) => translation.language.id
                ) ?? []
              }
              onSubmit={async (values) => {
                await createTranslationMutation.mutateAsync({
                  ...values,
                  sourceId: source.data?.id as string,
                });
                showNotification({
                  title: "Translation created",
                  message: "The translation has been created successfully!",
                  color: "green",
                });
                setEditing(undefined);
              }}
              onCancel={() => setEditing(undefined)}
            />
          ) : (
            <Button
              size="xs"
              variant="outline"
              leftIcon={<MdAdd />}
              onClick={() => {
                setEditing("addTranslation");
              }}
            >
              Add
            </Button>
          )}
        </Box>
        <Divider />
        <Stack spacing="xs">
          <Box>
            <Text color="dimmed">Usage</Text>
            <Text size="xl" weight="bold">
              xlf
            </Text>
          </Box>
          {source.data?.translations.map((translation) => (
            <Stack key={`usage-${translation.id}`} spacing="xs">
              <Prism language="markdown" colorScheme="dark">
                {`
<!-- ${translation.language.name} -->                 
<trans-unit id="${source.data?.key}">
  <source>${source.data?.text}</source>
  <target>${translation.text}</target>
</trans-unit>
`}
              </Prism>
            </Stack>
          ))}
        </Stack>
        <Text size="xl" weight="bold">
          Angular
        </Text>

        <Prism language="typescript" colorScheme="dark">
          {`
// Call translation service in your component
<div>{{ translationService.translate('${source.data?.key}') | async }}</div>            
            `}
        </Prism>
        <Divider />
        <Spoiler
          maxHeight={0}
          hideLabel="Hide"
          showLabel="Angular service setup"
          styles={{
            control: {
              color: theme.colors.indigo[6],
            },
          }}
        >
          <Stack spacing="xs" py="xs">
            <Prism language="typescript" colorScheme="dark">
              {`
// translation.service.ts          
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private http: HttpClient) { }

  public translate(key: string): Observable<string> {
    return this.http.post<string>('http://localhost:3000/api/translations/', { key, code: $localize.locale });
  }
}  
              `}
            </Prism>
            <Prism language="typescript" colorScheme="dark">
              {`
// Add translation service to your component
constructor(public translationService: TranslationService) { }            
            `}
            </Prism>
          </Stack>
        </Spoiler>
      </Stack>
    </BaseLayout>
  );
};

export default TranslationPage;

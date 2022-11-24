import { CreateTranslationForm } from "@/components/translations";
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
  CopyButton,
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
import {
  MdAdd,
  MdCheck,
  MdCopyAll,
  MdDelete,
  MdEdit,
  MdWarning,
} from "react-icons/md";

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
              <Space w={5} />
              <CopyButton value={source.data?.text ?? ""} timeout={3000}>
                {({ copied, copy }) => (
                  <Tooltip
                    withArrow
                    color={copied ? "indigo" : undefined}
                    label={copied ? "Copied" : "Copy"}
                  >
                    <ActionIcon size="xs" onClick={copy}>
                      {copied ? (
                        <MdCheck color={theme.colors.indigo[7]} size={15} />
                      ) : (
                        <MdCopyAll size={15} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
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
        <Divider
          label="Translations"
          styles={{
            label: {
              fontSize: 18,
              color: theme.colors.gray[7],
            },
          }}
        />
        <Box>
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
                    <Space w={5} />
                    <CopyButton value={translation.text ?? ""} timeout={3000}>
                      {({ copied, copy }) => (
                        <Tooltip
                          withArrow
                          color={copied ? "indigo" : undefined}
                          label={copied ? "Copied" : "Copy"}
                        >
                          <ActionIcon size="xs" onClick={copy}>
                            {copied ? (
                              <MdCheck
                                color={theme.colors.indigo[7]}
                                size={15}
                              />
                            ) : (
                              <MdCopyAll size={15} />
                            )}
                          </ActionIcon>
                        </Tooltip>
                      )}
                    </CopyButton>
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
            <Box sx={{ maxWidth: theme.breakpoints.md }}>
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
            </Box>
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
        {source.data?.translations && source.data?.translations.length > 0 && (
          <Stack>
            <Divider
              label="Usage"
              styles={{
                label: {
                  fontSize: 18,
                  color: theme.colors.gray[7],
                },
              }}
            />
            <Stack spacing="xs">
              <Text size="xl" weight="bold">
                .xlf
              </Text>
              {source.data?.translations.map((translation) => (
                <Prism
                  key={`xlf-${translation.id}`}
                  language="markdown"
                  colorScheme="dark"
                  sx={{ maxWidth: theme.breakpoints.md }}
                >
                  {`
<!-- ${translation.language.name} -->                 
<trans-unit id="${source.data?.key}">
  <source>${source.data?.text}</source>
  <target>${translation.text}</target>
</trans-unit>
`}
                </Prism>
              ))}
            </Stack>
            <Stack spacing="xs">
              <Text size="xl" weight="bold">
                messages.properties
              </Text>
              {source.data?.translations.map((translation) => (
                <Prism
                  colorScheme="dark"
                  language="clike"
                  key={`messages-${translation.id}`}
                  sx={{ maxWidth: theme.breakpoints.md }}
                >
                  {`
// messages_${translation.language.code}.properties
${source.data?.domain.name}.${source.data?.key.toUpperCase()}=${
                    translation.text
                  }
                `}
                </Prism>
              ))}
            </Stack>
            <Stack spacing="xs">
              <Text size="xl" weight="bold">
                API Endpoints
              </Text>
              {source.data?.translations.map((translation) => (
                <Prism
                  colorScheme="dark"
                  language="markdown"
                  key={`api-${translation.id}`}
                  sx={{ maxWidth: theme.breakpoints.md }}
                >
                  {`
${window.location.origin}/api/translations?key=${source.data?.key}&code=${translation.language.code}
              `}
                </Prism>
              ))}
            </Stack>
            <Stack spacing="xs">
              <Text size="xl" weight="bold">
                Angular
              </Text>
              <Prism
                language="typescript"
                colorScheme="dark"
                sx={{ maxWidth: theme.breakpoints.md }}
              >
                {`
// Call translation service in your component
<div>{{ translationService.translate('${source.data?.key}') | async }}</div>            
            `}
              </Prism>
            </Stack>
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
                <Prism
                  language="typescript"
                  colorScheme="dark"
                  sx={{ maxWidth: theme.breakpoints.md }}
                >
                  {`
// translation.service.ts          
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

const BASE_URI = '${window.location.origin}/api/translations';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {

  constructor(private http: HttpClient) { }

  public translate(key: string): Observable<string> {
    return this.http.get<string>(\`\${BASE_URI}?key=\${key}&code=\${$localize.locale}\`);
  }
}  
              `}
                </Prism>
                <Prism
                  language="typescript"
                  colorScheme="dark"
                  sx={{ maxWidth: theme.breakpoints.md }}
                >
                  {`
// Add translation service to your component
constructor(public translationService: TranslationService) { }            
            `}
                </Prism>
              </Stack>
            </Spoiler>
          </Stack>
        )}
      </Stack>
    </BaseLayout>
  );
};

export default TranslationPage;

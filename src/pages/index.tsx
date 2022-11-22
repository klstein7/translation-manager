import { CreateSourceForm } from "@/components/sources";
import { SourceDataTable } from "@/components/sources/SourceDataTable";
import { useSources } from "@/hooks";
import { BaseLayout } from "@/layouts/BaseLayout";
import {
  Anchor,
  Box,
  Breadcrumbs,
  Group,
  LoadingOverlay,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconHome } from "@tabler/icons";
import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { MdSearch, MdAdd } from "react-icons/md";

const Home: NextPage = () => {
  const theme = useMantineTheme();
  const modals = useModals();
  const router = useRouter();
  const sources = useSources();

  if (sources.isLoading) {
    return <LoadingOverlay visible />;
  }

  return (
    <BaseLayout
      topNavItems={[
        {
          icon: MdSearch,
          label: "Search (not yet implemented)",
        },
        {
          icon: MdAdd,
          label: "Create",
          onClick: () => {
            const modalId = modals.openModal({
              title: "Create a source",
              size: "xl",
              styles: {
                modal: {
                  backgroundColor: theme.colors.gray[0],
                },
              },
              children: (
                <CreateSourceForm
                  onCancel={() => {
                    modals.closeModal(modalId);
                  }}
                  onSuccess={() => {
                    modals.closeModal(modalId);
                    showNotification({
                      title: "Source created",
                      message: "Source was successfully created!",
                      color: "green",
                    });
                  }}
                />
              ),
            });
          },
        },
      ]}
    >
      <Head>
        <title>Translation Manager</title>
        <meta name="description" content="Translation management made simple" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
        </Breadcrumbs>
        <SourceDataTable sources={sources.data ?? []} />
      </Stack>
    </BaseLayout>
  );
};

export default Home;

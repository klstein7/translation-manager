import { Sidebar } from "@/components/ui";
import { MdAdd, MdSearch, MdTranslate } from "react-icons/md";
import { Flex, Stack } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { CreateSourceForm } from "@/components/sources";

export type BaseLayoutProps = {
  children: React.ReactNode;
};

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  const modals = useModals();
  return (
    <Flex sx={{ minHeight: "100vh" }}>
      <Sidebar
        brandLogo={MdTranslate}
        topNavItems={[
          {
            icon: MdSearch,
            label: "Search",
          },
          {
            icon: MdAdd,
            label: "Create",
            onClick: () => {
              modals.openModal({
                title: "Create a source",
                children: <CreateSourceForm />,
                size: "lg",
              });
            },
          },
        ]}
      />
      <Stack px="xl" pt="xl" sx={{ flex: 1 }}>
        {children}
      </Stack>
    </Flex>
  );
};

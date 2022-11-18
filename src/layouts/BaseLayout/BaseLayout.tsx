import type { SidebarItemProps } from "@/components/ui";
import { Sidebar } from "@/components/ui";
import { MdTranslate } from "react-icons/md";
import { Flex, Stack } from "@mantine/core";

export type BaseLayoutProps = {
  topNavItems?: SidebarItemProps[];
  children: React.ReactNode;
};

export const BaseLayout = ({ topNavItems, children }: BaseLayoutProps) => {
  return (
    <Flex sx={{ minHeight: "100vh" }}>
      <Sidebar brandLogo={MdTranslate} topNavItems={topNavItems} />
      <Stack px="xl" pt="xl" sx={{ flex: 1 }}>
        {children}
      </Stack>
    </Flex>
  );
};

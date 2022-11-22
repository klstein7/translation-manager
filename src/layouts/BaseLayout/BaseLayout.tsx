import type { SidebarItemProps } from "@/components/ui";
import { Sidebar } from "@/components/ui";
import { MdTranslate } from "react-icons/md";
import { Flex, ScrollArea, Stack, useMantineTheme } from "@mantine/core";

export type BaseLayoutProps = {
  topNavItems?: SidebarItemProps[];
  children: React.ReactNode;
};

export const BaseLayout = ({ topNavItems, children }: BaseLayoutProps) => {
  const theme = useMantineTheme();
  return (
    <Flex sx={{ height: "100vh", backgroundColor: theme.colors.gray[0] }}>
      <Sidebar brandLogo={MdTranslate} topNavItems={topNavItems} />
      <ScrollArea sx={{ width: "100%" }}>
        <Stack p="xl" sx={{ flex: 1, maxWidth: theme.breakpoints.xl }}>
          {children}
        </Stack>
      </ScrollArea>
    </Flex>
  );
};

import type { IconType } from "react-icons";
import { Center, Drawer, Stack, useMantineTheme } from "@mantine/core";
import { motion } from "framer-motion";
import { useState } from "react";

export type SidebarProps = {
  brandLogo: IconType;
  topNavItems?: SidebarItemProps[];
};

export const Sidebar = ({
  brandLogo: BrandLogo,
  topNavItems,
}: SidebarProps) => {
  const theme = useMantineTheme();

  return (
    <Stack
      py="xl"
      align="center"
      sx={{
        width: 50,
        color: theme.colors.indigo[0],
        backgroundImage: theme.fn.gradient({
          from: "blue",
          to: "indigo",
        }),
      }}
    >
      <BrandLogo size={30} />
      <Stack sx={{ width: "100%" }} spacing={0}>
        {topNavItems?.map((item, index) => (
          <SidebarItem key={`top-nav-${index}`} {...item} />
        ))}
      </Stack>
    </Stack>
  );
};

export type SidebarItemProps = {
  icon: IconType;
  label: string;
  active?: boolean;
  onClick?: () => void | Promise<void>;
};

export const SidebarItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: SidebarItemProps) => {
  const theme = useMantineTheme();
  return (
    <Center
      component={motion.div}
      py="xs"
      sx={{
        width: "100%",
      }}
      whileHover={{
        cursor: "pointer",
        backgroundColor: theme.fn.rgba(theme.colors.blue[0], 0.1),
        transition: {
          duration: 0.1,
        },
      }}
      whileTap={{
        backgroundColor: theme.fn.rgba(theme.colors.blue[0], 0.25),
        transition: {
          duration: 0.1,
        },
      }}
      onClick={onClick}
    >
      <Icon size={25} />
    </Center>
  );
};

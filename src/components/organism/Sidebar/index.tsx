import React, { FC, memo, PropsWithChildren } from "react";
import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { FiHome, FiTrendingUp } from "react-icons/fi";
import {
  APPLICANTS_ROUTE,
  INSTRUCTORS,
  JOBS_ROUTE,
  OFFLINE_COURSES_FOR_KIDS_ROUTE,
  OFFLINE_COURSES_ROUTE,
  ONLINE_COURSES_ROUTE,
  USERS_LIST_ROUTE,
} from "@/utils/constants/routes";
import { LinkItemProps } from "@/utils/models/sidebar";
import MobileNav from "./MobileNav";
import SidebarContent from "./SidebarContent";

const linkItems: LinkItemProps[] = [
  {
    name: "Common",
    icon: FiHome,
    children: [
      { title: "All Users", href: USERS_LIST_ROUTE },
      { title: "Jobs", href: JOBS_ROUTE },
    ],
  },
  {
    name: "Courses",
    icon: FiTrendingUp,
    children: [
      { title: "Online", href: ONLINE_COURSES_ROUTE },
      { title: "Offline", href: OFFLINE_COURSES_ROUTE },
      { title: "Offline for kids", href: OFFLINE_COURSES_FOR_KIDS_ROUTE },
      { title: "Instructors", href: INSTRUCTORS },
    ],
  },
  {
    name: "Form",
    icon: FiTrendingUp,
    children: [{ title: "Applicants", href: APPLICANTS_ROUTE }],
  },
];

const Sidebar: FC<PropsWithChildren> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Box minH="100vh" bg="#ffffff">
      <SidebarContent
        onClose={onClose}
        linkItems={linkItems}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full">
        <DrawerContent>
          <SidebarContent onClose={onClose} linkItems={linkItems} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box ml={{ base: 0, md: 60 }}>{children}</Box>
    </Box>
  );
};
export default memo(Sidebar);

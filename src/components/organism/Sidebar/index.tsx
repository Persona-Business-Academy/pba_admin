import React, { FC } from "react";
import { Box, Drawer, DrawerContent, useDisclosure } from "@chakra-ui/react";
import { FiHome, FiTrendingUp } from "react-icons/fi";
import {
 USERS_ACTIVITY_ROUTE,
 USERS_ANALYTICS_ROUTE,
 USERS_LIST_ROUTE,
} from "@/constants/routes";
import { LinkItemProps } from "@/models/sidebar";
import MobileNav from "./MobileNav";
import SidebarContent from "./SidebarContent";

const linkItems: LinkItemProps[] = [
 {
  name: "Users",
  icon: FiHome,
  children: [
   {
    title: "All Users",
    href: USERS_LIST_ROUTE,
   },
   {
    title: "Analytics",
    href: USERS_ANALYTICS_ROUTE,
   },
   {
    title: "Activity",
    href: USERS_ACTIVITY_ROUTE,
   },
  ],
 },
 {
  name: "Courses",
  icon: FiTrendingUp,
  children: [
   {
    title: "Development",
    href: "/development",
   },
   {
    title: "Graphic Design",
    href: "/graphic-design",
   },
   {
    title: "Project Management",
    href: "/project-management",
   },
  ],
 },
 {
  name: "Submit Form",
  icon: FiTrendingUp,
  children: [
   {
    title: "Contact Us",
    href: "/development",
   },
   {
    title: "Job",
    href: "/job-applicants",
   },
  ],
 },
];

interface SidebarProps {
 children: React.ReactNode;
}
const Sidebar: FC<SidebarProps> = ({ children }) => {
 const { isOpen, onOpen, onClose } = useDisclosure();
 return (
  <Box minH="100vh" bg="#ffffff">
   <SidebarContent
    onClose={() => onClose}
    linkItems={linkItems}
    display={{ base: "none", md: "block" }}
   />
   <Drawer
    isOpen={isOpen}
    placement="left"
    onClose={onClose}
    returnFocusOnClose={false}
    onOverlayClick={onClose}
    size="full"
   >
    <DrawerContent>
     <SidebarContent onClose={onClose} linkItems={linkItems} />
    </DrawerContent>
   </Drawer>
   <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
   <Box ml={{ base: 0, md: 60 }} p="4">
    {children}
   </Box>
  </Box>
 );
};
export default Sidebar;

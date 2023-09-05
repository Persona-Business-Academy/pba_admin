"use client";
import { Box } from "@chakra-ui/react";
import { Sidebar } from "@/components/organism";
import Header from "@/components/organism/Header";

export default function SidebarLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
  <>
   <Header>
    <Sidebar>
     <Box mt="64px">{children}</Box>
    </Sidebar>
   </Header>
  </>
 );
}

"use client";
import { Sidebar } from "@/components/organism";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  return <Sidebar>{children}</Sidebar>;
}

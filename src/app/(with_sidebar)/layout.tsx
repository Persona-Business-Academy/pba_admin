import { Sidebar } from "@/components/organism";

export const metadata = {
 title: "PBA Website",
};

export default function SidebarLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return <Sidebar>{children}</Sidebar>;
}

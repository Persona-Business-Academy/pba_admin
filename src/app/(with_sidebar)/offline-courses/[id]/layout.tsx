import { PropsWithChildren } from "react";
import OfflineCourseProvider from "@/contexts/OfflineCourseContext";

type Props = { params: { id: string } };

export default function OfflineCourseLayout({ children, params }: PropsWithChildren<Props>) {
  return <OfflineCourseProvider id={params.id}>{children}</OfflineCourseProvider>;
}

import { PropsWithChildren } from "react";
import OnlineCourseProvider from "@/contexts/OnlineCourseContext";

type Props = { params: { id: string } };

export default function OnlineCourseLayout({ children, params }: PropsWithChildren<Props>) {
  return <OnlineCourseProvider id={params.id}>{children}</OnlineCourseProvider>;
}

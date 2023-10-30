import { OnlineCourseProvider } from "@/context/OnlineCourseContext";

type Props = { params: { id: string }; children: React.ReactNode };

export default function OnlineCourseLayout({ children, params }: Props) {
  return <OnlineCourseProvider id={params.id}>{children}</OnlineCourseProvider>;
}

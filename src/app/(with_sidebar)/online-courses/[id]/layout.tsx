import dynamic from "next/dynamic";
const OnlineCourseProvider = dynamic(() => import("@/contexts/OnlineCourseContext"));

type Props = { params: { id: string }; children: React.ReactNode };

export default function OnlineCourseLayout({ children, params }: Props) {
  return <OnlineCourseProvider id={params.id}>{children}</OnlineCourseProvider>;
}

import { PropsWithChildren, Suspense } from "react";

export default function ApplicantsLayout({ children }: PropsWithChildren) {
  return <Suspense>{children}</Suspense>;
}

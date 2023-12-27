import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { serverSession } from "@/pages/api/auth/[...nextauth]";

export const metadata = {
  title: "PBA Authentication",
};

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await serverSession();
  if (session) return redirect("/dashboard");

  return <>{children}</>;
}

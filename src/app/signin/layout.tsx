import { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { serverSession } from "@/pages/api/auth/[...nextauth]";
import { USERS_LIST_ROUTE } from "@/utils/constants/routes";

export const metadata = {
  title: "PBA Authentication",
};

export default async function AuthLayout({ children }: PropsWithChildren) {
  const session = await serverSession();
  if (session) return redirect(USERS_LIST_ROUTE);

  return <>{children}</>;
}

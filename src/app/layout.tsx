import { PropsWithChildren } from "react";
import { Providers } from "./providers";

export const metadata = {
  title: "PBA Admin",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

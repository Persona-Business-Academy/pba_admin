"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import {
 ChakraProvider,
 extendTheme,
 LightMode,
 ThemeConfig,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";

const theme: ThemeConfig = extendTheme({
 config: {
  initialColorMode: "light",
  useSystemColorMode: false,
 },
});

export function Providers({ children }: { children: React.ReactNode }) {
 const queryClient = new QueryClient();

 return (
  <SessionProvider>
   <QueryClientProvider client={queryClient}>
    <CacheProvider>
     <ChakraProvider
      theme={theme}
      toastOptions={{
       defaultOptions: { position: "bottom-right", isClosable: true },
      }}
     >
      <LightMode>{children}</LightMode>
     </ChakraProvider>
    </CacheProvider>
   </QueryClientProvider>
  </SessionProvider>
 );
}

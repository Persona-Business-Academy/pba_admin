"use client";
import { useEffect } from "react";
import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  extendTheme,
  LightMode,
  ThemeConfig,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { toastDefaultOptions } from "@/constants/chakra";

const theme: ThemeConfig = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (localStorage.getItem("chakra-ui-color-mode")) {
      localStorage.removeItem("chakra-ui-color-mode");
    }
  }, []);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CacheProvider>
          <ChakraProvider
            theme={theme}
            toastOptions={{ defaultOptions: toastDefaultOptions }}
          >
            <LightMode>{children}</LightMode>
          </ChakraProvider>
        </CacheProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import NavigationBar from "@/components/navbar";
const inter = Inter({ subsets: ["latin"] });
import { PredictionProvider } from "@/context/prediction";
import Providers from "@/components/Provider";
import { ThemeProvider } from "@/lib/provider";

export const metadata: Metadata = {
  title: "openAi",
  description: "openAi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} z-0 max-w-8xl mx-auto mt-[70px] dark:bg-light-dark text-white`}
      >
        <ThemeProvider
          enableSystem={false}
          attribute="class"
          defaultTheme="dark"
          enableColorScheme
        >
          <PredictionProvider>
            <Providers>
              <MantineProvider>
                <main>
                  <NavigationBar />
                  {children}
                </main>
              </MantineProvider>
            </Providers>
          </PredictionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

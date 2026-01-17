import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

const cairoPlay = Tajawal({
  variable: "--font-cairo-play",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "لخصها",
  description: "لخّصها AI هو تطبيق لتلخيص المستندات باللغة العربية.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairoPlay.variable} antialiased`}>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster
              position="top-center"
              duration={5000}
              style={{ zIndex: 9999 }}
            />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Todo App - Modern Task Management",
  description: "Enterprise-grade todo application with modern UI/UX - Hackathon by Tanzeel Naveed Khan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} bg-background-primary min-h-screen`}>
      <body className="antialiased bg-background-primary min-h-screen">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster
          position="top-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
              color: '#ffffff',
            },
          }}
        />
      </body>
    </html>
  );
}

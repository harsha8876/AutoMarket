import { Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import ConditionalMain from "../components/ConditionalMain";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "DriveIQ",
  description: "Find your dream car",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Header />
          <ConditionalMain>{children}</ConditionalMain>
          <Toaster richColors />
        </body>
      </html>
    </ClerkProvider>
  );
}

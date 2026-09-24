import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shivang Chauhan | SDE III & Full-Stack Architect",
  description:
    "Portfolio of Shivang Chauhan — Full-Stack & Agentic AI Engineer with 12+ years building enterprise web architectures, conversational AI runtimes, and distributed systems.",
  keywords: [
    "Shivang Chauhan",
    "SDE III",
    "Full-Stack Architect",
    "Frontend Lead",
    "Agentic AI",
    "FastAPI",
    "React",
    "Next.js",
    "TypeScript",
    "Python",
    "Bangalore",
  ],
  authors: [{ name: "Shivang Chauhan" }],
  openGraph: {
    title: "Shivang Chauhan | SDE III & Full-Stack Architect",
    description:
      "12+ years building high-scale web architectures, conversational-AI platforms, and self-serve ad tech. Shipped solo at team speed.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shivang Chauhan | SDE III & Full-Stack Architect",
    description:
      "Full-stack engineer with 12+ years building high-scale web architectures, conversational-AI platforms, and self-serve ad tech.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="min-h-screen bg-[#050505] text-white/90 antialiased selection:bg-[#9df133] selection:text-black">
        {children}
      </body>
    </html>
  );
}

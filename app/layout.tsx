import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "@/components/layout-wrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Chinky Garments | Premium School Uniforms & Kids Wear",
  description: "A Legacy of Trust. Explore our premium custom school uniforms, government uniforms, and kids play school wear. Built with durable fabrics and gold-standard stitching since 1985.",
  keywords: ["school uniforms", "government uniforms", "kids wear", "Chinky Garments", "premium blazers", "school skirts", "custom school dress"],
  authors: [{ name: "Chinky Garments" }],
  openGraph: {
    title: "Chinky Garments | Premium School Uniforms & Kids Wear",
    description: "A Legacy of Trust. Providing premium uniform solutions with durable fabrics.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-navy-deep text-white-soft">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}

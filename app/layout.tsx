import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_Symbols_2 } from "next/font/google";
import "./globals.css";

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

// Self-hosted so the Braille capybara renders with the same dots on every device instead of each OS's own Braille font.
const notoBraille = Noto_Sans_Symbols_2({
  subsets: ["braille"],
  weight: "400",
  variable: "--font-braille",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fernand William Citra | Full Stack Software Engineer",
  description: "Fernand William Citra is a full stack software engineer building secure, reliable business systems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ibmPlexMono.variable} ${notoBraille.variable}`}>
      <head>
        <link rel="icon" href="/favicon/favicon.ico" sizes="32x32" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
      </head>
      <body className={ibmPlexMono.className}>
        {children}
      </body>
    </html>
  );
}

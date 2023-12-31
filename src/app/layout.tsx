"use client";
import "./globals.css";
import { ThemeProvider } from "@material-tailwind/react";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/favicon.ico" />
        <title>Hunter Clube</title>
      </head>
      <ThemeProvider>
        <body className={inter.className}>{children}</body>
      </ThemeProvider>
    </html>
  );
}

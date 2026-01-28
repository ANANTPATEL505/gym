import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "IronPeak Gym",
  description: "Transform your body & mind",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}

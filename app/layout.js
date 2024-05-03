import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Holidaze",
  description: "A website for booking the finest venues around!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={"min-h-screen flex flex-col relative " + inter.className}
      >
        <Header />
        <div className="flex-1">
          
          {children}
          </div>
      </body>
    </html>
  );
}

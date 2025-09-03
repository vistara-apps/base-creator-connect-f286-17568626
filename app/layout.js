    import { Inter } from "next/font/google";
    import "./globals.css";
    import { Providers } from "./providers";

    const inter = Inter({ subsets: ["latin"] });

    export const metadata = {
      title: "Base Creator Connect",
      description: "Tip, connect, and grow with your fans on Base.",
    };

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <body className={`${inter.className} antialiased`}>
            <Providers>{children}</Providers>
          </body>
        </html>
      );
    }
  
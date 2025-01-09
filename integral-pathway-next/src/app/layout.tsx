import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });
const cormorant = Cormorant({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Profesor Integral - Your Calculus Companion",
  description: "Smart companion for calculus homework with step-by-step solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} ${cormorant.className}`}>
        <Providers>
          <Header />
          <main className="pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
} 
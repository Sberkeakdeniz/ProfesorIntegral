import type { Metadata } from "next";
import { Inter, Cormorant } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const inter = Inter({ subsets: ["latin"] });
const cormorant = Cormorant({ 
  subsets: ["latin"],
  variable: '--font-cormorant',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "Profesor Integral - Your Calculus Companion",
  description: "Smart companion for calculus homework with step-by-step solutions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${cormorant.variable}`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
} 
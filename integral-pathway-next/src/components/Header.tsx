'use client';

import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ProfessorIcon } from "@/components/icons/ProfessorIcon";
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isSolvePage = pathname === '/solve';

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-6 h-20">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="w-[280px]">
            <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
              <div className="flex items-center gap-3">
                <div className="text-4xl font-bold text-primary transform -rotate-6 relative top-[1px]">∫</div>
                <div className="scale-[0.55] transform -rotate-6 relative top-[2px] -left-2">
                  <ProfessorIcon />
                </div>
                <div className="flex flex-col -ml-1">
                  <span className="text-2xl font-semibold tracking-wide font-cormorant text-foreground">
                    Profesor Integral
                  </span>
                  <span className="text-xs tracking-wider uppercase text-muted-foreground -mt-1">
                    Integral Solver
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex justify-center items-center">
            <div className="flex items-center gap-6">
              <Link 
                href="/#features"
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Features
              </Link>
              <div className="text-[#9333EA]/60 text-lg font-light">\</div>
              <Link 
                href="/#examples" 
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Examples
              </Link>
              <div className="text-[#9333EA]/60 text-lg font-light">\</div>
              <Link 
                href="/pricing" 
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Pricing
              </Link>
            </div>
          </nav>

          {/* Right Section */}
          <div className="w-[280px] flex justify-end items-center">
            {session ? (
              <div className="hidden md:flex items-center gap-4">
                {!isSolvePage && (
                  <Link href="/solve">
                    <Button 
                      variant="default"
                      className="font-medium text-base bg-primary hover:bg-primary/90"
                    >
                      Calculate
                    </Button>
                  </Link>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/account">Account Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <Link href="/auth/signin">
                  <Button 
                    variant="ghost" 
                    className="font-medium text-base"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button 
                    variant="outline"
                    className="font-medium text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Sign Up
                  </Button>
                </Link>
                {!isSolvePage && (
                  <Link href="/solve">
                    <Button 
                      variant="default"
                      className="font-medium text-base bg-primary hover:bg-primary/90"
                    >
                      Try Calculator
                    </Button>
                  </Link>
                )}
              </div>
            )}
            <Button variant="ghost" size="icon" className="md:hidden ml-2">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
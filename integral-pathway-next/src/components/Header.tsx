'use client';

import { Button } from "@/components/ui/button";
import { Menu, Settings, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { ProfessorIcon } from "@/components/icons/ProfessorIcon";
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isSolvePage = pathname === '/solve';

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="flex items-center">
            <div className="text-5xl font-bold text-primary transform -rotate-6 relative top-[1px]">∫</div>
            <div className="scale-[0.65] transform -rotate-6 relative top-[2px] -left-3">
              <ProfessorIcon />
            </div>
          </div>
          <div className="flex flex-col items-start -ml-2">
            <span className="text-3xl font-semibold tracking-wide font-cormorant text-foreground">
              Profesor Integral
            </span>
            <span className="text-sm tracking-wider uppercase text-muted-foreground -mt-1">
              Integral Solver
            </span>
          </div>
        </Link>

        {/* Centered Navigation */}
        <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center">
          {/* Left Divider */}
          <div className="relative mx-8 h-10 flex items-center">
            <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
            <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
          </div>
          
          <ul className="flex items-center">
            <li>
              <Link 
                href="/#features"
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Features
              </Link>
            </li>
            <div className="relative mx-6 h-6 flex items-center">
              <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
              <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
            </div>
            <li>
              <Link 
                href="/#examples" 
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Examples
              </Link>
            </li>
            <div className="relative mx-6 h-6 flex items-center">
              <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
              <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
            </div>
            <li>
              <Link 
                href="/pricing" 
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Pricing
              </Link>
            </li>
          </ul>

          {/* Right Divider */}
          <div className="relative mx-8 h-10 flex items-center">
            <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
            <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
          </div>
        </nav>

        <div className="flex items-center">
          {status === 'authenticated' ? (
            <>
              <Button 
                variant="default" 
                size="lg"
                className="shadow-sm hover:shadow-md transition-all bg-primary/90 hover:bg-primary font-medium"
              >
                Ask Profesor
              </Button>
              <div className="relative mx-6 h-8 flex items-center">
                <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
                <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
              </div>
              {session.user?.image && (
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="relative">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Profile'}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-border hover:ring-primary transition-all"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full ring-2 ring-background" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="text-base">My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm py-2">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-sm py-2">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-sm py-2" onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </>
          ) : (
            <>
              <Link href="/auth/signin">
                <Button 
                  variant="ghost" 
                  size="lg"
                  className="font-medium text-base"
                >
                  Login
                </Button>
              </Link>
              <div className="relative mx-6 h-8 flex items-center">
                <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
                <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
              </div>
              <Link href="/auth/signup">
                <Button 
                  variant="outline"
                  size="lg"
                  className="font-medium text-base border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md transition-all"
                >
                  Sign Up
                </Button>
              </Link>
              {!isSolvePage && (
                <>
                  <div className="relative mx-6 h-8 flex items-center">
                    <div className="w-[2px] h-full bg-gradient-to-b from-primary/20 via-primary/60 to-primary/20 transform -rotate-12" />
                    <div className="absolute inset-0 w-[2px] h-full bg-primary/20 blur-[1px] transform -rotate-12" />
                  </div>
                  <Link href="/solve">
                    <Button 
                      variant="default"
                      size="lg"
                      className="shadow-sm hover:shadow-md transition-all bg-primary/90 hover:bg-primary font-medium text-base"
                    >
                      Try Calculator
                    </Button>
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </header>
  );
};
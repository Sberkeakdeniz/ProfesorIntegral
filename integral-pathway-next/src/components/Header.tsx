'use client';

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { ProfessorIcon } from "@/components/icons/ProfessorIcon";

export const Header = () => {
  const { data: session, status } = useSession();

  return (
    <header className="fixed top-0 w-full bg-background/95 backdrop-blur-sm z-50 border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
          <div className="flex items-center">
            <div className="text-3xl font-bold text-primary transform -rotate-6 relative top-[1px]">∫</div>
            <div className="scale-[0.55] transform -rotate-6 relative top-[2px] -left-3">
              <ProfessorIcon />
            </div>
          </div>
          <div className="flex flex-col items-start -ml-2">
            <span className="text-lg font-bold tracking-tight">Profesor Integral</span>
            <span className="text-xs text-muted-foreground -mt-0.5">Integral Solver</span>
          </div>
        </Link>
        
        <nav className="hidden md:flex items-center">
          <div className="flex items-center space-x-8 mr-10">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
              Features
            </a>
            <a href="#examples" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200">
              Examples
            </a>
          </div>
          <div className="flex items-center">
            {status === 'authenticated' ? (
              <>
                <Button 
                  variant="default" 
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all bg-primary/90 hover:bg-primary"
                >
                  Try Calculator
                </Button>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border">
                  {session.user?.image && (
                    <div className="relative">
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'Profile'}
                        width={30}
                        height={30}
                        className="rounded-full ring-2 ring-border"
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-background" />
                    </div>
                  )}
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut()}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="font-medium"
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" className="ml-2">
                  <Button 
                    variant="outline"
                    size="sm" 
                    className="font-medium border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-sm hover:shadow-md transition-all"
                  >
                    Sign Up
                  </Button>
                </Link>
                <div className="border-l border-border h-6 mx-2" />
                <Button 
                  variant="default"
                  size="sm"
                  className="shadow-sm hover:shadow-md transition-all bg-primary/90 hover:bg-primary font-medium"
                >
                  Try Calculator
                </Button>
              </>
            )}
          </div>
        </nav>
        
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
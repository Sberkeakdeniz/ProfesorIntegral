'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { FcGoogle } from 'react-icons/fc';
import { ProfessorIcon } from '@/components/icons/ProfessorIcon';

export default function SignUp() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-7xl font-bold text-primary transform -rotate-6">∫</div>
            <div className="scale-150 transform -rotate-6 relative -top-1">
              <ProfessorIcon />
            </div>
          </div>
          <div className="text-2xl font-bold text-center">Profesor Integral</div>
          <div className="text-sm text-muted-foreground">Your Calculus Companion</div>
        </div>

        <CardHeader className="space-y-1 p-0">
          <h2 className="text-2xl font-bold text-center">Create Account</h2>
          <p className="text-sm text-gray-500 text-center">
            Join Profesor Integral to get step-by-step solutions
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 pt-6">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            <div className="mr-2 h-5 w-5">
              <FcGoogle className="w-full h-full" />
            </div>
            Sign up with Google
          </Button>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 text-center">
          <p className="text-sm text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
          <div className="text-sm">
            Already have an account?{' '}
            <a href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 
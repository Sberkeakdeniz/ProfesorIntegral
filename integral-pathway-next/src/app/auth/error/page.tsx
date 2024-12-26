'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams?.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center text-red-600">Authentication Error</h2>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            {error === 'Configuration' && 'There is a problem with the server configuration.'}
            {error === 'AccessDenied' && 'You do not have permission to sign in.'}
            {error === 'Verification' && 'The verification link may have expired or has already been used.'}
            {!error && 'An unknown error occurred.'}
          </p>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/auth/signin">
            <Button variant="default">
              Try Again
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 
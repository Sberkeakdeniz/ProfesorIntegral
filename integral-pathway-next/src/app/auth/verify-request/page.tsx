'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';

export default function VerifyRequest() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md p-6 space-y-6">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Check your email</h2>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            A sign in link has been sent to your email address.
          </p>
          <p className="text-center text-sm text-gray-500">
            If you don't see it, check your spam folder.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 
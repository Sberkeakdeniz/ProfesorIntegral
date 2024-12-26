'use client';

import { ProfessorIcon } from '@/components/icons/ProfessorIcon';

export const AuthLogo = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="text-7xl font-bold text-primary transform -rotate-6">∫</div>
        <div className="scale-150 transform -rotate-6 relative -top-3">
          <ProfessorIcon />
        </div>
      </div>
      <div className="text-2xl font-bold text-center">Profesor Integral</div>
      <div className="text-sm text-muted-foreground">Your Calculus Companion</div>
    </div>
  );
}; 
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageUrl?: string;
  imageAlt?: string;
  imageSide?: 'left' | 'right';
}

export default function AuthLayout({
  children,
  imageUrl = '/images/auth-bg.jpg',
  imageAlt = 'Authentication',
  imageSide = 'left',
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Image Side */}
      {imageSide === 'left' && (
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 to-primary">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to Ertiqa</h1>
            <p className="text-xl text-center max-w-md">
              Transform your learning journey with expert instructors and comprehensive courses
            </p>
          </div>
        </div>
      )}

      {/* Form Side */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

      {/* Image Side (Right) */}
      {imageSide === 'right' && (
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary/90 to-primary">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to Ertiqa</h1>
            <p className="text-xl text-center max-w-md">
              Transform your learning journey with expert instructors and comprehensive courses
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

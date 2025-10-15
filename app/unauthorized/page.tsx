'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center p-8">
        <ShieldAlert className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Admin access is required.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => router.push('/')} variant="outline">
            Go Home
          </Button>
          <Button onClick={() => router.push('/login')}>
            Login as Admin
          </Button>
        </div>
      </div>
    </div>
  );
}

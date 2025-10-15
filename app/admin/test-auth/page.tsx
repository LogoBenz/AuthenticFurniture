'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      console.log('🔍 Current user:', user);
      console.log('🔍 User metadata:', user?.user_metadata);
      console.log('🔍 App metadata:', user?.app_metadata);
      console.log('🔍 Error:', error);
      
      setUser(user);
      setLoading(false);
    }
    
    checkAuth();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Auth Test Page</h1>
      
      {user ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h2 className="font-bold text-green-800 mb-2">✅ Logged In</h2>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h2 className="font-bold text-blue-800 mb-2">User Metadata</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(user.user_metadata, null, 2)}
            </pre>
            <p className="mt-2">
              <strong>Role:</strong> {user.user_metadata?.role || '❌ NOT SET'}
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h2 className="font-bold text-purple-800 mb-2">App Metadata</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(user.app_metadata, null, 2)}
            </pre>
            <p className="mt-2">
              <strong>Role:</strong> {user.app_metadata?.role || '❌ NOT SET'}
            </p>
          </div>

          {!user.user_metadata?.role && !user.app_metadata?.role && (
            <div className="bg-red-50 border border-red-200 p-4 rounded">
              <h2 className="font-bold text-red-800 mb-2">⚠️ NO ADMIN ROLE FOUND</h2>
              <p className="mb-4">Your user doesn't have the admin role set. Run this SQL in Supabase Dashboard:</p>
              <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-auto">
{`UPDATE auth.users 
SET raw_user_meta_data = 
  COALESCE(raw_user_meta_data, '{}'::jsonb) || '{"role": "admin"}'::jsonb
WHERE email = '${user.email}';`}
              </pre>
              <p className="mt-4 text-sm text-gray-600">
                After running this SQL, log out and log back in for the changes to take effect.
              </p>
            </div>
          )}

          {(user.user_metadata?.role === 'admin' || user.app_metadata?.role === 'admin') && (
            <div className="bg-green-50 border border-green-200 p-4 rounded">
              <h2 className="font-bold text-green-800 mb-2">✅ ADMIN ROLE CONFIRMED</h2>
              <p>You have admin access! Product deletion should work now.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <h2 className="font-bold text-yellow-800 mb-2">⚠️ Not Logged In</h2>
          <p>Please log in to test authentication.</p>
        </div>
      )}
    </div>
  );
}

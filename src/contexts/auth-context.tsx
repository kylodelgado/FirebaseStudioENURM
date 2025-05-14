// src/contexts/auth-context.tsx
'use client';

import type { User } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton'; // Using Skeleton for loading state

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      router.push('/auth'); 
    } catch (error) {
      console.error("Error signing out: ", error);
      // Consider adding a toast notification for sign-out errors
    }
  };

  useEffect(() => {
    if (!loading) {
      const isAuthPage = pathname.startsWith('/auth');
      const isPublicLandingPage = pathname === '/';

      if (user && isAuthPage) {
        router.push('/dashboard');
      } else if (!user && !isAuthPage && !isPublicLandingPage) {
        router.push('/auth');
      }
    }
  }, [user, loading, router, pathname]);

  if (loading && !pathname.startsWith('/auth') && pathname !== '/') {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
        <div className="space-y-4 max-w-sm w-full">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <Skeleton className="h-10 w-full mt-4" />
           <p className="mt-4 text-muted-foreground text-center">Loading user session...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

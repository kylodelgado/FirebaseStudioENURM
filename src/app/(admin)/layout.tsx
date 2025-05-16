// src/app/(admin)/layout.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth'); // Not authenticated, redirect to login
      } else if (!isAdmin) {
        router.push('/dashboard'); // Authenticated but not admin, redirect to dashboard
      }
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !isAdmin || !user) {
    // Show a loading state or a minimal layout while checking auth/admin status
    // or if user is not an admin (before redirect kicks in)
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40">
        <Skeleton className="h-12 w-12 mb-4" />
        <Skeleton className="h-6 w-48 mb-2" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  // If user is admin, render the admin layout
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-[margin-left] duration-300 ease-in-out",
          "md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]"
        )}>
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <AppHeader />
            <div className="flex-1 p-0 md:p-2">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

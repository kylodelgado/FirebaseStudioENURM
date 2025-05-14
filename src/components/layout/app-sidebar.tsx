"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  UserCircle2,
  BookOpenText,
  BookCopy,
  Award,
  BarChart3,
  Settings, // Kept for potential future use
  PanelLeftClose,
  PanelLeftOpen,
  Power,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar as useSidebarLayoutContext } from '@/components/ui/sidebar'; 
import { useAuth } from '@/contexts/auth-context'; 

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/profile', label: 'Profile', icon: UserCircle2 },
  { href: '/study-modes', label: 'Study Modes', icon: BookOpenText },
  { href: '/practice', label: 'Practice', icon: BookCopy },
  { href: '/review', label: 'Review', icon: BookOpenText }, 
  { href: '/achievements', label: 'Achievements', icon: Award },
  { href: '/statistics', label: 'Statistics', icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { open, toggleSidebar, isMobile, setOpenMobile } = useSidebarLayoutContext();
  const { signOut, user, loading } = useAuth(); 

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  // During loading or if no user, sidebar might be hidden or show a loading state.
  // AuthProvider handles redirect, so this primarily affects initial render.
  if (loading) {
     // Optional: return a skeleton or null if AuthProvider covers loading screen sufficiently
     return (
        <Sidebar side="left" collapsible="icon" variant="sidebar" className={cn(
          "border-r bg-sidebar text-sidebar-foreground fixed h-full z-40",
          !open && "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
        )}>
            <SidebarHeader className="p-4 flex items-center justify-between">
                {open && <Skeleton className="h-8 w-32" />}
                 <Skeleton className="h-8 w-8" />
            </SidebarHeader>
            <SidebarContent className="p-2 space-y-2">
                {[...Array(5)].map((_, i) => (
                     <div key={i} className={cn("flex items-center p-2", !open && "justify-center")}>
                        <Skeleton className="h-5 w-5" />
                        {open && <Skeleton className="ml-2 h-5 w-3/4" />}
                    </div>
                ))}
            </SidebarContent>
             <SidebarFooter className="p-4 border-t border-sidebar-border">
                <Skeleton className={cn("h-10 w-full", !open && "h-10 w-10 mx-auto")} />
            </SidebarFooter>
        </Sidebar>
     );
  }
  
  // If there's no user and not loading (e.g. after logout attempt or if auth state resolves to no user),
  // And we are on a protected route, AuthProvider should redirect.
  // So, if we reach here and no user, it's likely on a brief moment before redirect or if on a public page (not applicable for AppSidebar).
  // It's generally safe to assume `user` will be present on pages using this sidebar due to AuthProvider.

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar" className={cn(
      "border-r bg-sidebar text-sidebar-foreground fixed h-full z-40",
      !open && "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
    )}>
      <SidebarHeader className="p-4 flex items-center justify-between">
        {open && <Logo />}
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          {open ? <PanelLeftClose /> : <PanelLeftOpen />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                  tooltip={!open ? item.label : undefined}
                  onClick={handleLinkClick}
                  className={cn(
                    "justify-start",
                    !open && "justify-center"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {open && <span className="ml-2">{item.label}</span>}
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {/* <Button variant="ghost" className={cn("w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", !open && "justify-center")} onClick={() => alert('Settings (Not Implemented)')}>
          <Settings className="h-5 w-5" />
          {open && <span className="ml-2">Settings</span>}
        </Button> */}
         <Button variant="ghost" className={cn("w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", !open && "justify-center")} onClick={signOut}>
          <Power className="h-5 w-5" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

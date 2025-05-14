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
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  Power,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar as useSidebarContext } from '@/components/ui/sidebar';

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
  const { open, toggleSidebar, isMobile, setOpenMobile } = useSidebarContext();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar side="left" collapsible="icon" variant="sidebar" className={cn(
      "border-r bg-sidebar text-sidebar-foreground fixed h-full z-50",
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
        <Button variant="ghost" className={cn("w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", !open && "justify-center")} onClick={() => alert('Settings (Not Implemented)')}>
          <Settings className="h-5 w-5" />
          {open && <span className="ml-2">Settings</span>}
        </Button>
         <Button variant="ghost" className={cn("w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", !open && "justify-center")} onClick={() => alert('Logout (Not Implemented)')}>
          <Power className="h-5 w-5" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

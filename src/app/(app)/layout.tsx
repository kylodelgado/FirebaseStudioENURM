import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

export default function AppPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className={cn(
          "flex flex-col sm:gap-4 sm:py-4 transition-[margin-left] duration-300 ease-in-out",
          "md:ml-[var(--sidebar-width)] group-data-[collapsible=icon]/sidebar-wrapper:md:ml-[var(--sidebar-width-icon)]" // Adjust based on sidebar state
          // The above classes might need fine-tuning with ShadCN's Sidebar component behavior regarding its collapsed state.
          // A simpler approach for now:
          // "md:pl-[var(--sidebar-width)]" // if sidebar is always expanded
          // "group-data-[state=expanded]/sidebar-wrapper:md:pl-[16rem] group-data-[state=collapsed]/sidebar-wrapper:md:pl-[3rem]"
        )}>
          <main className="flex flex-1 flex-col gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <AppHeader /> {/* AppHeader might need to be outside main if it spans full width above content AND sidebar */}
            <div className="flex-1 p-0 md:p-2">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

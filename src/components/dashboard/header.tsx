import { LogOut, User } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { UsageBadge } from "@/components/dashboard/usage-badge";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import type { UsageSnapshot } from "@/lib/billing/quota";

interface DashboardHeaderProps {
  email: string;
  usage: UsageSnapshot;
}

export function DashboardHeader({ email, usage }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur md:px-10">
      <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground sm:gap-3">
        <MobileSidebar />
        <UsageBadge snapshot={usage} />
        <span className="hidden h-4 w-px bg-border md:inline-block" />
        <span className="hidden truncate md:inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground">
          <User className="h-3 w-3" />
          {email}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}

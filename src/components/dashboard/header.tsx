import { LogOut, User } from "lucide-react";

import { signOut } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  email: string;
}

export function DashboardHeader({ email }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur md:px-10">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="hidden md:inline">Signed in as</span>
        <span className="inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-xs font-medium text-foreground">
          <User className="h-3 w-3" />
          {email}
        </span>
      </div>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="sm">
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </form>
    </header>
  );
}

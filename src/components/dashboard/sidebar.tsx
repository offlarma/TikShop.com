"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Megaphone, Sparkles, Users, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "UGC Script Generator",
    href: "/dashboard/ugc-scripts",
    icon: Wand2,
  },
  {
    label: "Affiliate Outreach",
    href: "/dashboard/outreach",
    icon: Users,
  },
  {
    label: "Copy Optimizer",
    href: "/dashboard/copy-optimizer",
    icon: Megaphone,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="text-base font-semibold tracking-tight">
          Growth Suite
        </span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-foreground",
                isActive && "bg-accent text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground">TikTok Shop Suite</p>
        <p>MVP · v0.1</p>
      </div>
    </aside>
  );
}

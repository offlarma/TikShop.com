"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  CreditCard,
  LayoutDashboard,
  Megaphone,
  Radar,
  ShieldAlert,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import { Brand } from "@/components/landing/brand";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

type NavSection = {
  /** When omitted the section is rendered without a heading. */
  label?: string;
  items: NavItem[];
};

const sections: NavSection[] = [
  {
    items: [
      {
        label: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      { label: "UGC Script Generator", href: "/dashboard/ugc-scripts", icon: Wand2 },
      { label: "Affiliate Outreach", href: "/dashboard/outreach", icon: Users },
      { label: "Copy Optimizer", href: "/dashboard/copy-optimizer", icon: Megaphone },
    ],
  },
  {
    label: "Store Operations",
    items: [
      { label: "Violation Appeals", href: "/dashboard/appeals", icon: ShieldAlert },
      { label: "Creator Matcher", href: "/dashboard/creator-matcher", icon: Radar },
      { label: "Margin Calculator", href: "/dashboard/calculator", icon: Calculator },
    ],
  },
  {
    label: "Account",
    items: [
      { label: "Billing & Plan", href: "/dashboard/billing", icon: CreditCard },
    ],
  },
];

export function DashboardSidebarBrand() {
  return (
    <div className="flex h-16 items-center border-b px-6">
      <Brand size="md" href="/dashboard" />
    </div>
  );
}

export function DashboardNavLinks({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-4 p-3">
      {sections.map((section, sectionIndex) => (
        <div key={section.label ?? `__${sectionIndex}`} className="space-y-1">
          {section.label ? (
            <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {section.label}
            </p>
          ) : null}
          {section.items.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
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
        </div>
      ))}
    </nav>
  );
}

export function DashboardSidebarFooter() {
  return (
    <div className="border-t p-4 text-xs text-muted-foreground">
      <p className="font-medium text-foreground">TikShopDrop</p>
      <p>MVP · v0.1</p>
    </div>
  );
}

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <DashboardSidebarBrand />
      <DashboardNavLinks />
      <DashboardSidebarFooter />
    </aside>
  );
}

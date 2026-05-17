import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Megaphone,
  Radar,
  ScanSearch,
  ShieldAlert,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Tool {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status?: "live" | "soon";
}

interface ToolSection {
  label: string;
  description: string;
  tools: Tool[];
}

const sections: ToolSection[] = [
  {
    label: "Tools",
    description: "AI-powered generators ready to use.",
    tools: [
      {
        title: "UGC Script Generator",
        description:
          "Generate scroll-stopping UGC scripts tailored to your TikTok Shop product.",
        href: "/dashboard/ugc-scripts",
        icon: Wand2,
        status: "live",
      },
      {
        title: "Affiliate Outreach",
        description:
          "Draft personalized outreach DMs and emails to recruit affiliates and creators.",
        href: "/dashboard/outreach",
        icon: Users,
        status: "live",
      },
      {
        title: "Copy Optimizer",
        description:
          "Rewrite product titles, descriptions, and ad copy for higher conversion.",
        href: "/dashboard/copy-optimizer",
        icon: Megaphone,
        status: "live",
      },
    ],
  },
  {
    label: "Store Operations",
    description: "Operational helpers for running your shop day-to-day.",
    tools: [
      {
        title: "Violation Scanner",
        description:
          "Audit a listing before publishing — catch risky claims and get a policy-safe rewrite.",
        href: "/dashboard/violation-scanner",
        icon: ScanSearch,
        status: "live",
      },
      {
        title: "Violation Appeals",
        description:
          "Draft compelling TikTok Shop violation appeals in seconds.",
        href: "/dashboard/appeals",
        icon: ShieldAlert,
        status: "live",
      },
      {
        title: "Creator Matcher",
        description:
          "Find the right creators for your product — niche, audience and style matched.",
        href: "/dashboard/creator-matcher",
        icon: Radar,
        status: "live",
      },
      {
        title: "Margin Calculator",
        description:
          "Calculate margins, fees and break-even prices before listing.",
        href: "/dashboard/calculator",
        icon: Calculator,
        status: "live",
      },
    ],
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to TikShopDrop. Pick a tool to get started.
        </p>
      </div>

      {sections.map((section) => (
        <section key={section.label} className="space-y-4">
          <div>
            <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {section.label}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {section.description}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {section.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.href} href={tool.href} className="group">
                  <Card className="h-full transition-colors group-hover:border-foreground/40">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        {tool.status === "soon" ? (
                          <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            Soon
                          </span>
                        ) : null}
                      </div>
                      <CardTitle className="pt-2 text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                        {tool.status === "soon" ? "Preview tool" : "Open tool"}
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

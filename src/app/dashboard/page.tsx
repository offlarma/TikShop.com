import Link from "next/link";
import { ArrowRight, Megaphone, Users, Wand2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tools = [
  {
    title: "UGC Script Generator",
    description:
      "Generate scroll-stopping UGC scripts tailored to your TikTok Shop product.",
    href: "/dashboard/ugc-scripts",
    icon: Wand2,
  },
  {
    title: "Affiliate Outreach",
    description:
      "Draft personalized outreach DMs and emails to recruit affiliates and creators.",
    href: "/dashboard/outreach",
    icon: Users,
  },
  {
    title: "Copy Optimizer",
    description:
      "Rewrite product titles, descriptions, and ad copy for higher conversion.",
    href: "/dashboard/copy-optimizer",
    icon: Megaphone,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to Growth Suite. Pick a tool to get started.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="group">
              <Card className="h-full transition-colors group-hover:border-foreground/40">
                <CardHeader>
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <CardTitle className="pt-2 text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
                    Open tool
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listGenerations } from "@/lib/db/generations";

import { UgcTool } from "./ugc-tool";

export default async function UgcScriptsPage() {
  const history = await listGenerations("ugc-scripts", 10);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          UGC Script Generator
        </h1>
        <p className="text-muted-foreground">
          Turn any product into a scroll-stopping UGC script for TikTok Shop.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate a new script</CardTitle>
          <CardDescription>
            Provide the product details below. The script will stream in
            real-time on the right and be saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UgcTool initialHistory={history} />
        </CardContent>
      </Card>
    </div>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listGenerations } from "@/lib/db/generations";

import { CopyOptimizerTool } from "./copy-tool";

export default async function CopyOptimizerPage() {
  const history = await listGenerations("copy-optimizer", 10);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Copy Optimizer
        </h1>
        <p className="text-muted-foreground">
          Rewrite product titles, descriptions, and ad copy for higher
          conversion.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Optimize your copy</CardTitle>
          <CardDescription>
            We will return 3 variants with different angles plus a short
            explanation of the techniques used. Every generation is saved
            automatically below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CopyOptimizerTool initialHistory={history} />
        </CardContent>
      </Card>
    </div>
  );
}

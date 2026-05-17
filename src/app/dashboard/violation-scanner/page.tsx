import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listGenerations } from "@/lib/db/generations";

import { ViolationScannerTool } from "./violation-scanner-tool";

export default async function ViolationScannerPage() {
  const history = await listGenerations("violation-scanner", 10);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Violation Scanner
        </h1>
        <p className="text-muted-foreground">
          Audit a TikTok Shop listing before you publish it. Spot risky claims,
          policy issues and unsafe wording — then get a policy-safe rewrite.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Scan a listing</CardTitle>
          <CardDescription>
            Paste your product details below. The AI returns an overall risk
            score, every flagged issue with a suggested fix, the policy areas
            checked, and a safer rewrite. Every scan is saved automatically.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ViolationScannerTool initialHistory={history} />
        </CardContent>
      </Card>
    </div>
  );
}

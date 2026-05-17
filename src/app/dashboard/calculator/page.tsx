import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CalculatorTool } from "./calculator-tool";

export default function MarginCalculatorPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Margin Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate margins, TikTok Shop fees and break-even prices before you
          list a single product. Pure math — no AI, no monthly quota consumed.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run a calculation</CardTitle>
          <CardDescription>
            Adjust any input and the results update live. Defaults reflect
            typical TikTok Shop fees; tweak them for your category.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CalculatorTool />
        </CardContent>
      </Card>
    </div>
  );
}

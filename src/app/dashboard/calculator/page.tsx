import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MarginCalculatorPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Margin Calculator
        </h1>
        <p className="text-muted-foreground">
          Calculate margins, TikTok Shop fees and break-even prices before you
          list a single product.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Run a calculation</CardTitle>
          <CardDescription>
            The input form will live here. Calculations will be wired up in the
            next phase.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

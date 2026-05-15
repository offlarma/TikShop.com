import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CopyOptimizerPage() {
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
            The input form will live here. AI generation will be wired up in the
            next phase.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

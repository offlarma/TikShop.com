import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UgcScriptsPage() {
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
            The input form will live here. AI generation will be wired up in the
            next phase.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

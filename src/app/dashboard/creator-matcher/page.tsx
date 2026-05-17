import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CreatorMatcherPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Creator Matcher
        </h1>
        <p className="text-muted-foreground">
          Find the right TikTok creators for your product — matched by niche,
          audience and content style.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Find creators</CardTitle>
          <CardDescription>
            The input form will live here. AI matching will be wired up in the
            next phase.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

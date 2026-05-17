import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ViolationAppealsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Violation Appeals
        </h1>
        <p className="text-muted-foreground">
          Draft compelling TikTok Shop violation appeals in seconds — backed by
          the platform&apos;s own policy language.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate an appeal</CardTitle>
          <CardDescription>
            The input form will live here. AI generation will be wired up in
            the next phase.
          </CardDescription>
        </CardHeader>
        <CardContent />
      </Card>
    </div>
  );
}

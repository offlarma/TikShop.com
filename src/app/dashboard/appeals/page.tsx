import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listGenerations } from "@/lib/db/generations";

import { AppealsTool } from "./appeals-tool";

export default async function ViolationAppealsPage() {
  const history = await listGenerations("appeals", 10);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Violation Appeals
        </h1>
        <p className="text-muted-foreground">
          Draft compelling TikTok Shop violation appeals in seconds — backed by
          structured policy language.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Generate an appeal</CardTitle>
          <CardDescription>
            We will return a subject line, a structured appeal body and a
            short evidence checklist. Every generation is saved automatically
            below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AppealsTool initialHistory={history} />
        </CardContent>
      </Card>
    </div>
  );
}

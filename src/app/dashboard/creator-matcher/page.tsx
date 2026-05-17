import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listGenerations } from "@/lib/db/generations";

import { CreatorMatcherTool } from "./creator-matcher-tool";

export default async function CreatorMatcherPage() {
  const history = await listGenerations("creator-matcher", 10);

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
            We will produce 5 distinct creator personas plus a 7-day outreach
            plan. Every match is saved automatically below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatorMatcherTool initialHistory={history} />
        </CardContent>
      </Card>
    </div>
  );
}

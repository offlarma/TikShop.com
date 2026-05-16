import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { listGenerations } from "@/lib/db/generations";

import { OutreachTool } from "./outreach-tool";

export default async function OutreachPage() {
  const history = await listGenerations("outreach", 10);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Affiliate Outreach
        </h1>
        <p className="text-muted-foreground">
          Draft personalized DMs and emails to recruit affiliates and creators
          for your shop.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Create an outreach message</CardTitle>
          <CardDescription>
            We will generate a tailored message plus a short follow-up. Every
            generation is saved automatically below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OutreachTool initialHistory={history} />
        </CardContent>
      </Card>
    </div>
  );
}

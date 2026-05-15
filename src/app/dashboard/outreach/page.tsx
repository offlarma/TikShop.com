import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { OutreachForm } from "./outreach-form";

export default function OutreachPage() {
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
            We will generate a tailored message plus a short follow-up.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OutreachForm />
        </CardContent>
      </Card>
    </div>
  );
}

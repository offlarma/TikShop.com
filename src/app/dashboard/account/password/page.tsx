import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { UpdatePasswordForm } from "./update-password-form";

export default function UpdatePasswordPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Set a new password</h1>
        <p className="text-muted-foreground">
          Choose a new password for your TikShopDrop account.
        </p>
      </div>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle className="text-lg">New password</CardTitle>
          <CardDescription>At least 6 characters.</CardDescription>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}

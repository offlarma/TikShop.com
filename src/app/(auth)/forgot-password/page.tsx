import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>
          Enter the email associated with your Growth Suite account and we will
          send you a reset link.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ForgotPasswordForm />
        <p className="text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Back to log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

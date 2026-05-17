import Link from "next/link";

import { SignupForm } from "./signup-form";
import { GoogleButton, OrSeparator } from "../google-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Start scaling your TikTok Shop with TikShopDrop.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <GoogleButton label="Sign up with Google" />
        <OrSeparator />
        <SignupForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Real email addresses only. Disposable / temp-mail providers are
          blocked.
        </p>
      </CardContent>
    </Card>
  );
}

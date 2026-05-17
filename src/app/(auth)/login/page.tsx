import Link from "next/link";

import { LoginForm } from "./login-form";
import { LoginErrorToast } from "./login-error-toast";
import { GoogleButton, OrSeparator } from "../google-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <Card className="border-border/60 shadow-lg">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Log in to your TikShopDrop account to keep scaling your TikTok Shop.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <LoginErrorToast message={error} />
        <GoogleButton label="Continue with Google" />
        <OrSeparator />
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

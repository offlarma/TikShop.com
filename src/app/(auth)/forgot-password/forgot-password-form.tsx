"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { requestPasswordReset } from "../actions";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function onSubmit(formData: FormData) {
    setError(null);
    setInfo(null);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      if (result?.error) {
        setError(result.error);
        toast.error(result.error);
        return;
      }
      if (result?.message) {
        setInfo(result.message);
        toast.success(result.message);
      }
    });
  }

  return (
    <form action={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@brand.com"
          autoComplete="email"
          required
        />
      </div>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
      {info ? (
        <p className="text-sm text-muted-foreground" role="status">
          {info}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send reset link
          </>
        )}
      </Button>
    </form>
  );
}

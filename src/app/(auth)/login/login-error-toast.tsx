"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function LoginErrorToast({ message }: { message: string | undefined }) {
  useEffect(() => {
    if (message) toast.error(message);
  }, [message]);

  return message ? (
    <p
      className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-center text-sm text-destructive"
      role="alert"
    >
      {message}
    </p>
  ) : null;
}

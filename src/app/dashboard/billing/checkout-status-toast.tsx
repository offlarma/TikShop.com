"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function CheckoutStatusToast({ status }: { status: string | undefined }) {
  useEffect(() => {
    if (status === "success") {
      toast.success(
        "Checkout completed. Your subscription should appear in a few seconds."
      );
    } else if (status === "cancelled") {
      toast.message("Checkout cancelled.");
    }
  }, [status]);

  return null;
}

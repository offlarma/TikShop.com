import Link from "next/link";

import { cn } from "@/lib/utils";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

/**
 * TikShopDrop wordmark. Pure type-only mark — minimalist, with a single
 * accent dot to add character without breaking the clean Apple-esque feel.
 */
export function Brand({ className, size = "md", href = "/" }: BrandProps) {
  const sizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  } as const;

  const content = (
    <span
      className={cn(
        "inline-flex items-baseline gap-0.5 font-semibold tracking-tight",
        sizes[size],
        className
      )}
    >
      <span>TikShopDrop</span>
      <span
        aria-hidden
        className="ml-0.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full bg-foreground"
      />
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex items-center" aria-label="TikShopDrop home">
      {content}
    </Link>
  );
}

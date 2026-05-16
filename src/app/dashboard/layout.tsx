import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { getUsageSnapshot } from "@/lib/billing/quota";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const usage = await getUsageSnapshot(user.id);

  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardHeader email={user.email ?? ""} usage={usage} />
        <main className="flex-1 px-6 py-8 md:px-10">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>
      </div>
    </div>
  );
}

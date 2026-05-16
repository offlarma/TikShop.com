import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Generation, Tool } from "@/types/db";

const TABLE = "generations";

export async function listGenerations(
  tool: Tool,
  limit = 10
): Promise<Generation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("tool", tool)
    .order("is_favorite", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[generations.list]", error);
    return [];
  }
  return (data ?? []) as Generation[];
}

export async function insertGeneration(params: {
  userId: string;
  tool: Tool;
  input: Record<string, unknown>;
  output: string;
}): Promise<Generation | null> {
  // This is typically called from streamText's onFinish callback, which
  // fires AFTER the request-scoped cookie context has been torn down.
  // At that point the user-scoped Supabase client cannot read the auth
  // cookies anymore, so RLS would silently reject the insert. We use
  // the admin (service-role) client instead — safe because params.userId
  // was just validated by requireUser() earlier in the same request.
  let supabase;
  try {
    supabase = createAdminClient();
  } catch (err) {
    console.error(
      "[generations.insert] SUPABASE_SERVICE_ROLE_KEY is required to persist generations.",
      err
    );
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      user_id: params.userId,
      tool: params.tool,
      input: params.input,
      output: params.output,
    })
    .select("*")
    .single();

  if (error) {
    console.error("[generations.insert]", error);
    return null;
  }
  return data as Generation;
}

export async function toggleFavorite(
  id: string,
  nextValue: boolean
): Promise<Generation | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from(TABLE)
    .update({ is_favorite: nextValue })
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("[generations.toggleFavorite]", error);
    return null;
  }
  return data as Generation;
}

export async function deleteGeneration(id: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from(TABLE).delete().eq("id", id);

  if (error) {
    console.error("[generations.delete]", error);
    return false;
  }
  return true;
}

"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  deleteGeneration as dbDelete,
  listGenerations as dbList,
  toggleFavorite as dbToggleFavorite,
} from "@/lib/db/generations";
import type { Generation, Tool } from "@/types/db";

export type MutationResult =
  | { ok: true }
  | { ok: false; error: string };

async function requireAuth(): Promise<
  { ok: true; userId: string } | { ok: false; error: string }
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "You must be signed in." };
  return { ok: true, userId: user.id };
}

function pathForTool(tool: Tool) {
  return `/dashboard/${tool}`;
}

export async function setFavoriteAction(
  id: string,
  isFavorite: boolean,
  tool: Tool
): Promise<MutationResult> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  const updated = await dbToggleFavorite(id, isFavorite);
  if (!updated) return { ok: false, error: "Could not update favorite." };

  revalidatePath(pathForTool(tool));
  return { ok: true };
}

export async function deleteGenerationAction(
  id: string,
  tool: Tool
): Promise<MutationResult> {
  const auth = await requireAuth();
  if (!auth.ok) return auth;

  const ok = await dbDelete(id);
  if (!ok) return { ok: false, error: "Could not delete generation." };

  revalidatePath(pathForTool(tool));
  return { ok: true };
}

export async function loadHistoryAction(tool: Tool): Promise<Generation[]> {
  const auth = await requireAuth();
  if (!auth.ok) return [];
  return await dbList(tool, 10);
}

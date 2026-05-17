"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { validateEmail } from "@/lib/email-validation";
import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
  error?: string;
  message?: string;
};

export async function signIn(formData: FormData): Promise<AuthResult> {
  const rawEmail = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Password is required." };
  }

  const emailCheck = validateEmail(rawEmail);
  if (!emailCheck.ok) {
    return { error: emailCheck.reason };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: emailCheck.email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signUp(formData: FormData): Promise<AuthResult> {
  const rawEmail = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!password) {
    return { error: "Password is required." };
  }
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const emailCheck = validateEmail(rawEmail);
  if (!emailCheck.ok) {
    return { error: emailCheck.reason };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: emailCheck.email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/dashboard");
  }

  return {
    message:
      "Account created. Please check your inbox to confirm your email before logging in.",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

function getAppUrlFromHeaders(): string {
  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  return "http://localhost:3000";
}

export async function requestPasswordReset(
  formData: FormData
): Promise<AuthResult> {
  const rawEmail = String(formData.get("email") ?? "");
  const emailCheck = validateEmail(rawEmail);
  if (!emailCheck.ok) {
    return { error: emailCheck.reason };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(emailCheck.email, {
    redirectTo: `${getAppUrlFromHeaders()}/auth/callback?next=/dashboard/account/password`,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    message:
      "If that email is registered, a password reset link is on its way. Check your inbox.",
  };
}

export async function updatePasswordAction(
  formData: FormData
): Promise<AuthResult> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

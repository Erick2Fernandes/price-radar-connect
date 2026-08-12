import { supabase } from "@/integrations/supabase/client";

export async function sendEmailCode(email: string) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/` },
  });
  if (error) throw error;
}

export async function verifyEmailCode(email: string, token: string) {
  const { data, error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) throw error;
  return data;
}

export async function saveProfile(input: { role: "cliente" | "mercado"; fullName?: string; marketName?: string }) {
  const { data: userRes } = await supabase.auth.getUser();
  const user = userRes.user;
  if (!user) return null;
  const row = {
    id: user.id,
    email: user.email ?? null,
    role: input.role,
    full_name: input.fullName ?? user.email?.split("@")[0] ?? null,
    market_name: input.marketName ?? null,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await supabase.from("profiles").upsert(row).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function signOutUser() {
  await supabase.auth.signOut();
}

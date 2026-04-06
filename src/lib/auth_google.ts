import { createClient } from "@/lib/supabase/client";

export async function signInWithGoogle(): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: "email profile",
      queryParams: {
        access_type: "online",
        prompt: "select_account",
      },
    },
  });

  if (error) {
    console.error("[signInWithGoogle]", error.message);
    throw error;
  }
}

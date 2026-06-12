"use client";

import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState } from "react";

const copy = {
  loading: "\u6b63\u5728\u9000\u51fa...",
  submit: "\u9000\u51fa\u767b\u5f55",
};

export default function SignOutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    setIsLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? copy.loading : copy.submit}
    </button>
  );
}

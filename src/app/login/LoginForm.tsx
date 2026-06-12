"use client";

import { getAuthErrorMessage } from "@/lib/authMessages";
import { createClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

const copy = {
  email: "\u90ae\u7bb1",
  password: "\u5bc6\u7801",
  loading: "\u6b63\u5728\u767b\u5f55...",
  submit: "\u767b\u5f55",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      setError(getAuthErrorMessage(signInError.message));
      return;
    }

    router.push(next);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          {copy.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-950"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          {copy.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-950"
        />
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md bg-slate-950 px-4 py-2.5 font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? copy.loading : copy.submit}
      </button>
    </form>
  );
}

"use client";

import { getAuthErrorMessage } from "@/lib/authMessages";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const copy = {
  email: "\u90ae\u7bb1",
  password: "\u5bc6\u7801",
  success:
    "\u8d26\u53f7\u5df2\u521b\u5efa\u3002\u8bf7\u6253\u5f00\u90ae\u7bb1\u5b8c\u6210\u786e\u8ba4\uff0c\u7136\u540e\u8fd4\u56de\u767b\u5f55\u3002",
  loading: "\u6b63\u5728\u6ce8\u518c...",
  submit: "\u6ce8\u518c",
};

export default function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    const supabase = createClient();
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setIsLoading(false);

    if (signUpError) {
      setError(getAuthErrorMessage(signUpError.message));
      return;
    }

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setMessage(copy.success);
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
          minLength={6}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-950"
        />
      </div>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
      {message ? <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p> : null}

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

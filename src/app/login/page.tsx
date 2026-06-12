import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

const copy = {
  brand: "\u7b80\u5386\u5de5\u574a",
  title: "\u767b\u5f55",
  description: "\u4f7f\u7528\u90ae\u7bb1\u548c\u5bc6\u7801\u7ee7\u7eed\u5236\u4f5c\u7b80\u5386\u3002",
  noAccount: "\u8fd8\u6ca1\u6709\u8d26\u53f7\uff1f",
  register: "\u53bb\u6ce8\u518c",
};

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <Link href="/" className="text-sm font-medium text-slate-500">
          {copy.brand}
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-slate-950">{copy.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{copy.description}</p>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          {copy.noAccount}{" "}
          <Link href="/register" className="font-medium text-slate-950">
            {copy.register}
          </Link>
        </p>
      </div>
    </main>
  );
}

import { createClient } from "@/lib/supabaseServer";
import Link from "next/link";
import { redirect } from "next/navigation";
import RegisterForm from "./RegisterForm";

const copy = {
  brand: "\u7b80\u5386\u5de5\u574a",
  title: "\u6ce8\u518c\u8d26\u53f7",
  description:
    "\u7b2c\u4e00\u7248\u4ec5\u652f\u6301\u90ae\u7bb1\u6ce8\u518c\uff0c\u4e0d\u63a5\u5165\u624b\u673a\u53f7\u6216\u7b2c\u4e09\u65b9\u767b\u5f55\u3002",
  hasAccount: "\u5df2\u7ecf\u6709\u8d26\u53f7\uff1f",
  login: "\u53bb\u767b\u5f55",
};

export default async function RegisterPage() {
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
        <RegisterForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          {copy.hasAccount}{" "}
          <Link href="/login" className="font-medium text-slate-950">
            {copy.login}
          </Link>
        </p>
      </div>
    </main>
  );
}

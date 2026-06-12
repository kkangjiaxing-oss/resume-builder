import ResumeList from "@/components/resume/ResumeList";
import SignOutButton from "@/components/SignOutButton";
import { mapResumeRowToResumeListItem } from "@/lib/resumeMappers";
import { createClient } from "@/lib/supabaseServer";
import type { ResumeRow } from "@/types/database";
import { redirect } from "next/navigation";

const copy = {
  brand: "\u7b80\u5386\u5de5\u574a",
  title: "\u6211\u7684\u7b80\u5386",
  createResume: "\u65b0\u5efa\u7b80\u5386",
  loadFailed: "\u7b80\u5386\u5217\u8868\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u540e\u91cd\u8bd5\u3002",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id,user_id,title,template_key,content,created_at,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<ResumeRow[]>();

  const resumes = data?.map(mapResumeRowToResumeListItem) ?? [];

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-8">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <p className="text-sm font-medium text-slate-500">{copy.brand}</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-950">{copy.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/resumes/new" className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white">
            {copy.createResume}
          </a>
          <SignOutButton />
        </div>
      </header>

      <section className="py-10">
        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-5 text-sm text-red-700">{copy.loadFailed}</div>
        ) : (
          <ResumeList resumes={resumes} />
        )}
      </section>
    </main>
  );
}

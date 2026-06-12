import PrintButton from "@/components/resume/PrintButton";
import TemplateRenderer from "@/components/resume/TemplateRenderer";
import { mapResumeRowToResume } from "@/lib/resumeMappers";
import { createClient } from "@/lib/supabaseServer";
import type { ResumeRow } from "@/types/database";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PrintResumePageProps = {
  params: Promise<{
    id: string;
  }>;
};

const copy = {
  backToEdit: "\u8fd4\u56de\u7f16\u8f91",
  printHint: "\u5bfc\u51fa\u5185\u5bb9\u4ee5\u6700\u8fd1\u4e00\u6b21\u4fdd\u5b58\u7248\u672c\u4e3a\u51c6\u3002",
};

export default async function PrintResumePage({ params }: PrintResumePageProps) {
  const { id } = await params;
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
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<ResumeRow>();

  if (error || !data) {
    notFound();
  }

  const resume = mapResumeRowToResume(data);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-6 text-slate-950 print:bg-white print:p-0">
      <div className="print-hidden mx-auto mb-6 flex max-w-5xl items-center justify-between gap-4">
        <div>
          <Link
            href={`/resumes/${resume.id}/edit`}
            className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {copy.backToEdit}
          </Link>
          <p className="mt-2 text-sm text-slate-600">{copy.printHint}</p>
        </div>
        <PrintButton />
      </div>

      <div className="print-page mx-auto overflow-hidden bg-white shadow-xl">
        <TemplateRenderer title={resume.title} templateKey={resume.templateKey} content={resume.content} />
      </div>
    </main>
  );
}

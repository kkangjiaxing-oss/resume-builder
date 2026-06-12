import ResumeEditor from "@/components/resume/ResumeEditor";
import { mapResumeRowToResume } from "@/lib/resumeMappers";
import { createClient } from "@/lib/supabaseServer";
import type { ResumeRow } from "@/types/database";
import { notFound, redirect } from "next/navigation";

type EditResumePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditResumePage({ params }: EditResumePageProps) {
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

  return <ResumeEditor resume={mapResumeRowToResume(data)} />;
}

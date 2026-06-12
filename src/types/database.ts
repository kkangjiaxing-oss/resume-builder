import type { ResumeContent, ResumeTemplateKey } from "@/types/resume";

export type ResumeRow = {
  id: string;
  user_id: string;
  title: string;
  template_key: ResumeTemplateKey;
  content: ResumeContent;
  created_at: string;
  updated_at: string;
};

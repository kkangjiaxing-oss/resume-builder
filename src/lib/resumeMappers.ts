import type { ResumeRow } from "@/types/database";
import type { Resume, ResumeListItem } from "@/types/resume";

export function mapResumeRowToResume(row: ResumeRow): Resume {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    templateKey: row.template_key,
    content: row.content,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapResumeRowToResumeListItem(row: ResumeRow): ResumeListItem {
  return {
    id: row.id,
    title: row.title,
    templateKey: row.template_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

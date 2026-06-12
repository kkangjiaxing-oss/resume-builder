import { getResumeTemplate } from "@/lib/templates";
import type { ResumeListItem } from "@/types/resume";
import Link from "next/link";

type ResumeListProps = {
  resumes: ResumeListItem[];
};

const copy = {
  emptyTitle: "\u8fd8\u6ca1\u6709\u7b80\u5386",
  emptyDescription: "\u4ece\u4e00\u4e2a\u7b80\u6d01\u6a21\u677f\u5f00\u59cb\uff0c\u5148\u5b8c\u6210\u7b2c\u4e00\u4efd\u53ef\u6295\u9012\u7684\u7b80\u5386\u3002",
  createFirst: "\u521b\u5efa\u7b2c\u4e00\u4efd\u7b80\u5386",
  template: "\u6a21\u677f",
  updatedAt: "\u6700\u540e\u66f4\u65b0",
  edit: "\u7f16\u8f91",
};

export default function ResumeList({ resumes }: ResumeListProps) {
  if (resumes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-xl font-semibold text-slate-950">{copy.emptyTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{copy.emptyDescription}</p>
        <Link
          href="/resumes/new"
          className="mt-6 inline-flex rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white"
        >
          {copy.createFirst}
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="divide-y divide-slate-200">
        {resumes.map((resume) => {
          const template = getResumeTemplate(resume.templateKey);

          return (
            <div key={resume.id} className="flex items-center justify-between gap-6 px-5 py-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold text-slate-950">{resume.title}</h2>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-slate-600">
                  <span>
                    {copy.template}
                    {"\uff1a"}
                    {template.name}
                  </span>
                  <span>
                    {copy.updatedAt}
                    {"\uff1a"}
                    {formatDateTime(resume.updatedAt)}
                  </span>
                </div>
              </div>
              <Link
                href={`/resumes/${resume.id}/edit`}
                className="shrink-0 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {copy.edit}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

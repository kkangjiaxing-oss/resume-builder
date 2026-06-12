"use client";

import { resumeTemplates } from "@/lib/templates";
import type { ApiResponse } from "@/types/api";
import type { ResumeTemplateKey } from "@/types/resume";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateResumeResponse = {
  id: string;
};

const copy = {
  create: "\u521b\u5efa\u7b80\u5386",
  creating: "\u521b\u5efa\u4e2d...",
  error: "\u521b\u5efa\u7b80\u5386\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
};

export default function TemplatePicker() {
  const router = useRouter();
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplateKey | null>(null);
  const [error, setError] = useState("");

  async function handleCreateResume(templateKey: ResumeTemplateKey) {
    setSelectedTemplate(templateKey);
    setError("");

    try {
      const response = await fetch("/api/resumes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateKey }),
      });

      const result: ApiResponse<CreateResumeResponse> = await response.json();

      if (!result.success) {
        setError(copy.error);
        setSelectedTemplate(null);
        return;
      }

      router.push(`/resumes/${result.data.id}/edit`);
    } catch {
      setError(copy.error);
      setSelectedTemplate(null);
    }
  }

  return (
    <div>
      {error ? <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-3">
        {resumeTemplates.map((template) => {
          const isCreating = selectedTemplate === template.key;
          const isDisabled = selectedTemplate !== null;

          return (
            <div key={template.key} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-32 items-center justify-center rounded-md border border-slate-200 bg-slate-50">
                <span className="text-sm font-medium text-slate-500">{template.name}</span>
              </div>
              <h2 className="mt-5 text-lg font-semibold text-slate-950">{template.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{template.description}</p>
              <button
                type="button"
                disabled={isDisabled}
                onClick={() => handleCreateResume(template.key)}
                className="mt-5 w-full rounded-md bg-slate-950 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isCreating ? copy.creating : copy.create}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

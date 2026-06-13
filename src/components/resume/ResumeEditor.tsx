"use client";

import AiPolishButton from "@/components/resume/AiPolishButton";
import ResumePreview from "@/components/resume/ResumePreview";
import type { ApiResponse } from "@/types/api";
import type { EducationItem, ExperienceItem, Resume, ResumeContent } from "@/types/resume";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

type ResumeEditorProps = {
  resume: Resume;
};

type SaveResumeResponse = {
  updatedAt: string;
};

const copy = {
  back: "\u8fd4\u56de\u6211\u7684\u7b80\u5386",
  titleLabel: "\u7b80\u5386\u6807\u9898",
  save: "\u4fdd\u5b58",
  saving: "\u4fdd\u5b58\u4e2d...",
  exportPdf: "\u5bfc\u51fa PDF",
  exporting: "\u6b63\u5728\u4fdd\u5b58...",
  exportHint: "\u5bfc\u51fa\u524d\u4f1a\u81ea\u52a8\u4fdd\u5b58\u5f53\u524d\u5185\u5bb9\uff0c\u7136\u540e\u76f4\u63a5\u4e0b\u8f7d PDF\u3002",
  saveSuccess: "\u4fdd\u5b58\u6210\u529f",
  saveError: "\u4fdd\u5b58\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
  confirmRemoveExperience: "\u786e\u5b9a\u5220\u9664\u8fd9\u6bb5\u5de5\u4f5c\u7ecf\u5386\u5417\uff1f",
  confirmRemoveEducation: "\u786e\u5b9a\u5220\u9664\u8fd9\u6bb5\u6559\u80b2\u7ecf\u5386\u5417\uff1f",
  basics: "\u57fa\u672c\u4fe1\u606f",
  name: "\u59d3\u540d",
  targetRole: "\u6c42\u804c\u5c97\u4f4d",
  email: "\u90ae\u7bb1",
  phone: "\u7535\u8bdd",
  city: "\u57ce\u5e02",
  summary: "\u4e2a\u4eba\u7b80\u4ecb",
  experience: "\u5de5\u4f5c\u7ecf\u5386",
  addExperience: "\u6dfb\u52a0\u5de5\u4f5c\u7ecf\u5386",
  removeExperience: "\u5220\u9664\u7ecf\u5386",
  company: "\u516c\u53f8",
  role: "\u804c\u4f4d",
  startDate: "\u5f00\u59cb\u65f6\u95f4",
  endDate: "\u7ed3\u675f\u65f6\u95f4",
  description: "\u7ecf\u5386\u63cf\u8ff0",
  education: "\u6559\u80b2\u7ecf\u5386",
  addEducation: "\u6dfb\u52a0\u6559\u80b2\u7ecf\u5386",
  removeEducation: "\u5220\u9664\u6559\u80b2",
  school: "\u5b66\u6821",
  degree: "\u5b66\u5386 / \u4e13\u4e1a",
  educationDescription: "\u6559\u80b2\u7ecf\u5386\u63cf\u8ff0",
  skills: "\u6280\u80fd",
};

export default function ResumeEditor({ resume }: ResumeEditorProps) {
  const [title, setTitle] = useState(resume.title);
  const [content, setContent] = useState<ResumeContent>(() => normalizeContent(resume.content));
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activePolishKey, setActivePolishKey] = useState<string | null>(null);

  async function saveResume() {
    setMessage("");
    setError("");

    try {
      const response = await fetch(`/api/resumes/${resume.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          templateKey: resume.templateKey,
          content,
        }),
      });

      const result: ApiResponse<SaveResumeResponse> = await response.json();

      if (!result.success) {
        setError(copy.saveError);
        return false;
      }

      setMessage(copy.saveSuccess);
      return true;
    } catch {
      setError(copy.saveError);
      return false;
    }
  }

  async function handleSave() {
    setIsSaving(true);

    try {
      await saveResume();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleExportPdf() {
    setIsExporting(true);

    try {
      const saved = await saveResume();

      if (saved) {
        window.location.href = `/api/resumes/${resume.id}/pdf`;
      }
    } finally {
      setIsExporting(false);
    }
  }

  function updateBasics(field: keyof ResumeContent["basics"], value: string) {
    setContent((current) => ({
      ...current,
      basics: {
        ...current.basics,
        [field]: value,
      },
    }));
  }

  function updateExperience(id: string, field: keyof ExperienceItem, value: string) {
    setContent((current) => {
      return {
        ...current,
        experience: current.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      };
    });
  }

  function addExperience() {
    setContent((current) => {
      return {
        ...current,
        experience: [...current.experience, createEmptyExperienceItem()],
      };
    });
  }

  function removeExperience(id: string) {
    if (!window.confirm(copy.confirmRemoveExperience)) {
      return;
    }

    setContent((current) => ({
      ...current,
      experience: current.experience.filter((item) => item.id !== id),
    }));
  }

  function updateEducation(id: string, field: keyof EducationItem, value: string) {
    setContent((current) => {
      return {
        ...current,
        education: current.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
      };
    });
  }

  function addEducation() {
    setContent((current) => ({
      ...current,
      education: [...current.education, createEmptyEducationItem()],
    }));
  }

  function removeEducation(id: string) {
    if (!window.confirm(copy.confirmRemoveEducation)) {
      return;
    }

    setContent((current) => ({
      ...current,
      education: current.education.filter((item) => item.id !== id),
    }));
  }

  function updateSkills(value: string) {
    setContent((current) => ({
      ...current,
      skills: value,
    }));
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-8 py-8">
      <header className="flex items-center justify-between border-b border-slate-200 pb-6">
        <div>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-950">
            {"\u2190 "}
            {copy.back}
          </Link>
          <div className="mt-4">
            <label htmlFor="resume-title" className="block text-sm font-medium text-slate-700">
              {copy.titleLabel}
            </label>
            <input
              id="resume-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="mt-2 w-full max-w-xl rounded-md border border-slate-300 bg-white px-3 py-2 text-xl font-semibold outline-none focus:border-slate-950"
            />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-3">
            {message ? <span className="text-sm text-emerald-700">{message}</span> : null}
            {error ? <span className="text-sm text-red-700">{error}</span> : null}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isSaving || isExporting}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {isExporting ? copy.exporting : copy.exportPdf}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isExporting}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? copy.saving : copy.save}
            </button>
          </div>
          <p className="max-w-sm text-right text-xs leading-5 text-slate-500">{copy.exportHint}</p>
        </div>
      </header>

      <div className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_480px]">
        <section className="space-y-6">
          <EditorSection title={copy.basics}>
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label={copy.name} value={content.basics.name} onChange={(value) => updateBasics("name", value)} />
              <TextField
                label={copy.targetRole}
                value={content.basics.targetRole}
                onChange={(value) => updateBasics("targetRole", value)}
              />
              <TextField label={copy.email} value={content.basics.email} onChange={(value) => updateBasics("email", value)} />
              <TextField label={copy.phone} value={content.basics.phone} onChange={(value) => updateBasics("phone", value)} />
              <TextField label={copy.city} value={content.basics.city} onChange={(value) => updateBasics("city", value)} />
            </div>
            <TextareaField label={copy.summary} value={content.basics.summary} onChange={(value) => updateBasics("summary", value)} />
            <AiPolishButton
              resumeId={resume.id}
              fieldType="summary"
              text={content.basics.summary}
              taskKey="summary"
              activeTaskKey={activePolishKey}
              onTaskChange={setActivePolishKey}
              onApply={(value) => updateBasics("summary", value)}
            />
          </EditorSection>

          <EditorSection title={copy.experience}>
            <div className="space-y-5">
              {content.experience.map((item, index) => (
                <div key={item.id} className="rounded-md border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-slate-700">
                      {copy.experience}
                      {" "}
                      {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(item.id)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {copy.removeExperience}
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label={copy.company} value={item.company} onChange={(value) => updateExperience(item.id, "company", value)} />
                    <TextField label={copy.role} value={item.role} onChange={(value) => updateExperience(item.id, "role", value)} />
                    <TextField
                      label={copy.startDate}
                      value={item.startDate}
                      onChange={(value) => updateExperience(item.id, "startDate", value)}
                    />
                    <TextField label={copy.endDate} value={item.endDate} onChange={(value) => updateExperience(item.id, "endDate", value)} />
                  </div>
                  <div className="mt-4">
                    <TextareaField
                      label={copy.description}
                      value={item.description}
                      onChange={(value) => updateExperience(item.id, "description", value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addExperience}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {copy.addExperience}
            </button>
          </EditorSection>

          <EditorSection title={copy.education}>
            <div className="space-y-5">
              {content.education.map((item, index) => (
                <div key={item.id} className="rounded-md border border-slate-200 p-4">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <h3 className="text-sm font-semibold text-slate-700">
                      {copy.education}
                      {" "}
                      {index + 1}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(item.id)}
                      className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      {copy.removeEducation}
                    </button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label={copy.school} value={item.school} onChange={(value) => updateEducation(item.id, "school", value)} />
                    <TextField label={copy.degree} value={item.degree} onChange={(value) => updateEducation(item.id, "degree", value)} />
                    <TextField
                      label={copy.startDate}
                      value={item.startDate}
                      onChange={(value) => updateEducation(item.id, "startDate", value)}
                    />
                    <TextField label={copy.endDate} value={item.endDate} onChange={(value) => updateEducation(item.id, "endDate", value)} />
                  </div>
                  <div className="mt-4">
                    <TextareaField
                      label={copy.educationDescription}
                      value={item.description}
                      onChange={(value) => updateEducation(item.id, "description", value)}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addEducation}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {copy.addEducation}
            </button>
          </EditorSection>

          <EditorSection title={copy.skills}>
            <TextareaField label={copy.skills} value={content.skills} onChange={updateSkills} />
          </EditorSection>
        </section>

        <ResumePreview title={title} templateKey={resume.templateKey} content={content} />
      </div>
    </main>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function TextField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-950"
      />
    </label>
  );
}

function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea
        value={value}
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => onChange(event.target.value)}
        rows={4}
        className="mt-2 w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-slate-950"
      />
    </label>
  );
}

function normalizeContent(content: ResumeContent): ResumeContent {
  return {
    ...content,
    basics: {
      name: content.basics?.name ?? "",
      targetRole: content.basics?.targetRole ?? "",
      email: content.basics?.email ?? "",
      phone: content.basics?.phone ?? "",
      city: content.basics?.city ?? "",
      summary: content.basics?.summary ?? "",
    },
    experience: Array.isArray(content.experience) ? content.experience.map(normalizeExperienceItem) : [],
    education: Array.isArray(content.education) ? content.education.map(normalizeEducationItem) : [],
    skills: typeof content.skills === "string" ? content.skills : "",
  };
}

function createEmptyExperienceItem(): ExperienceItem {
  return {
    id: createItemId("exp"),
    company: "",
    role: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function createEmptyEducationItem(): EducationItem {
  return {
    id: createItemId("edu"),
    school: "",
    degree: "",
    startDate: "",
    endDate: "",
    description: "",
  };
}

function normalizeExperienceItem(item: Partial<ExperienceItem>): ExperienceItem {
  return {
    id: item.id || createItemId("exp"),
    company: item.company ?? "",
    role: item.role ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    description: item.description ?? "",
  };
}

function normalizeEducationItem(item: Partial<EducationItem>): EducationItem {
  return {
    id: item.id || createItemId("edu"),
    school: item.school ?? "",
    degree: item.degree ?? "",
    startDate: item.startDate ?? "",
    endDate: item.endDate ?? "",
    description: item.description ?? "",
  };
}

function createItemId(prefix: "exp" | "edu") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

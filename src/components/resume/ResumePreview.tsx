import type { ResumeContent, ResumeTemplateKey } from "@/types/resume";
import TemplateRenderer from "./TemplateRenderer";

type ResumePreviewProps = {
  title: string;
  templateKey: ResumeTemplateKey;
  content: ResumeContent;
};

const copy = {
  preview: "\u5b9e\u65f6\u9884\u89c8",
};

export default function ResumePreview({ title, templateKey, content }: ResumePreviewProps) {
  return (
    <aside className="sticky top-6">
      <h2 className="mb-3 text-sm font-semibold text-slate-700">{copy.preview}</h2>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <TemplateRenderer title={title} templateKey={templateKey} content={content} />
      </div>
    </aside>
  );
}

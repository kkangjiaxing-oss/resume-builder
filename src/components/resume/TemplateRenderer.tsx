import type { ResumeContent, ResumeTemplateKey } from "@/types/resume";
import { templateRegistry } from "./templates/registry";

type TemplateRendererProps = {
  title: string;
  templateKey: ResumeTemplateKey;
  content: ResumeContent;
};

export default function TemplateRenderer({ title, templateKey, content }: TemplateRendererProps) {
  const Template = templateRegistry[templateKey]?.component ?? templateRegistry.classic.component;

  return <Template title={title} content={content} />;
}

import type { ResumeTemplateKey } from "@/types/resume";
import type { ReactNode } from "react";
import LegacyTemplate from "./LegacyTemplate";
import ModernTemplate from "./modern/ModernTemplate";
import type { ResumeTemplateComponentProps } from "./types";

type TemplateDefinition = {
  component: (props: ResumeTemplateComponentProps) => ReactNode;
};

export const templateRegistry: Record<ResumeTemplateKey, TemplateDefinition> = {
  classic: {
    component: (props) => <LegacyTemplate {...props} />,
  },
  modern: {
    component: ModernTemplate,
  },
  minimal: {
    component: (props) => <LegacyTemplate {...props} minimal />,
  },
};

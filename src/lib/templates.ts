import type { ResumeTemplate, ResumeTemplateKey } from "@/types/resume";

export const resumeTemplates: ResumeTemplate[] = [
  {
    key: "classic",
    name: "\u7ecf\u5178\u6a21\u677f",
    description: "\u7a33\u91cd\u6e05\u6670\u7684\u5355\u680f\u6392\u7248\uff0c\u9002\u5408\u5927\u591a\u6570\u901a\u7528\u5c97\u4f4d\u3002",
  },
  {
    key: "modern",
    name: "\u73b0\u4ee3\u6a21\u677f",
    description: "\u4fe1\u606f\u5c42\u6b21\u66f4\u660e\u786e\uff0c\u9002\u5408\u4e92\u8054\u7f51\u3001\u4ea7\u54c1\u548c\u6280\u672f\u5c97\u4f4d\u3002",
  },
  {
    key: "minimal",
    name: "\u6781\u7b80\u6a21\u677f",
    description: "\u9ed1\u767d\u7b80\u6d01\u98ce\u683c\uff0c\u7a81\u51fa\u5185\u5bb9\u672c\u8eab\uff0c\u9002\u5408\u4e25\u8083\u6295\u9012\u573a\u666f\u3002",
  },
];

export const defaultTemplateKey: ResumeTemplateKey = "classic";

export function isResumeTemplateKey(value: unknown): value is ResumeTemplateKey {
  return value === "classic" || value === "modern" || value === "minimal";
}

export function getResumeTemplate(key: ResumeTemplateKey) {
  return resumeTemplates.find((template) => template.key === key) ?? resumeTemplates[0];
}

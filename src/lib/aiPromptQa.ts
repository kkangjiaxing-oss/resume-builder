export type AiPromptQaCase = {
  name: string;
  fieldType: "summary" | "experience" | "education" | "skills";
  input: string;
  expectedDirection: string;
  forbiddenPatterns: RegExp[];
};

export const aiPromptQaCases: AiPromptQaCase[] = [
  {
    name: "experience-no-metrics",
    fieldType: "experience",
    input: "\u8d1f\u8d23\u540e\u53f0\u9875\u9762\u5f00\u53d1\uff0c\u4fee bug",
    expectedDirection:
      "\u8d1f\u8d23\u540e\u53f0\u7ba1\u7406\u7cfb\u7edf\u9875\u9762\u5f00\u53d1\u4e0e\u95ee\u9898\u6392\u67e5\uff0c\u6301\u7eed\u4f18\u5316\u529f\u80fd\u4f53\u9a8c\u548c\u4ea4\u4ed8\u8d28\u91cf\u3002",
    forbiddenPatterns: [
      /\d+%/,
      /\d+\s*\u4eba/,
      /\d+\s*\u4e07/,
      /\d+\s*\u4e2a/,
      /\u767e\u4e07|\u5343\u4e07|\u4ebf/,
      /\u63d0\u5347.*\d+/,
      /\u589e\u957f.*\d+/,
      /\u5e26\u9886.*\u56e2\u961f/,
    ],
  },
];

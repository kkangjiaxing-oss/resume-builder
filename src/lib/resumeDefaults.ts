import type { ResumeContent } from "@/types/resume";

export const defaultResumeTitle = "\u672a\u547d\u540d\u7b80\u5386";

export const defaultResumeContent: ResumeContent = {
  basics: {
    name: "\u5f20\u4e09",
    targetRole: "\u524d\u7aef\u5de5\u7a0b\u5e08",
    email: "zhangsan@example.com",
    phone: "138 0000 0000",
    city: "\u4e0a\u6d77",
    summary:
      "\u5177\u5907 3 \u5e74\u524d\u7aef\u5f00\u53d1\u7ecf\u9a8c\uff0c\u719f\u6089 React\u3001TypeScript \u548c Next.js\uff0c\u53c2\u4e0e\u8fc7\u591a\u4e2a B \u7aef\u4e1a\u52a1\u7cfb\u7edf\u5efa\u8bbe\u3002",
  },
  experience: [
    {
      id: "exp-1",
      company: "\u67d0\u79d1\u6280\u516c\u53f8",
      role: "\u524d\u7aef\u5de5\u7a0b\u5e08",
      startDate: "2022.07",
      endDate: "\u81f3\u4eca",
      description:
        "\u8d1f\u8d23\u540e\u53f0\u7ba1\u7406\u7cfb\u7edf\u6838\u5fc3\u6a21\u5757\u5f00\u53d1\uff0c\u53c2\u4e0e\u7ec4\u4ef6\u5e93\u5efa\u8bbe\u4e0e\u6027\u80fd\u4f18\u5316\uff0c\u63d0\u5347\u9875\u9762\u52a0\u8f7d\u901f\u5ea6\u548c\u56e2\u961f\u5f00\u53d1\u6548\u7387\u3002",
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "\u67d0\u67d0\u5927\u5b66",
      degree: "\u8ba1\u7b97\u673a\u79d1\u5b66\u4e0e\u6280\u672f \u672c\u79d1",
      startDate: "2018.09",
      endDate: "2022.06",
      description:
        "\u4e3b\u4fee\u6570\u636e\u7ed3\u6784\u3001\u64cd\u4f5c\u7cfb\u7edf\u3001\u8ba1\u7b97\u673a\u7f51\u7edc\u3001\u6570\u636e\u5e93\u7cfb\u7edf\u7b49\u8bfe\u7a0b\u3002",
    },
  ],
  skills: "React\u3001TypeScript\u3001Next.js\u3001TailwindCSS\u3001Git\u3001RESTful API",
};

export function createDefaultResumeContent(): ResumeContent {
  return structuredClone(defaultResumeContent);
}

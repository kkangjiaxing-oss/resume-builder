export type ResumeTemplateKey = "classic" | "modern" | "minimal";

export type ResumeBasics = {
  name: string;
  targetRole: string;
  email: string;
  phone: string;
  city: string;
  summary: string;
};

export type ExperienceItem = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type EducationItem = {
  id: string;
  school: string;
  degree: string;
  startDate: string;
  endDate: string;
  description: string;
};

export type ResumeContent = {
  basics: ResumeBasics;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string;
};

export type Resume = {
  id: string;
  userId: string;
  title: string;
  templateKey: ResumeTemplateKey;
  content: ResumeContent;
  createdAt: string;
  updatedAt: string;
};

export type ResumeListItem = Pick<Resume, "id" | "title" | "templateKey" | "createdAt" | "updatedAt">;

export type ResumeTemplate = {
  key: ResumeTemplateKey;
  name: string;
  description: string;
};

import type { ResumeContent } from "@/types/resume";

type LegacyTemplateProps = {
  title: string;
  content: ResumeContent;
  accentClassName?: string;
  minimal?: boolean;
};

const copy = {
  summary: "个人简介",
  experience: "工作经历",
  education: "教育经历",
  skills: "技能",
};

export default function LegacyTemplate({
  title,
  content,
  accentClassName = "text-slate-950",
  minimal = false,
}: LegacyTemplateProps) {
  return (
    <article className={`resume-template legacy-template min-h-[720px] bg-white p-8 text-slate-950 ${minimal ? "font-sans" : ""}`}>
      <header className="border-b border-slate-200 pb-5">
        <p className="text-xs text-slate-500">{title}</p>
        <h1 className={`mt-2 text-3xl font-semibold ${accentClassName}`}>{content.basics.name}</h1>
        <p className="mt-1 text-base font-medium text-slate-700">{content.basics.targetRole}</p>
        <p className="mt-3 text-sm text-slate-600">
          {[content.basics.email, content.basics.phone, content.basics.city].filter(Boolean).join(" / ")}
        </p>
      </header>

      <section className="mt-6">
        <h2 className={`text-sm font-semibold ${accentClassName}`}>{copy.summary}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{content.basics.summary}</p>
      </section>

      {content.experience.length > 0 ? (
        <section className="mt-6">
          <h2 className={`text-sm font-semibold ${accentClassName}`}>{copy.experience}</h2>
          <div className="mt-2 space-y-5">
            {content.experience.map((item) => (
              <div key={item.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-slate-950">{item.company}</h3>
                  <p className="shrink-0 text-xs text-slate-500">
                    {item.startDate} - {item.endDate}
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">{item.role}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {content.education.length > 0 ? (
        <section className="mt-6">
          <h2 className={`text-sm font-semibold ${accentClassName}`}>{copy.education}</h2>
          <div className="mt-2 space-y-5">
            {content.education.map((item) => (
              <div key={item.id} className="resume-entry">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-medium text-slate-950">{item.school}</h3>
                  <p className="shrink-0 text-xs text-slate-500">
                    {item.startDate} - {item.endDate}
                  </p>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-700">{item.degree}</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-6">
        <h2 className={`text-sm font-semibold ${accentClassName}`}>{copy.skills}</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{content.skills}</p>
      </section>
    </article>
  );
}

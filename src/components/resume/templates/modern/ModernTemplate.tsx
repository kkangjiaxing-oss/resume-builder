import type { ResumeContent } from "@/types/resume";

type ModernTemplateProps = {
  title: string;
  content: ResumeContent;
};

const copy = {
  profile: "PROFILE",
  contact: "联系方式",
  skills: "核心技能",
  education: "教育背景",
  experience: "工作经历",
};

export default function ModernTemplate({ title, content }: ModernTemplateProps) {
  const contactItems = [
    { icon: "✉", value: content.basics.email },
    { icon: "☎", value: content.basics.phone },
    { icon: "⌖", value: content.basics.city },
  ].filter((item) => item.value);

  return (
    <article className="resume-template modern-template bg-white text-slate-950">
      <div className="modern-shell">
        <aside className="modern-sidebar">
          <div className="modern-sidebar-mark" />
          <p className="modern-kicker">{title}</p>
          <h1 className="modern-name">{content.basics.name || "姓名"}</h1>
          <p className="modern-role">{content.basics.targetRole || "求职岗位"}</p>

          <section className="modern-side-section">
            <h2 className="modern-side-title">{copy.contact}</h2>
            <div className="modern-contact-list">
              {contactItems.map((item) => (
                <p key={item.icon} className="modern-contact-item">
                  <span className="modern-contact-icon">{item.icon}</span>
                  <span>{item.value}</span>
                </p>
              ))}
            </div>
          </section>

          {content.skills ? (
            <section className="modern-side-section">
              <h2 className="modern-side-title">{copy.skills}</h2>
              <div className="modern-skill-list">
                {splitSkills(content.skills).map((skill) => (
                  <span key={skill} className="modern-skill-pill">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          ) : null}

          {content.education.length > 0 ? (
            <section className="modern-side-section">
              <h2 className="modern-side-title">{copy.education}</h2>
              <div className="modern-education-list">
                {content.education.map((item) => (
                  <div key={item.id} className="modern-side-entry">
                    <h3>{item.school}</h3>
                    <p>{item.degree}</p>
                    <span>
                      {item.startDate} - {item.endDate}
                    </span>
                    {item.description ? <p className="modern-side-description">{item.description}</p> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </aside>

        <main className="modern-main">
          <section className="modern-profile-section">
            <div>
              <p className="modern-section-eyebrow">{copy.profile}</p>
              <h2 className="modern-section-title">个人简介</h2>
            </div>
            <p className="modern-summary">{content.basics.summary}</p>
          </section>

          {content.experience.length > 0 ? (
            <section className="modern-section">
              <div className="modern-section-heading">
                <span />
                <h2>{copy.experience}</h2>
              </div>
              <div className="modern-timeline">
                {content.experience.map((item) => (
                  <div key={item.id} className="modern-timeline-entry resume-entry">
                    <div className="modern-timeline-dot" />
                    <div className="modern-entry-header">
                      <div>
                        <h3>{item.company}</h3>
                        <p>{item.role}</p>
                      </div>
                      <span>
                        {item.startDate} - {item.endDate}
                      </span>
                    </div>
                    <p className="modern-entry-description">{item.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </article>
  );
}

function splitSkills(skills: string) {
  return skills
    .split(/[、,，\n]/)
    .map((skill) => skill.trim())
    .filter(Boolean);
}

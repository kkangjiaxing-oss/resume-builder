import Link from "next/link";

const sections = [
  {
    title: "\u6211\u4eec\u6536\u96c6\u7684\u4fe1\u606f",
    body: "\u6211\u4eec\u4f1a\u4fdd\u5b58\u4f60\u6ce8\u518c\u548c\u4f7f\u7528\u670d\u52a1\u65f6\u63d0\u4f9b\u7684\u8d26\u6237\u4fe1\u606f\u3001\u7b80\u5386\u6807\u9898\u548c\u7b80\u5386\u5185\u5bb9\uff0c\u5305\u62ec\u59d3\u540d\u3001\u8054\u7cfb\u65b9\u5f0f\u3001\u5de5\u4f5c\u7ecf\u5386\u3001\u6559\u80b2\u7ecf\u5386\u548c\u6280\u80fd\u7b49\u4f60\u4e3b\u52a8\u586b\u5199\u7684\u5185\u5bb9\u3002",
  },
  {
    title: "\u4fe1\u606f\u5982\u4f55\u4f7f\u7528",
    body: "\u8fd9\u4e9b\u4fe1\u606f\u7528\u4e8e\u63d0\u4f9b\u7b80\u5386\u7f16\u8f91\u3001\u4fdd\u5b58\u3001\u9884\u89c8\u548c PDF \u5bfc\u51fa\u529f\u80fd\u3002\u6211\u4eec\u4e0d\u4f1a\u51fa\u552e\u4f60\u7684\u7b80\u5386\u6570\u636e\u3002",
  },
  {
    title: "AI \u6da6\u8272",
    body: "\u5f53\u4f60\u4f7f\u7528 AI \u6da6\u8272\u529f\u80fd\u65f6\uff0c\u4f60\u63d0\u4ea4\u7684\u6587\u672c\u4f1a\u53d1\u9001\u7ed9\u7b2c\u4e09\u65b9 AI \u670d\u52a1\u63d0\u4f9b\u5546\u7528\u4e8e\u751f\u6210\u6da6\u8272\u7ed3\u679c\u3002\u8bf7\u907f\u514d\u63d0\u4ea4\u4e0d\u5fc5\u8981\u7684\u654f\u611f\u4fe1\u606f\u3002",
  },
  {
    title: "\u6570\u636e\u5b58\u50a8",
    body: "\u8d26\u6237\u548c\u7b80\u5386\u6570\u636e\u5b58\u50a8\u5728 Supabase \u63d0\u4f9b\u7684\u57fa\u7840\u8bbe\u65bd\u4e2d\u3002\u4f60\u53ef\u4ee5\u5728\u4ea7\u54c1\u5185\u4fee\u6539\u81ea\u5df1\u7684\u7b80\u5386\u5185\u5bb9\u3002",
  },
  {
    title: "\u8054\u7cfb",
    body: "\u5982\u679c\u4f60\u5bf9\u9690\u79c1\u6216\u6570\u636e\u4f7f\u7528\u6709\u7591\u95ee\uff0c\u8bf7\u8054\u7cfb\u9879\u76ee\u7ef4\u62a4\u8005\u3002",
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-8 py-10">
      <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-950">
        {"\u2190 "}
        {"\u8fd4\u56de\u9996\u9875"}
      </Link>
      <header className="mt-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Privacy Policy</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {"\u672c\u9875\u8bf4\u660e\u7b80\u5386\u5de5\u574a MVP \u5982\u4f55\u5904\u7406\u4f60\u5728\u4f7f\u7528\u4ea7\u54c1\u65f6\u63d0\u4f9b\u7684\u4fe1\u606f\u3002"}
        </p>
      </header>
      <div className="space-y-6 py-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-lg font-semibold text-slate-950">{section.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}

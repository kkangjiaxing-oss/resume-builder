import Link from "next/link";

const sections = [
  {
    title: "\u670d\u52a1\u8bf4\u660e",
    body: "\u7b80\u5386\u5de5\u574a\u662f\u4e00\u4e2a\u7528\u4e8e\u521b\u5efa\u3001\u7f16\u8f91\u3001AI \u6da6\u8272\u548c\u5bfc\u51fa\u7b80\u5386\u7684 MVP \u4ea7\u54c1\u3002\u670d\u52a1\u6309\u73b0\u72b6\u63d0\u4f9b\uff0c\u53ef\u80fd\u968f\u65f6\u8c03\u6574\u6216\u4e2d\u65ad\u3002",
  },
  {
    title: "\u7528\u6237\u8d23\u4efb",
    body: "\u4f60\u9700\u5bf9\u81ea\u5df1\u586b\u5199\u3001\u4e0a\u4f20\u6216\u4fdd\u5b58\u7684\u7b80\u5386\u5185\u5bb9\u8d1f\u8d23\uff0c\u5e76\u786e\u4fdd\u8fd9\u4e9b\u5185\u5bb9\u771f\u5b9e\u3001\u5408\u6cd5\u4e14\u4e0d\u4fb5\u72af\u4ed6\u4eba\u6743\u5229\u3002",
  },
  {
    title: "AI \u8f93\u51fa",
    body: "AI \u6da6\u8272\u7ed3\u679c\u4ec5\u4f9b\u53c2\u8003\u3002\u4f60\u5e94\u5728\u4f7f\u7528\u524d\u81ea\u884c\u5ba1\u6838\u3001\u4fee\u6539\u548c\u786e\u8ba4\u8f93\u51fa\u5185\u5bb9\uff0c\u6211\u4eec\u4e0d\u4fdd\u8bc1 AI \u8f93\u51fa\u7684\u51c6\u786e\u6027\u3001\u5b8c\u6574\u6027\u6216\u9002\u7528\u6027\u3002",
  },
  {
    title: "\u6c42\u804c\u7ed3\u679c",
    body: "\u672c\u670d\u52a1\u4e0d\u4fdd\u8bc1\u4f60\u83b7\u5f97\u9762\u8bd5\u3001\u5f55\u7528\u6216\u5176\u4ed6\u6c42\u804c\u7ed3\u679c\u3002\u7b80\u5386\u5185\u5bb9\u548c\u6295\u9012\u51b3\u7b56\u9700\u7531\u4f60\u81ea\u884c\u5224\u65ad\u3002",
  },
  {
    title: "\u7981\u6b62\u6ee5\u7528",
    body: "\u4f60\u4e0d\u5f97\u4f7f\u7528\u672c\u670d\u52a1\u8fdb\u884c\u6076\u610f\u8bf7\u6c42\u3001\u5237\u63a5\u53e3\u3001\u653b\u51fb\u7cfb\u7edf\u6216\u5176\u4ed6\u5f71\u54cd\u670d\u52a1\u7a33\u5b9a\u6027\u7684\u884c\u4e3a\u3002",
  },
];

export default function TermsPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-8 py-10">
      <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-950">
        {"\u2190 "}
        {"\u8fd4\u56de\u9996\u9875"}
      </Link>
      <header className="mt-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold text-slate-950">Terms of Service</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {"\u4f7f\u7528\u7b80\u5386\u5de5\u574a MVP \u5373\u8868\u793a\u4f60\u7406\u89e3\u5e76\u63a5\u53d7\u4ee5\u4e0b\u6761\u6b3e\u3002"}
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

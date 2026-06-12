import Link from "next/link";

const copy = {
  brand: "\u7b80\u5386\u5de5\u574a",
  login: "\u767b\u5f55",
  start: "\u5f00\u59cb\u5236\u4f5c",
  eyebrow: "7 \u5929\u4e0a\u7ebf\u9a8c\u8bc1\u7248",
  title: "\u5feb\u901f\u5236\u4f5c\u4e00\u4efd\u4e13\u4e1a\u4e2d\u6587\u7b80\u5386\uff0c\u5e76\u7528 AI \u6da6\u8272\u8868\u8fbe\u3002",
  description:
    "\u9009\u62e9\u7b80\u6d01\u6a21\u677f\uff0c\u586b\u5199\u4e2a\u4eba\u7ecf\u5386\uff0c\u4f18\u5316\u7b80\u5386\u6587\u6848\uff0c\u7136\u540e\u5bfc\u51fa\u53ef\u6295\u9012\u7684 PDF\u3002",
  createResume: "\u7acb\u5373\u5236\u4f5c\u7b80\u5386",
  existingAccount: "\u5df2\u6709\u8d26\u53f7\uff0c\u53bb\u767b\u5f55",
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col px-8 py-10">
      <nav className="flex items-center justify-between">
        <span className="text-lg font-semibold">{copy.brand}</span>
        <div className="flex items-center gap-3 text-sm">
          <Link className="rounded-md px-3 py-2 text-slate-700 hover:bg-white" href="/login">
            {copy.login}
          </Link>
          <Link className="rounded-md bg-slate-950 px-4 py-2 font-medium text-white" href="/register">
            {copy.start}
          </Link>
        </div>
      </nav>

      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">{copy.eyebrow}</p>
        <h1 className="max-w-3xl text-5xl font-semibold leading-tight text-slate-950">{copy.title}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">{copy.description}</p>
        <div className="mt-8 flex gap-3">
          <Link className="rounded-md bg-slate-950 px-5 py-3 font-medium text-white" href="/register">
            {copy.createResume}
          </Link>
          <Link className="rounded-md border border-slate-300 bg-white px-5 py-3 font-medium" href="/login">
            {copy.existingAccount}
          </Link>
        </div>
      </section>
    </main>
  );
}

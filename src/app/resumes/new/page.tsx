import TemplatePicker from "@/components/resume/TemplatePicker";
import Link from "next/link";

const copy = {
  back: "\u8fd4\u56de\u6211\u7684\u7b80\u5386",
  title: "\u9009\u62e9\u7b80\u5386\u6a21\u677f",
  description: "\u5148\u9009\u4e00\u4e2a\u6a21\u677f\u5f00\u59cb\uff0c\u540e\u7eed\u53ef\u4ee5\u7ee7\u7eed\u8c03\u6574\u7b80\u5386\u5185\u5bb9\u3002",
};

export default function NewResumePage() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-8 py-8">
      <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-950">
        {"\u2190 "}
        {copy.back}
      </Link>

      <header className="mt-8 border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-semibold text-slate-950">{copy.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{copy.description}</p>
      </header>

      <section className="py-8">
        <TemplatePicker />
      </section>
    </main>
  );
}

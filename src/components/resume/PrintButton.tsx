"use client";

const copy = {
  exportPdf: "\u5bfc\u51fa PDF",
};

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
    >
      {copy.exportPdf}
    </button>
  );
}

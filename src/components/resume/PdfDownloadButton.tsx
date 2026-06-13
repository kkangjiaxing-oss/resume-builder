"use client";

type PdfDownloadButtonProps = {
  resumeId: string;
  children: React.ReactNode;
  className: string;
  disabled?: boolean;
};

export default function PdfDownloadButton({ resumeId, children, className, disabled = false }: PdfDownloadButtonProps) {
  function handleDownload() {
    if (disabled) {
      return;
    }

    window.location.href = `/api/resumes/${resumeId}/pdf`;
  }

  return (
    <button type="button" onClick={handleDownload} disabled={disabled} className={className}>
      {children}
    </button>
  );
}

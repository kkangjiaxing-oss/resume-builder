"use client";

import type { ApiResponse } from "@/types/api";
import type { AiPolishFieldType } from "@/types/ai";
import { useState } from "react";

type AiPolishButtonProps = {
  resumeId: string;
  fieldType: AiPolishFieldType;
  text: string;
  activeTaskKey: string | null;
  taskKey: string;
  onTaskChange: (taskKey: string | null) => void;
  onApply: (text: string) => void;
};

type PolishResponseData = {
  text: string;
};

const copy = {
  polish: "AI \u6da6\u8272",
  polishing: "\u6da6\u8272\u4e2d...",
  apply: "\u5e94\u7528",
  retry: "\u91cd\u65b0\u6da6\u8272",
  cancel: "\u53d6\u6d88",
  count: "\u5f53\u524d\u5b57\u6570",
  error: "\u6da6\u8272\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5",
};

export default function AiPolishButton({
  resumeId,
  fieldType,
  text,
  activeTaskKey,
  taskKey,
  onTaskChange,
  onApply,
}: AiPolishButtonProps) {
  const [suggestion, setSuggestion] = useState("");
  const [error, setError] = useState("");
  const isPolishing = activeTaskKey === taskKey;
  const isAnotherTaskRunning = activeTaskKey !== null && activeTaskKey !== taskKey;
  const characterCount = text.trim().length;

  async function handlePolish() {
    if (activeTaskKey !== null) {
      return;
    }

    setError("");
    setSuggestion("");
    onTaskChange(taskKey);

    try {
      const response = await fetch("/api/ai/polish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resumeId,
          fieldType,
          text,
        }),
      });

      const result: ApiResponse<PolishResponseData> = await response.json();

      if (!result.success) {
        setError(result.error.message || copy.error);
        return;
      }

      setSuggestion(result.data.text);
    } catch {
      setError(copy.error);
    } finally {
      onTaskChange(null);
    }
  }

  function handleApply() {
    onApply(suggestion);
    setSuggestion("");
    setError("");
  }

  function handleCancel() {
    setSuggestion("");
    setError("");
  }

  return (
    <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-500">
          {copy.count}
          {"\uff1a"}
          {characterCount}
        </p>
        <button
          type="button"
          onClick={handlePolish}
          disabled={isPolishing || isAnotherTaskRunning}
          className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPolishing ? copy.polishing : copy.polish}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

      {suggestion ? (
        <div className="mt-3 rounded-md border border-slate-200 bg-white p-3">
          <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{suggestion}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={handleApply} className="rounded-md bg-slate-950 px-3 py-1.5 text-xs font-medium text-white">
              {copy.apply}
            </button>
            <button
              type="button"
              onClick={handlePolish}
              disabled={isPolishing || isAnotherTaskRunning}
              className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPolishing ? copy.polishing : copy.retry}
            </button>
            <button type="button" onClick={handleCancel} className="rounded-md px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
              {copy.cancel}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

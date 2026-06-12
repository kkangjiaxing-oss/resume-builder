import { polishResumeText } from "@/lib/ai";
import { createClient } from "@/lib/supabaseServer";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { AiPolishFieldType } from "@/types/ai";
import { NextResponse, type NextRequest } from "next/server";

type ApiErrorCode = "UNAUTHORIZED" | "INVALID_PAYLOAD" | "RESUME_NOT_FOUND" | "RATE_LIMITED" | "AI_POLISH_FAILED";

type PolishRequestPayload = {
  resumeId: string;
  fieldType: AiPolishFieldType;
  text: string;
};

type PolishResponseData = {
  text: string;
};

const fieldLengthLimits: Record<AiPolishFieldType, { min: number; max: number }> = {
  summary: { min: 10, max: 1000 },
  experience: { min: 10, max: 3000 },
  education: { min: 10, max: 2000 },
  skills: { min: 2, max: 500 },
};

const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMaxRequests = 10;

// MVP-only protection: this in-memory limiter is suitable for local development
// and small-scale internal testing. It is not a production-grade global quota or
// abuse-prevention system because serverless instances do not share memory.
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function successResponse<T>(data: T, status = 200) {
  const body: ApiSuccess<T> = {
    success: true,
    data,
  };

  return NextResponse.json(body, { status });
}

function errorResponse(code: ApiErrorCode, message: string, status: number) {
  const body: ApiError<ApiErrorCode> = {
    success: false,
    error: {
      code,
      message,
    },
  };

  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("UNAUTHORIZED", "\u8bf7\u5148\u767b\u5f55\u3002", 401);
  }

  const payload = await parseJson(request);

  if (!isPolishRequestPayload(payload)) {
    return errorResponse("INVALID_PAYLOAD", "\u8bf7\u63d0\u4f9b\u6b63\u786e\u7684\u6da6\u8272\u5185\u5bb9\u3002", 400);
  }

  const { data: resume, error: resumeError } = await supabase
    .from("resumes")
    .select("id")
    .eq("id", payload.resumeId)
    .eq("user_id", user.id)
    .maybeSingle<{ id: string }>();

  if (resumeError) {
    return errorResponse("AI_POLISH_FAILED", "\u6da6\u8272\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002", 500);
  }

  if (!resume) {
    return errorResponse("RESUME_NOT_FOUND", "\u7b80\u5386\u4e0d\u5b58\u5728\u3002", 404);
  }

  if (!isTextLengthValid(payload.fieldType, payload.text)) {
    return errorResponse("INVALID_PAYLOAD", "\u6587\u672c\u957f\u5ea6\u4e0d\u7b26\u5408\u6da6\u8272\u8981\u6c42\u3002", 400);
  }

  if (!checkRateLimit(user.id)) {
    return errorResponse("RATE_LIMITED", "AI \u6da6\u8272\u8bf7\u6c42\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002", 429);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const polishedText = await polishResumeText(payload.fieldType, payload.text.trim(), {
      signal: controller.signal,
    });

    if (!polishedText) {
      return errorResponse("AI_POLISH_FAILED", "\u6da6\u8272\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002", 500);
    }

    return successResponse<PolishResponseData>({
      text: polishedText,
    });
  } catch {
    return errorResponse("AI_POLISH_FAILED", "\u6da6\u8272\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002", 500);
  } finally {
    clearTimeout(timeout);
  }
}

async function parseJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function isPolishRequestPayload(value: unknown): value is PolishRequestPayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.resumeId === "string" &&
    value.resumeId.trim().length > 0 &&
    isAiPolishFieldType(value.fieldType) &&
    typeof value.text === "string"
  );
}

function isAiPolishFieldType(value: unknown): value is AiPolishFieldType {
  return value === "summary" || value === "experience" || value === "education" || value === "skills";
}

function isTextLengthValid(fieldType: AiPolishFieldType, text: string) {
  const trimmedLength = text.trim().length;
  const limit = fieldLengthLimits[fieldType];

  return trimmedLength >= limit.min && trimmedLength <= limit.max;
}

function checkRateLimit(userId: string) {
  const now = Date.now();
  const current = rateLimitStore.get(userId);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(userId, {
      count: 1,
      resetAt: now + rateLimitWindowMs,
    });
    return true;
  }

  if (current.count >= rateLimitMaxRequests) {
    return false;
  }

  current.count += 1;
  return true;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

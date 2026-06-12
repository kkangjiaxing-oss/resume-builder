import { mapResumeRowToResume } from "@/lib/resumeMappers";
import { createClient } from "@/lib/supabaseServer";
import { isResumeTemplateKey } from "@/lib/templates";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { ResumeRow } from "@/types/database";
import type { Resume, ResumeContent, ResumeTemplateKey } from "@/types/resume";
import { NextResponse, type NextRequest } from "next/server";

type ApiErrorCode = "UNAUTHORIZED" | "INVALID_PAYLOAD" | "RESUME_NOT_FOUND" | "RESUME_FETCH_FAILED" | "RESUME_UPDATE_FAILED";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type UpdateResumePayload = {
  title: string;
  templateKey: ResumeTemplateKey;
  content: ResumeContent;
};

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

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabase, user };
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return errorResponse("UNAUTHORIZED", "\u8bf7\u5148\u767b\u5f55\u3002", 401);
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id,user_id,title,template_key,content,created_at,updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<ResumeRow>();

  if (error) {
    return errorResponse("RESUME_FETCH_FAILED", "\u83b7\u53d6\u7b80\u5386\u5931\u8d25\u3002", 500);
  }

  if (!data) {
    return errorResponse("RESUME_NOT_FOUND", "\u7b80\u5386\u4e0d\u5b58\u5728\u3002", 404);
  }

  return successResponse<Resume>(mapResumeRowToResume(data));
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return errorResponse("UNAUTHORIZED", "\u8bf7\u5148\u767b\u5f55\u3002", 401);
  }

  const payload = await parseJson(request);

  if (!isUpdateResumePayload(payload)) {
    return errorResponse("INVALID_PAYLOAD", "\u8bf7\u63d0\u4f9b\u5b8c\u6574\u4e14\u6b63\u786e\u7684\u7b80\u5386\u5185\u5bb9\u3002", 400);
  }

  const { data, error } = await supabase
    .from("resumes")
    .update({
      title: payload.title.trim(),
      template_key: payload.templateKey,
      content: payload.content,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id,user_id,title,template_key,content,created_at,updated_at")
    .maybeSingle<ResumeRow>();

  if (error) {
    return errorResponse("RESUME_UPDATE_FAILED", "\u4fdd\u5b58\u7b80\u5386\u5931\u8d25\u3002", 500);
  }

  if (!data) {
    return errorResponse("RESUME_NOT_FOUND", "\u7b80\u5386\u4e0d\u5b58\u5728\u3002", 404);
  }

  return successResponse({
    updatedAt: data.updated_at,
  });
}

async function parseJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function isUpdateResumePayload(value: unknown): value is UpdateResumePayload {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    isResumeTemplateKey(value.templateKey) &&
    isRecord(value.content)
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

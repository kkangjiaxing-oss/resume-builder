import { defaultResumeTitle, createDefaultResumeContent } from "@/lib/resumeDefaults";
import { mapResumeRowToResumeListItem } from "@/lib/resumeMappers";
import { createClient } from "@/lib/supabaseServer";
import { defaultTemplateKey, isResumeTemplateKey } from "@/lib/templates";
import type { ApiError, ApiSuccess } from "@/types/api";
import type { ResumeRow } from "@/types/database";
import type { ResumeTemplateKey } from "@/types/resume";
import { NextResponse, type NextRequest } from "next/server";

type ApiErrorCode = "UNAUTHORIZED" | "INVALID_TEMPLATE" | "RESUMES_FETCH_FAILED" | "RESUME_CREATE_FAILED";

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
    error,
  } = await supabase.auth.getUser();

  return { supabase, user, error };
}

export async function GET() {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return errorResponse("UNAUTHORIZED", "\u8bf7\u5148\u767b\u5f55\u3002", 401);
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id,user_id,title,template_key,content,created_at,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<ResumeRow[]>();

  if (error) {
    return errorResponse("RESUMES_FETCH_FAILED", "\u83b7\u53d6\u7b80\u5386\u5217\u8868\u5931\u8d25\u3002", 500);
  }

  return successResponse(data.map(mapResumeRowToResumeListItem));
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await getAuthenticatedUser();

  if (!user) {
    return errorResponse("UNAUTHORIZED", "\u8bf7\u5148\u767b\u5f55\u3002", 401);
  }

  let templateKey: ResumeTemplateKey = defaultTemplateKey;

  const body = await parseOptionalJson(request);

  if (isRecord(body) && "templateKey" in body) {
    const value = body.templateKey;

    if (!isResumeTemplateKey(value)) {
      return errorResponse("INVALID_TEMPLATE", "\u7b80\u5386\u6a21\u677f\u4e0d\u5b58\u5728\u3002", 400);
    }

    templateKey = value;
  }

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: defaultResumeTitle,
      template_key: templateKey,
      content: createDefaultResumeContent(),
    })
    .select("id,user_id,title,template_key,content,created_at,updated_at")
    .single<ResumeRow>();

  if (error || !data) {
    return errorResponse("RESUME_CREATE_FAILED", "\u521b\u5efa\u7b80\u5386\u5931\u8d25\u3002", 500);
  }

  return successResponse(
    {
      id: data.id,
    },
    201,
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function parseOptionalJson(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

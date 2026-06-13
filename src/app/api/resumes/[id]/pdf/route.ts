import { generateResumePdf } from "@/lib/pdf";
import { mapResumeRowToResume } from "@/lib/resumeMappers";
import { createClient } from "@/lib/supabaseServer";
import type { ApiError } from "@/types/api";
import type { ResumeRow } from "@/types/database";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";

type ApiErrorCode = "UNAUTHORIZED" | "RESUME_NOT_FOUND" | "PDF_EXPORT_FAILED";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return errorResponse("UNAUTHORIZED", "\u8bf7\u5148\u767b\u5f55\u3002", 401);
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("id,user_id,title,template_key,content,created_at,updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<ResumeRow>();

  if (error || !data) {
    return errorResponse("RESUME_NOT_FOUND", "\u7b80\u5386\u4e0d\u5b58\u5728\u3002", 404);
  }

  try {
    const pdfBuffer = await generateResumePdf(mapResumeRowToResume(data));

    const body = new ArrayBuffer(pdfBuffer.byteLength);
    new Uint8Array(body).set(pdfBuffer);

    return new Response(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch {
    return errorResponse("PDF_EXPORT_FAILED", "\u5bfc\u51fa PDF \u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002", 500);
  }
}

export function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "\u90ae\u7bb1\u6216\u5bc6\u7801\u4e0d\u6b63\u786e\uff0c\u8bf7\u68c0\u67e5\u540e\u91cd\u8bd5\u3002";
  }

  if (normalized.includes("email not confirmed")) {
    return "\u90ae\u7bb1\u5c1a\u672a\u9a8c\u8bc1\uff0c\u8bf7\u5148\u6253\u5f00\u90ae\u4ef6\u5b8c\u6210\u786e\u8ba4\u3002";
  }

  if (normalized.includes("user already registered") || normalized.includes("already registered")) {
    return "\u8be5\u90ae\u7bb1\u5df2\u6ce8\u518c\uff0c\u8bf7\u76f4\u63a5\u767b\u5f55\u3002";
  }

  if (normalized.includes("password") && normalized.includes("at least")) {
    return "\u5bc6\u7801\u957f\u5ea6\u4e0d\u7b26\u5408\u8981\u6c42\uff0c\u8bf7\u81f3\u5c11\u8f93\u5165 6 \u4f4d\u3002";
  }

  if (normalized.includes("signup") && normalized.includes("disabled")) {
    return "\u5f53\u524d\u9879\u76ee\u672a\u5f00\u542f\u90ae\u7bb1\u6ce8\u518c\uff0c\u8bf7\u5728 Supabase \u540e\u53f0\u5f00\u542f\u6ce8\u518c\u3002";
  }

  if (normalized.includes("rate limit")) {
    return "\u8bf7\u6c42\u8fc7\u4e8e\u9891\u7e41\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5\u3002";
  }

  return message || "\u64cd\u4f5c\u5931\u8d25\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002";
}

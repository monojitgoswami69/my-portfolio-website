import "server-only";

export function getClientIp(request: Request) {
  // Vercel sets x-vercel-forwarded-for which is authoritative on their platform
  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {
    return vercelForwarded.split(",")[0]?.trim() || "unknown";
  }
  // Generic x-forwarded-for: first entry is the client (subsequent are intermediate proxies).
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface HealthCheck {
  name: string;
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs?: number;
  message?: string;
}

async function checkDatabase(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Replace with a real DB ping (e.g. `prisma.$queryRaw\`SELECT 1\``).
    await new Promise((resolve) => setTimeout(resolve, 5));
    return { name: "database", status: "healthy", latencyMs: Date.now() - start };
  } catch (err) {
    return {
      name: "database",
      status: "unhealthy",
      message: err instanceof Error ? err.message : "unknown error",
    };
  }
}

async function checkRedis(): Promise<HealthCheck> {
  const start = Date.now();
  try {
    // Replace with `redis.ping()`.
    await new Promise((resolve) => setTimeout(resolve, 2));
    return { name: "redis", status: "healthy", latencyMs: Date.now() - start };
  } catch (err) {
    return {
      name: "redis",
      status: "unhealthy",
      message: err instanceof Error ? err.message : "unknown error",
    };
  }
}

export async function GET() {
  const startedAt = Date.now();
  const checks = await Promise.all([checkDatabase(), checkRedis()]);
  const overall: HealthCheck["status"] = checks.some((c) => c.status === "unhealthy")
    ? "unhealthy"
    : checks.some((c) => c.status === "degraded")
      ? "degraded"
      : "healthy";

  const body = {
    status: overall,
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION ?? "0.0.0",
    uptime: process.uptime(),
    latencyMs: Date.now() - startedAt,
    checks,
  };

  const status = overall === "healthy" ? 200 : overall === "degraded" ? 200 : 503;
  return NextResponse.json(body, { status });
}

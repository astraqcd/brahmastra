import { NextResponse } from "next/server";

const TIMEOUT_MS = 8000;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const toolUrl = searchParams.get("url");

  if (!toolUrl) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400 },
    );
  }

  try {
    const url = new URL(toolUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      return NextResponse.json({ error: "Invalid protocol" }, { status: 400 });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const startTime = Date.now();

    const res = await fetch(toolUrl, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "User-Agent": "Brahmastra-OSINT-HealthCheck/1.0",
      },
    });

    clearTimeout(timeout);

    const responseTime = Date.now() - startTime;
    const isUp = res.status < 500;

    return NextResponse.json({
      url: toolUrl,
      status: res.status,
      isUp,
      responseTime,
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({
      url: toolUrl,
      status: 0,
      isUp: false,
      responseTime: TIMEOUT_MS,
      checkedAt: new Date().toISOString(),
      error: "unreachable",
    });
  }
}

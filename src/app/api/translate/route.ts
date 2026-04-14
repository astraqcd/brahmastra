import { NextRequest, NextResponse } from "next/server";

const GOOGLE_TRANSLATE_URL =
  "https://translate.googleapis.com/translate_a/single";

async function translateOne(
  text: string,
  targetLang: string
): Promise<string> {
  if (!text.trim()) return text;

  const params = new URLSearchParams({
    client: "gtx",
    sl: "en",
    tl: targetLang,
    dt: "t",
    q: text,
  });

  const res = await fetch(`${GOOGLE_TRANSLATE_URL}?${params.toString()}`, {
    method: "GET",
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!res.ok) return text;

  const data = await res.json();
  // data[0] is an array of [translatedChunk, originalChunk, ...]
  const translated = (data[0] as Array<[string, string]>)
    .map((chunk) => chunk[0])
    .join("");

  return translated || text;
}

export async function POST(req: NextRequest) {
  try {
    const { texts, targetLang } = await req.json();

    if (
      !texts ||
      !Array.isArray(texts) ||
      texts.length === 0 ||
      !targetLang ||
      targetLang === "en"
    ) {
      return NextResponse.json({ translations: texts ?? [] });
    }

    // Translate each string individually in parallel
    const translations = await Promise.all(
      texts.map((text: string) =>
        translateOne(text, targetLang).catch(() => text)
      )
    );

    return NextResponse.json({ translations });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Translation failed" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/inquiry";
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  const expected = new URL(process.env.SITE_URL || "http://localhost:3000")
    .origin;
  if (origin !== expected)
    return NextResponse.json(
      { error: "Request origin is not allowed." },
      { status: 403 },
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return NextResponse.json({ error: "Expected JSON." }, { status: 415 });
  // Enforce the size while streaming, even when Content-Length is missing.
  let raw = "";
  const reader = request.body?.getReader();
  if (!reader)
    return NextResponse.json(
      { error: "Missing request body." },
      { status: 400 },
    );
  const decoder = new TextDecoder();
  let bytes = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 24000) {
        await reader.cancel();
        return NextResponse.json(
          { error: "Message is too large." },
          { status: 413 },
        );
      }
      raw += decoder.decode(value, { stream: true });
    }
    raw += decoder.decode();
  } catch {
    return NextResponse.json(
      { error: "Unable to read request." },
      { status: 400 },
    );
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const result = inquirySchema.safeParse(json);
  if (!result.success)
    return NextResponse.json(
      { error: result.error.issues[0].message },
      { status: 400 },
    );
  const token = process.env.STRAPI_INQUIRY_TOKEN;
  if (!token)
    return NextResponse.json(
      {
        error:
          "The contact service is temporarily unavailable. Please try again later.",
      },
      { status: 503 },
    );
  const { website, ...fields } = result.data;
  void website;
  try {
    const response = await fetch(
      `${(process.env.STRAPI_URL || "http://localhost:1337").replace(/\/$/, "")}/api/inquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: { ...fields, submissionDate: new Date().toISOString() },
        }),
        signal: AbortSignal.timeout(10000),
        cache: "no-store",
      },
    );
    if (!response.ok) {
      console.error(`Inquiry storage failed: ${response.status}`);
      throw new Error("CMS rejected submission");
    }
    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "We could not save your inquiry. Please try again shortly." },
      { status: 502 },
    );
  }
}

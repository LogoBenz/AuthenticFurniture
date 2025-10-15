import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const bucket = searchParams.get("bucket") || "product-images";

  if (!path) {
    return NextResponse.json({ error: "Missing path parameter" }, { status: 400 });
  }

  // Generate a signed URL (valid for 10 minutes)
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 60 * 10);

  if (error || !data?.signedUrl) {
    console.error("Failed to generate signed URL:", error);
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }

  // Fetch the image from Supabase storage
  const imageRes = await fetch(data.signedUrl);

  if (!imageRes.ok) {
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 502 });
  }

  // Read and return the image as a buffer
  const buffer = await imageRes.arrayBuffer();
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": imageRes.headers.get("content-type") || "image/*",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=600",
    },
  });
}

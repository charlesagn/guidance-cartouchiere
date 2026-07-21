import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { cartridges, versions } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, source, source_url, source_title, versions: versionData } = body;

    if (!title || !source) {
      return Response.json({ error: "title et source requis" }, { status: 400 });
    }

    const [cartridge] = await db.insert(cartridges).values({
      title,
      source,
      source_url,
      source_title,
      status: "draft",
    }).returning();

    if (versionData && versionData.length > 0) {
      await db.insert(versions).values(
        versionData.map((v: any) => ({
          cartridge_id: cartridge.id,
          plateforme: v.plateforme,
          format: v.format || "post",
          ton: v.ton || "pro",
          content_text: v.content_text,
          image_url: v.image_url,
          image_prompt: v.image_prompt,
          hashtags: v.hashtags,
          status: "draft",
        }))
      );
    }

    return Response.json({ cartridge }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const source = searchParams.get("source");
  const limit = Math.min(Number(searchParams.get("limit") || "50"), 100);

  try {
    let query = db.select().from(cartridges).orderBy(cartridges.created_at).limit(limit);

    if (status) {
      query = query.where(sql`status = ${status}`) as any;
    }
    if (source) {
      query = query.where(sql`source = ${source}`) as any;
    }

    const result = await query;
        return Response.json({ cartridges: result });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
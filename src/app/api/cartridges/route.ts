import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { cartridges, versions } from "@/lib/db/schema";
import { neon } from "@neondatabase/serverless";

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
    const sql = neon(process.env.DATABASE_URL!);
    let query = `SELECT * FROM cartridges WHERE 1=1`;
    const params: any[] = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    if (source) {
      params.push(source);
      query += ` AND source = $${params.length}`;
    }
    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await sql.query(query, params);
    return Response.json({ cartridges: result.rows });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
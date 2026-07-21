import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { planning, versions, cartridges } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || "45"), 100);
    const plateforme = searchParams.get("plateforme");

    let query = db
      .select({
        id: planning.id,
        date: planning.date,
        plateforme: planning.plateforme,
        status: planning.status,
        version_id: planning.version_id,
        version_content: versions.content_text,
        version_status: versions.status,
        cartridge_title: cartridges.title,
        cartridge_source: cartridges.source,
      })
      .from(planning)
      .leftJoin(versions, eq(planning.version_id, versions.id))
      .leftJoin(cartridges, eq(versions.cartridge_id, cartridges.id))
      .orderBy(planning.date)
      .limit(limit);

    if (plateforme) {
      query = query.where(eq(planning.plateforme, plateforme as any));
    }

    const result = await query;
    return Response.json({ planning: result });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { version_id, date, time_slot, plateforme } = body;

    if (!version_id || !date || !plateforme) {
      return Response.json({ error: "version_id, date et plateforme requis" }, { status: 400 });
    }

    const [entry] = await db.insert(planning).values({
      version_id,
      date,
      time_slot: time_slot || null,
      plateforme,
      status: "planned",
    }).returning();

    return Response.json({ planning: entry }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
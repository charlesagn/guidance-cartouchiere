import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { versions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content_text, status, image_url, hashtags } = body;

    const updateFields: Record<string, any> = {};
    if (content_text !== undefined) updateFields.content_text = content_text;
    if (status !== undefined) updateFields.status = status;
    if (image_url !== undefined) updateFields.image_url = image_url;
    if (hashtags !== undefined) updateFields.hashtags = hashtags;

    if (Object.keys(updateFields).length === 0) {
      return Response.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }

    const [updated] = await db
      .update(versions)
      .set(updateFields)
      .where(eq(versions.id, id))
      .returning();

    if (!updated) {
      return Response.json({ error: "Version introuvable" }, { status: 404 });
    }

    return Response.json({ version: updated });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [version] = await db
      .select()
      .from(versions)
      .where(eq(versions.id, id))
      .limit(1);

    if (!version) {
      return Response.json({ error: "Version introuvable" }, { status: 404 });
    }

    return Response.json({ version });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { cartridges, versions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const [cartridge] = await db
      .select()
      .from(cartridges)
      .where(eq(cartridges.id, id))
      .limit(1);

    if (!cartridge) {
      return Response.json({ error: "Cartouche introuvable" }, { status: 404 });
    }

    const vers = await db
      .select()
      .from(versions)
      .where(eq(versions.cartridge_id, id))
      .orderBy(versions.plateforme);

    return Response.json({ cartridge, versions: vers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
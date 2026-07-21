import { NextRequest } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(Number(searchParams.get("limit") || "45"), 100);
    const plateforme = searchParams.get("plateforme");

    const sql = neon(process.env.DATABASE_URL!);

    let query = `
      SELECT p.id, p.date, p.plateforme, p.status, p.version_id,
             v.content_text as version_content, v.status as version_status,
             c.title as cartridge_title, c.source as cartridge_source
      FROM planning p
      LEFT JOIN versions v ON v.id = p.version_id
      LEFT JOIN cartridges c ON c.id = v.cartridge_id
    `;

    const params: any[] = [];

    if (plateforme) {
      params.push(plateforme);
      query += ` WHERE p.plateforme = $${params.length}`;
    }

    query += ` ORDER BY p.date ASC LIMIT $${params.length + 1}`;
    params.push(limit);

    const result = await sql.query(query, params);
    return Response.json({ planning: result.rows });
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

    const sql = neon(process.env.DATABASE_URL!);
    const result = await sql.query(
      `INSERT INTO planning (version_id, date, time_slot, plateforme, status) VALUES ($1, $2, $3, $4, 'planned') RETURNING *`,
      [version_id, date, time_slot || null, plateforme]
    );

    return Response.json({ planning: result.rows[0] }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
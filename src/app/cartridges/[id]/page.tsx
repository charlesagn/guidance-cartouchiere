import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusButtons from "@/components/status-buttons";
import { db } from "@/lib/db";
import { cartridges, versions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CartridgeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [cartridge] = await db
    .select()
    .from(cartridges)
    .where(eq(cartridges.id, id))
    .limit(1);

  if (!cartridge) notFound();

  const cartridgeVersions = await db
    .select()
    .from(versions)
    .where(eq(versions.cartridge_id, id))
    .orderBy(versions.plateforme);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/cartridges">
              <Button variant="ghost" size="sm">← Retour</Button>
            </Link>
            <div>
              <h1 className="font-bold text-lg text-[#1A2744]">{cartridge.title}</h1>
              <p className="text-xs text-slate-500 capitalize">{cartridge.source}</p>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <Badge>{cartridge.status}</Badge>
            <Link href="/"><Button variant="ghost" size="sm">Dashboard</Button></Link>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-4 py-6 w-full space-y-4">
        {cartridgeVersions.map(v => {
          const meta = PLATFORMS.find(p => p.id === v.plateforme) || { icon: "📱", label: v.plateforme, bg: "bg-slate-50" };
          return (
            <div key={v.id} className="bg-white rounded-xl border shadow-sm">
              <div className={`px-4 py-2.5 flex items-center justify-between border-b ${meta.bg}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{meta.icon}</span>
                  <span className="font-semibold text-sm">{meta.label}</span>
                  <Badge variant="outline" className="text-xs">{v.format} · {v.ton}</Badge>
                  <Badge variant="outline" className="text-xs">{v.status}</Badge>
                </div>
                <span className="text-xs text-slate-400">
                  {v.content_text ? `${v.content_text.length} chars` : "⚠️ Sans contenu"}
                </span>
              </div>

              <div className="p-4">
                {v.content_text ? (
                  <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed">
                    {v.content_text}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400 text-sm italic">
                    En attente de génération par Hermes…
                  </div>
                )}

                <div className="mt-4 pt-3 border-t">
                  <StatusButtons versionId={v.id} currentStatus={v.status} />
                </div>
              </div>
            </div>
          );
        })}

        {cartridgeVersions.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="text-lg">Aucune version pour cette cartouche</p>
          </div>
        )}
      </main>
    </div>
  );
}

const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: "💼", bg: "bg-blue-50" },
  { id: "instagram", label: "Instagram", icon: "📸", bg: "bg-pink-50" },
  { id: "x", label: "X / Twitter", icon: "🐦", bg: "bg-slate-50" },
  { id: "facebook", label: "Facebook", icon: "📘", bg: "bg-indigo-50" },
  { id: "tiktok", label: "TikTok", icon: "🎵", bg: "bg-gray-50" },
  { id: "youtube", label: "YouTube", icon: "🎬", bg: "bg-red-50" },
];

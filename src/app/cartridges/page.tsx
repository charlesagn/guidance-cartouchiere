import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { cartridges, versions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function CartridgesPage() {
  const all = await db.select().from(cartridges).orderBy(cartridges.created_at);
  
  const bySource: Record<string, number> = {};
  all.forEach(c => { bySource[c.source] = (bySource[c.source] || 0) + 1; });

  const byStatus: Record<string, number> = {};
  all.forEach(c => { byStatus[c.status] = (byStatus[c.status] || 0) + 1; });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h1 className="font-bold text-xl text-[#1A2744]">Cartouchière</h1>
            <span className="text-sm text-slate-500 hidden sm:inline">Guidance</span>
          </div>
          <nav className="flex gap-1">
            <Link href="/"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link href="/cartridges"><Button variant="ghost" size="sm">Cartouches</Button></Link>
            <Link href="/planning"><Button variant="ghost" size="sm">Planning 45j</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">📦 Toutes les cartouches ({all.length})</h2>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {Object.entries(bySource).map(([source, count]) => (
            <div key={source} className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-slate-500 capitalize">{source}</div>
            </div>
          ))}
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="bg-white rounded-xl p-4 border shadow-sm">
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-slate-500">{status}</div>
            </div>
          ))}
        </div>

        {/* Liste des cartouches */}
        <div className="bg-white rounded-xl border shadow-sm">
          <table className="w-full">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">TITRE</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 hidden md:table-cell">SOURCE</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500 hidden md:table-cell">STATUT</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">VERSIONS</th>
              </tr>
            </thead>
            <tbody>
              {all.map(async c => {
                const cVers = await db.select().from(versions).where(eq(versions.cartridge_id, c.id));
                const hasContent = cVers.some(v => v.content_text && v.content_text.length > 10);
                return (
                  <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <Link href={`/cartridges/${c.id}`} className="font-medium text-sm hover:underline">
                          {c.title}
                        </Link>
                        <div className="text-xs text-slate-400 mt-1">
                          {c.source_title && c.source_title.substring(0, 60)}
                          {c.source_title && c.source_title.length > 60 && "…"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge variant="outline" className="capitalize">{c.source}</Badge>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Badge>{c.status}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {cVers.length} versions
                        {hasContent && <span className="ml-2 text-green-500 text-xs">✓</span>}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

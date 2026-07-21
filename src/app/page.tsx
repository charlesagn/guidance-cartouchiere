import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { cartridges, versions } from "@/lib/db/schema";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const allCartridges = await db.select().from(cartridges).orderBy(cartridges.created_at).limit(100);
  
  const draft = allCartridges.filter(c => c.status === "draft").length;
  const approved = allCartridges.filter(c => c.status === "approved").length;
  const published = allCartridges.filter(c => c.status === "published").length;

  const allVersions = await db.select().from(versions);
  const byPlatform: Record<string, number> = {};
  allVersions.forEach(v => {
    byPlatform[v.plateforme] = (byPlatform[v.plateforme] || 0) + 1;
  });

  const sources: Record<string, number> = {};
  allCartridges.forEach(c => {
    sources[c.source] = (sources[c.source] || 0) + 1;
  });

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
        {/* KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          <KPI label="Total" value={allCartridges.length} color="text-[#1A2744]" />
          <KPI label="Draft" value={draft} color="text-amber-600" />
          <KPI label="Approuvées" value={approved} color="text-green-600" />
          <KPI label="Publiées" value={published} color="text-blue-600" />
          {Object.entries(byPlatform).map(([p, count]) => (
            <KPI key={p} label={p} value={count} color="text-[#1A2744]" />
          ))}
        </div>

        {/* Sources + Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">📥 Sources de contenu</h2>
            <div className="space-y-3">
              {Object.entries(sources).map(([source, count]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="capitalize">{source}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-semibold text-lg mb-4">⚡ Actions rapides</h2>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction href="/cartridges/new" icon="➕" label="Nouvelle cartouche" />
              <QuickAction href="/cartridges" icon="📦" label="Voir toutes" />
              <QuickAction href="/planning" icon="📅" label="Planning 45j" />
              <QuickAction href="https://guidance-cartouchiere.vercel.app/api/cartridges" icon="🤖" label="API" external />
            </div>
          </div>
        </div>

        {/* Cartouches récentes */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 flex items-center justify-between">
            <h2 className="font-semibold text-lg">📦 Cartouches récentes</h2>
            <Link href="/cartridges"><Button variant="ghost" size="sm">Voir tout →</Button></Link>
          </div>
          <div className="px-6 pb-6 space-y-2">
            {allCartridges.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center justify-between py-2 border-t">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{c.title}</span>
                  <Badge variant="outline" className="capitalize">{c.source}</Badge>
                </div>
                <Badge>{c.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border shadow-sm">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

function QuickAction({ href, icon, label, external }: { href: string; icon: string; label: string; external?: boolean }) {
  const props = external
    ? { href, target: "_blank" } as const
    : { href } as const;
  return (
    <Link {...props}>
      <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-slate-100 transition">
        <span className="text-2xl">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
    </Link>
  );
}
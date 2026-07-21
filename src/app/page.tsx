import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h1 className="font-bold text-xl text-[#1A2744]">Cartouchière</h1>
            <span className="text-sm text-gray-500">Guidance</span>
          </div>
          <nav className="flex gap-2">
            <Button variant="ghost" asChild>
              <Link href="/">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/cartridges">Cartouches</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/planning">Planning 45j</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="grid gap-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: "Cartouches", value: 0, color: "text-blue-600" },
              { label: "En draft", value: 0, color: "text-gray-600" },
              { label: "Approuvées", value: 0, color: "text-green-600" },
              { label: "Publiées", value: 0, color: "text-blue-600" },
              { label: "À venir (7j)", value: 0, color: "text-orange-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 border shadow-sm">
                <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Prochaines publications */}
          <div className="bg-white rounded-xl p-6 border shadow-sm">
            <h2 className="font-semibold text-lg mb-4">📅 Planning 7 prochains jours</h2>
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-3">📭</div>
              <p>Aucune publication planifiée</p>
              <p className="text-sm mt-1">Connecte une base Neon pour commencer</p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Nouvelle cartouche", icon: "➕", href: "/cartridges/new", desc: "Créer à partir d'une source" },
              { title: "Planning 45j", icon: "📅", href: "/planning", desc: "Vue d'ensemble" },
              { title: "Cartouches", icon: "📦", href: "/cartridges", desc: "Toutes les cartouches" },
              { title: "Webhook Hermes", icon: "🤖", href: "/api/webhook/hermes", desc: "Documentation API" },
            ].map((action) => (
              <Link key={action.title} href={action.href}>
                <div className="bg-white rounded-xl p-4 border shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-gray-400 mt-1">{action.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
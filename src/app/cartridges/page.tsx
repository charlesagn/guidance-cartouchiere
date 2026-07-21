import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CartridgesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h1 className="font-bold text-xl text-[#1A2744]">Cartouchière</h1>
            <span className="text-sm text-gray-500">Guidance</span>
          </div>
          <nav className="flex gap-2">
            <Link href="/"><Button variant="ghost">Dashboard</Button></Link>
            <Link href="/cartridges"><Button variant="ghost">Cartouches</Button></Link>
            <Link href="/planning"><Button variant="ghost">Planning 45j</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">📦 Toutes les cartouches</h2>
          <Link href="/cartridges/new"><Button>+ Nouvelle</Button></Link>
        </div>

        <div className="bg-white rounded-xl border shadow-sm">
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-lg">Aucune cartouche pour l'instant</p>
            <p className="text-sm mt-1">Connecte Hermes pour générer les 45 premières</p>
          </div>
        </div>
      </main>
    </div>
  );
}
"use client";

import { Button } from "@/components/ui/button";

const API_BASE = "https://guidance-cartouchiere.vercel.app/api/versions";

export default function StatusButtons({ versionId, currentStatus }: { versionId: string; currentStatus: string }) {
  async function handleStatus(newStatus: string) {
    const res = await fetch(`${API_BASE}/${versionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      window.location.reload();
    } else {
      console.error("Patch failed:", res.status, res.statusText);
      alert("Erreur lors de la mise à jour du statut.");
    }
  }

  const isDisabled = (status: string) => currentStatus === status;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleStatus("review")}
        disabled={isDisabled("review")}
      >
        🔄 Review
      </Button>
      <Button
        size="sm"
        onClick={() => handleStatus("approved")}
        disabled={isDisabled("approved")}
      >
        ✅ Approuver
      </Button>
      <Button
        size="sm"
        variant="secondary"
        onClick={() => handleStatus("published")}
        disabled={isDisabled("published")}
      >
        📤 Publier
      </Button>
    </div>
  );
}

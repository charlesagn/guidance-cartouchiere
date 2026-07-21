"use client";

import { Button } from "@/components/ui/button";

const API = "https://guidance-cartouchiere.vercel.app/api/versions";

export default function StatusButtons({ versionId, currentStatus }: { versionId: string; currentStatus: string }) {
  async function handleStatus(newStatus: string) {
    const res = await fetch(`${API}/${versionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      window.location.reload();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => handleStatus("review")} disabled={currentStatus === "review"}>
        🔄 Review
      </Button>
      <Button size="sm" variant="default" onClick={() => handleStatus("approved")} disabled={currentStatus === "approved"}>
        ✅ Approuver
      </Button>
      <Button size="sm" variant="secondary" onClick={() => handleStatus("published")} disabled={currentStatus === "published"}>
        📤 Publier
      </Button>
    </div>
  );
}

export const PLATEFORMES = [
  { id: "linkedin", label: "LinkedIn", color: "blue", icon: "💼" },
  { id: "instagram", label: "Instagram", color: "pink", icon: "📸" },
  { id: "x", label: "X / Twitter", color: "gray", icon: "🐦" },
  { id: "facebook", label: "Facebook", color: "blue", icon: "👍" },
  { id: "tiktok", label: "TikTok", color: "black", icon: "🎵" },
  { id: "youtube", label: "YouTube", color: "red", icon: "🎬" },
] as const;

export const TONS = {
  pro: "Professionnel",
  punchy: "Punchy",
  fun: "Fun",
  communautaire: "Communautaire",
  pedagogique: "Pédagogique",
} as const;

export const SOURCES = {
  blog: "Blog Guidance",
  cas_client: "Cas client",
  veille: "Veille",
  interview: "Interview",
  actu: "Actualité",
  manuel: "Manuel",
} as const;

export const STATUS_BADGES = {
  draft: { label: "Draft", class: "bg-gray-100 text-gray-800" },
  review: { label: "Review", class: "bg-yellow-100 text-yellow-800" },
  approved: { label: "Approuvé", class: "bg-green-100 text-green-800" },
  published: { label: "Publié", class: "bg-blue-100 text-blue-800" },
  archived: { label: "Archivé", class: "bg-gray-100 text-gray-500" },
} as const;
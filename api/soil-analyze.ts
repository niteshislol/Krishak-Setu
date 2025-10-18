// Vercel Serverless Function: AI Soil Analysis (mock)
import type { VercelRequest, VercelResponse } from "@vercel/node";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function seeded(name: string, size: number) {
  let h = 2166136261;
  const input = `${name}|${size}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (mod: number, offset = 0) => (Math.abs(h + offset) % mod) / mod;
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method Not Allowed" });
  try {
    const meta = (req.body?.meta || {}) as { name?: string; size?: number; type?: string };
    const rnd = seeded(meta.name || "soil", meta.size || 1);
    const pH = clamp(4.5 + rnd(100) * 5, 4.5, 9.5);
    const nitrogen = Math.round(50 + rnd(100, 13) * 250);
    const phosphorus = Math.round(20 + rnd(100, 29) * 120);
    const potassium = Math.round(40 + rnd(100, 37) * 300);
    const organicMatter = parseFloat((1.2 + rnd(100, 53) * 4.3).toFixed(2));
    const metrics = { pH: parseFloat(pH.toFixed(2)), nitrogen, phosphorus, potassium, organicMatter };

    const crops: string[] = [];
    const pesticides: string[] = [];
    const warnings: string[] = [];
    if (metrics.pH < 6) {
      crops.push("Rice", "Potato", "Tea");
      warnings.push("Soil is acidic. Consider liming.");
    } else if (metrics.pH > 8) {
      crops.push("Barley", "Millet", "Cotton");
      warnings.push("Alkaline soil. Use gypsum if sodium issues suspected.");
    } else {
      crops.push("Wheat", "Maize", "Tomato", "Soybean");
    }
    if (metrics.nitrogen < 100) pesticides.push("Neem oil (for N-stressed pest management)");
    if (metrics.phosphorus < 40) pesticides.push("Chlorantraniliprole (if pest incidence observed)");

    const nNeed = clamp(150 - metrics.nitrogen, 0, 150);
    const pNeed = clamp(60 - metrics.phosphorus, 0, 60);
    const kNeed = clamp(120 - metrics.potassium, 0, 120);
    const ureaKg = Math.round(nNeed * 2.17);
    const dapKg = Math.round(pNeed * 2.2);
    const mopKg = Math.round(kNeed * 1.67);
    const blend: string[] = [];
    if (ureaKg > 0) blend.push(`${ureaKg} kg/acre Urea`);
    if (dapKg > 0) blend.push(`${dapKg} kg/acre DAP`);
    if (mopKg > 0) blend.push(`${mopKg} kg/acre MOP`);

    const recommendations = {
      crops,
      fertilizerBlend: blend.length ? `Apply ${blend.join(" + ")}` : "NPK levels adequate. Maintain with compost and split doses.",
      pesticides: pesticides.length ? pesticides : ["Use IPM as needed; avoid prophylactic sprays"],
    };

    return res.status(200).json({ metrics, recommendations, warnings });
  } catch (e) {
    return res.status(500).json({ error: "Analysis failed" });
  }
}

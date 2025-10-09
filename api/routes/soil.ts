import { RequestHandler } from "express";
import type {
  SoilAnalysisResponse,
  SoilMetrics,
  SoilRecommendations,
  SoilAnalyzeRequestMeta,
} from "@shared/api";

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

function generateMetrics(meta: SoilAnalyzeRequestMeta): SoilMetrics {
  const rnd = seeded(meta.name || "soil", meta.size || 1);
  const pH = clamp(4.5 + rnd(100) * 5, 4.5, 9.5);
  const nitrogen = Math.round(50 + rnd(100, 13) * 250);
  const phosphorus = Math.round(20 + rnd(100, 29) * 120);
  const potassium = Math.round(40 + rnd(100, 37) * 300);
  const organicMatter = parseFloat((1.2 + rnd(100, 53) * 4.3).toFixed(2));
  return { pH: parseFloat(pH.toFixed(2)), nitrogen, phosphorus, potassium, organicMatter };
}

function recommend(metrics: SoilMetrics): SoilRecommendations {
  const crops: string[] = [];
  const pesticides: string[] = [];
  const warnings: string[] = [];

  // pH based
  if (metrics.pH < 6) {
    crops.push("Rice", "Potato", "Tea");
    warnings.push("Soil is acidic. Consider liming.");
  } else if (metrics.pH > 8) {
    crops.push("Barley", "Millet", "Cotton");
    warnings.push("Alkaline soil. Use gypsum if sodium issues suspected.");
  } else {
    crops.push("Wheat", "Maize", "Tomato", "Soybean");
  }

  // Macro nutrients
  if (metrics.nitrogen < 100) {
    pesticides.push("Neem oil (for N-stressed pest management)");
  }
  if (metrics.phosphorus < 40) {
    pesticides.push("Chlorantraniliprole (if pest incidence observed)");
  }

  // Fertilizer blend suggestion
  const nNeed = clamp(150 - metrics.nitrogen, 0, 150);
  const pNeed = clamp(60 - metrics.phosphorus, 0, 60);
  const kNeed = clamp(120 - metrics.potassium, 0, 120);

  const ureaKg = Math.round(nNeed * 2.17); // 46% N
  const dapKg = Math.round(pNeed * 2.2); // ~46% P2O5 equiv assumption
  const mopKg = Math.round(kNeed * 1.67); // ~60% K2O equiv assumption

  const blendParts: string[] = [];
  if (ureaKg > 0) blendParts.push(`${ureaKg} kg/acre Urea`);
  if (dapKg > 0) blendParts.push(`${dapKg} kg/acre DAP`);
  if (mopKg > 0) blendParts.push(`${mopKg} kg/acre MOP`);

  const fertilizerBlend = blendParts.length
    ? `Apply ${blendParts.join(" + ")}`
    : "NPK levels adequate. Maintain with compost and split doses.";

  return {
    crops,
    fertilizerBlend,
    pesticides: pesticides.length ? pesticides : ["Use IPM as needed; avoid prophylactic sprays"],
  };
}

export const handleSoilAnalyze: RequestHandler = (req, res) => {
  const meta = (req.body?.meta || {}) as SoilAnalyzeRequestMeta;
  const metrics = generateMetrics(meta);
  const rec = recommend(metrics);
  const warnings: string[] = [];
  if (metrics.organicMatter < 2) warnings.push("Low organic matter. Add compost/green manure.");

  const response: SoilAnalysisResponse = {
    metrics,
    recommendations: rec,
    warnings,
  };

  res.status(200).json(response);
};

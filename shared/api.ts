/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

// Soil analysis types shared between client and server
export interface SoilMetrics {
  pH: number; // 0-14
  nitrogen: number; // N in kg/ha
  phosphorus: number; // P in kg/ha
  potassium: number; // K in kg/ha
  organicMatter: number; // percentage
}

export interface SoilRecommendations {
  crops: string[];
  fertilizerBlend: string;
  pesticides: string[];
  notes?: string;
}

export interface SoilAnalysisResponse {
  metrics: SoilMetrics;
  recommendations: SoilRecommendations;
  warnings: string[];
}

export interface SoilAnalyzeRequestMeta {
  name: string;
  size: number;
  type: string;
}

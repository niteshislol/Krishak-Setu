import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import SoilMetricsCard from "@/components/app/SoilMetricsCard";
import RecommendationCards from "@/components/app/RecommendationCards";
import type { SoilAnalysisResponse } from "@shared/api";

export default function SoilUpload() {
  const { t } = useTranslation();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SoilAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onDrop = useCallback(async (f: File) => {
    setFile(f);
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const endpoint =
        typeof window !== "undefined" &&
        window.location.hostname.includes("projects.builder.codes")
          ? "/api/soil/analyze" // local/dev proxy
          : "/api/soil-analyze"; // Vercel function
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta: { name: f.name, size: f.size, type: f.type },
        }),
      });
      const data = (await res.json()) as SoilAnalysisResponse;
      setResult(data);
    } catch (e) {
      setError("Failed to analyze report");
    } finally {
      setLoading(false);
    }
  }, []);

  const onInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onDrop(f);
  };

  const accept = useMemo(
    () => ["application/pdf", "image/jpeg", "image/png"],
    [],
  );

  useEffect(() => {
    (window as any).openUploader = () => {
      inputRef.current?.click();
    };
    return () => {
      if ((window as any).openUploader) delete (window as any).openUploader;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Analyze Your Soil</h2>
        <p className="text-muted-foreground text-lg">Upload your soil test report and get personalized recommendations</p>
      </div>
      <Card className="border-2 hover:border-emerald-500/50 transition-colors group overflow-hidden">
        <CardContent className="p-0">
          <label
            htmlFor="uploader"
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              const f = e.dataTransfer.files?.[0];
              if (f && accept.includes(f.type)) onDrop(f);
            }}
            className={`block cursor-pointer rounded-lg p-8 sm:p-12 text-center transition-all ${dragActive ? "ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500" : "bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/10"}`}
            aria-label={t("upload.title")}
          >
            <div className="mx-auto max-w-xl space-y-4 min-h-[220px] flex flex-col items-center justify-center">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 opacity-90 group-hover:opacity-100 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-bold">{t("upload.title")}</div>
                <p className="text-base text-muted-foreground">
                  {t("upload.subtitle")}
                </p>
                <p className="text-xs text-muted-foreground font-medium">
                  {t("upload.supported")}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-4">
                <input
                  ref={inputRef}
                  id="uploader"
                  type="file"
                  className="sr-only"
                  accept={accept.join(",")}
                  capture="environment"
                  onChange={onInput}
                />
                <Button
                  type="button"
                  size="lg"
                  className="h-11 px-8 font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  onClick={() => inputRef.current?.click()}
                >
                  {t("cta.upload")}
                </Button>
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      {loading && (
        <div
          className="rounded-lg border p-6 flex items-center gap-3"
          role="status"
          aria-live="polite"
        >
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent"
            aria-hidden
          />
          <p className="font-medium">{t("cta.analyzing")}</p>
        </div>
      )}

      {error && (
        <div
          className="rounded-md border border-destructive text-destructive-foreground p-4"
          role="alert"
        >
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-6">
          <SoilMetricsCard metrics={result.metrics} />
          <RecommendationCards data={result.recommendations} />
          {result.warnings.length > 0 && (
            <div className="rounded-md border p-4 bg-amber-50 dark:bg-amber-950">
              <ul className="list-disc pl-4">
                {result.warnings.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {/* Mobile sticky CTA spacer */}
      <div className="sm:hidden h-16" />
      <div className="fixed inset-x-4 bottom-4 z-50 sm:hidden">
        <Button
          className="w-full h-12 text-base shadow-lg"
          onClick={() => inputRef.current?.click()}
        >
          {t("cta.upload")}
        </Button>
      </div>
    </div>
  );
}

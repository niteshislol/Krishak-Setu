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
      const res = await fetch("/api/soil/analyze", {
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
      <Card>
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
            className={`group block cursor-pointer rounded-lg border p-8 text-center transition hover:border-foreground/30 ${dragActive ? "ring-2 ring-emerald-500 border-emerald-500" : ""}`}
            aria-label={t("upload.title")}
          >
            <div className="mx-auto max-w-xl space-y-3">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 opacity-90 group-hover:opacity-100" />
              <div className="text-xl font-semibold">{t("upload.title")}</div>
              <p className="text-sm text-muted-foreground">
                {t("upload.subtitle")}
              </p>
              <p className="text-xs text-muted-foreground">
                {t("upload.supported")}
              </p>
              <div className="flex items-center justify-center gap-3 pt-2">
                <input
                  ref={inputRef}
                  id="uploader"
                  type="file"
                  className="sr-only"
                  accept={accept.join(",")}
                  onChange={onInput}
                />
                <Button type="button" onClick={() => inputRef.current?.click()}>
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
    </div>
  );
}

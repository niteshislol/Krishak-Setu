import { useEffect, useState } from "react";
import HeroSoilGraphic from "@/components/app/HeroSoilGraphic";

const LS_KEY = "heroImages";

export default function HeroVisual() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      try {
        // 1) Check if a server image already exists
        const res = await fetch("/api/hero-image/url");
        const data = (await res.json()) as { url: string | null };
        if (cancelled) return;
        if (data.url) {
          setUrl(`${data.url}?t=${Date.now()}`);
          return;
        }
        // 2) If user uploaded previously (local), persist it to server once
        const saved = localStorage.getItem(LS_KEY);
        if (saved) {
          const images: string[] = JSON.parse(saved);
          if (images.length > 0) {
            const upload = await fetch("/api/hero-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ dataUrl: images[0] }),
            });
            const up = (await upload.json()) as { url?: string };
            if (up.url) {
              setUrl(`${up.url}?t=${Date.now()}`);
              localStorage.removeItem(LS_KEY);
            }
          }
        }
      } catch {
        // ignore and keep fallback graphic
      }
    };
    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative rounded-xl border p-3 bg-gradient-to-br from-background to-background/60">
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        {url ? (
          <img
            src={url}
            alt="Hero agriculture visual"
            className="h-full w-full object-cover"
          />
        ) : (
          <HeroSoilGraphic />
        )}
      </div>
    </div>
  );
}

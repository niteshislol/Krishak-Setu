import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import SoilUpload from "@/components/app/SoilUpload";
import { Button } from "@/components/ui/button";
import HeroVisual from "@/components/app/HeroVisual";
import HowItWorks from "@/components/app/HowItWorks";

export default function Index() {
  const { t } = useTranslation();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="container py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              <span className="bg-gradient-to-br from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {t("brand.name")}
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-prose">
              {t("brand.tagline")}
            </p>
            <div className="flex gap-3">
              <Button
                size="lg"
                onClick={() => {
                  const sec = document.getElementById("analyze");
                  sec?.scrollIntoView({ behavior: "smooth", block: "start" });
                  const op = (window as any).openUploader as
                    | (() => void)
                    | undefined;
                  if (op) requestAnimationFrame(() => op());
                }}
              >
                {t("cta.upload")}
              </Button>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <HowItWorks />

      <section id="analyze" className="container py-12 md:py-16 space-y-8">
        <SoilUpload />
      </section>
    </div>
  );
}

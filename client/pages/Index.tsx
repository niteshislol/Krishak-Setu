import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SoilUpload from "@/components/app/SoilUpload";
import { Button } from "@/components/ui/button";
import HeroVisual from "@/components/app/HeroVisual";
import HowItWorks from "@/components/app/HowItWorks";

export default function Index() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="bg-gradient-to-b from-emerald-50/30 via-background to-background dark:from-emerald-950/10 dark:via-background dark:to-background min-h-screen flex flex-col">
      <section className="relative overflow-hidden flex-1 flex items-center justify-center border-b">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-teal-500/15 blur-3xl" />
        <div className="container py-16 md:py-32 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-10">
            <div>
              <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">
                  {t("brand.name")}
                </span>
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-muted-foreground leading-relaxed font-medium max-w-xl mx-auto">
              Chat with AI about farming, crops, soil, and agriculture
            </p>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Get instant answers about soil health, crop recommendations, fertilizers, and farming practices.
            </p>
            <div className="flex flex-wrap gap-4 pt-8 justify-center">
              <Button
                size="lg"
                className="h-14 px-10 text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate("/chat")}
              >
                Start Chatting
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-10 text-lg font-semibold border-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                onClick={() => navigate("/chat")}
              >
                Open Chat
              </Button>
            </div>

            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="p-6 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-gradient-to-br from-background to-emerald-50/20 dark:to-emerald-950/10">
                <div className="text-4xl mb-3">🌾</div>
                <h3 className="font-bold text-lg mb-2">Farming Questions</h3>
                <p className="text-sm text-muted-foreground">Ask about crops, seasons, and farming practices</p>
              </div>
              <div className="p-6 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-gradient-to-br from-background to-emerald-50/20 dark:to-emerald-950/10">
                <div className="text-4xl mb-3">🧪</div>
                <h3 className="font-bold text-lg mb-2">Soil & Nutrients</h3>
                <p className="text-sm text-muted-foreground">Learn about pH, NPK, and soil health</p>
              </div>
              <div className="p-6 rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 bg-gradient-to-br from-background to-emerald-50/20 dark:to-emerald-950/10">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="font-bold text-lg mb-2">Instant Answers</h3>
                <p className="text-sm text-muted-foreground">Get expert guidance powered by AI</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

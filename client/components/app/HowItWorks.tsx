import { Upload, Bot, Sprout } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const steps = [
  {
    icon: Upload,
    titleKey: "upload.title",
    desc: "Upload your soil test (PDF/JPG/PNG).",
  },
  {
    icon: Bot,
    titleKey: "cta.analyzing",
    desc: "AI extracts pH, N, P, K, OM and evaluates balance.",
  },
  {
    icon: Sprout,
    titleKey: "reco.title",
    desc: "Get crops, fertilizer blend and safe pesticide guidance.",
  },
];

export default function HowItWorks() {
  const { t } = useTranslation();
  return (
    <section className="container py-16 md:py-24 border-y bg-gradient-to-r from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/10 dark:via-background dark:to-teal-950/10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
          How it works
        </h2>
        <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
          Simple, visual and tailored to your soil.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map((s, index) => (
          <div key={s.titleKey} className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
            <Card className="relative h-full border-2 hover:border-emerald-500/50 transition-colors group">
              <CardHeader className="items-center text-center">
                <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <s.icon className="h-6 w-6" />
                </div>
                <div className="mt-4 inline-flex items-center justify-center h-8 w-8 rounded-full bg-emerald-600 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <CardTitle className="mt-4 text-xl">{t(s.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {s.desc}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}

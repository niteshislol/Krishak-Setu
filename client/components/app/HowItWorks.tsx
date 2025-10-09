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
    <section className="container py-12 md:py-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          How it works
        </h2>
        <p className="text-muted-foreground mt-2">
          Simple, visual and tailored to your soil.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {steps.map((s) => (
          <Card key={s.titleKey}>
            <CardHeader className="items-center text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/15 text-emerald-600 flex items-center justify-center">
                <s.icon />
              </div>
              <CardTitle className="mt-2">{t(s.titleKey)}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">
                {s.desc}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

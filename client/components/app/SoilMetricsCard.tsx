import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import type { SoilMetrics } from "@shared/api";

export default function SoilMetricsCard({ metrics }: { metrics: SoilMetrics }) {
  const { t } = useTranslation();
  const items = [
    { label: t("metrics.ph"), value: metrics.pH },
    { label: t("metrics.n"), value: `${metrics.nitrogen} kg/ha` },
    { label: t("metrics.p"), value: `${metrics.phosphorus} kg/ha` },
    { label: t("metrics.k"), value: `${metrics.potassium} kg/ha` },
    { label: t("metrics.om"), value: `${metrics.organicMatter}%` }
  ];
  return (
    <Card className="overflow-hidden border-2">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-b">
        <CardTitle className="text-2xl">{t("metrics.title")}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {items.map((it, index) => (
            <div
              key={it.label}
              className="rounded-lg border-2 border-emerald-200/50 dark:border-emerald-800/30 p-5 bg-gradient-to-br from-background to-emerald-50/20 dark:to-emerald-950/10 hover:border-emerald-500/50 transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">{it.label}</div>
                <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100/50 dark:bg-emerald-950/30 px-2 py-1 rounded">#{index + 1}</div>
              </div>
              <div className="text-2xl font-bold text-foreground group-hover:text-emerald-600 transition-colors">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

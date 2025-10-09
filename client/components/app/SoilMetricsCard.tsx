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
    <Card>
      <CardHeader>
        <CardTitle>{t("metrics.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <div key={it.label} className="rounded-md border p-4 bg-background">
              <div className="text-xs uppercase text-muted-foreground">{it.label}</div>
              <div className="mt-1 text-xl font-semibold">{it.value}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

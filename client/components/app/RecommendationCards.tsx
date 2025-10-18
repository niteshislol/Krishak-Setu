import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sprout, FlaskConical, SprayCan } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SoilRecommendations } from "@shared/api";

export default function RecommendationCards({ data }: { data: SoilRecommendations }) {
  const { t } = useTranslation();
  const items = [
    {
      icon: <Sprout className="text-emerald-500" />, title: t("reco.crops"), content: (
        <ul className="list-disc pl-4">
          {data.crops.map(c => <li key={c}>{c}</li>)}
        </ul>
      )
    },
    {
      icon: <FlaskConical className="text-teal-500" />, title: t("reco.fertilizer"), content: (
        <p>{data.fertilizerBlend}</p>
      )
    },
    {
      icon: <SprayCan className="text-cyan-500" />, title: t("reco.pesticide"), content: (
        <ul className="list-disc pl-4">
          {data.pesticides.map(p => <li key={p}>{p}</li>)}
        </ul>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Recommendations</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((block, idx) => (
          <Card
            key={block.title}
            className="overflow-hidden border-2 hover:border-emerald-500/50 transition-all hover:shadow-lg group"
          >
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500" />
            <CardHeader className="flex-row items-start gap-4 pb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                {block.icon}
              </div>
              <CardTitle className="text-lg">{block.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-relaxed">
              {typeof block.content === 'string' ? (
                <p>{block.content}</p>
              ) : (
                block.content
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((block) => (
        <Card key={block.title}>
          <CardHeader className="flex-row items-center gap-3">
            {block.icon}
            <CardTitle>{block.title}</CardTitle>
          </CardHeader>
          <CardContent>{block.content}</CardContent>
        </Card>
      ))}
    </div>
  );
}

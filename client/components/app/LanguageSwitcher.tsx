import { useEffect, useState } from "react";
import i18n from "@/i18n";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "bn", label: "বাংলা" },
  { code: "mr", label: "मराठी" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "ur", label: "اردو" },
  { code: "ml", label: "മലയാളം" },
];

export default function LanguageSwitcher() {
  const [lng, setLng] = useState<string>(i18n.language || "en");

  useEffect(() => {
    const handle = (l: string) => setLng(l);
    i18n.on("languageChanged", handle);
    return () => i18n.off("languageChanged", handle);
  }, []);

  return (
    <div className="min-w-[140px]">
      <Select
        value={lng}
        onValueChange={(val) => {
          setLng(val);
          i18n.changeLanguage(val);
          localStorage.setItem("lang", val);
        }}
      >
        <SelectTrigger aria-label="Language selector">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((l) => (
            <SelectItem key={l.code} value={l.code}>
              {l.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

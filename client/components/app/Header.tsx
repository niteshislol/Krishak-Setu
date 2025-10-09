import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/app/LanguageSwitcher";
import ThemeToggle from "@/components/app/ThemeToggle";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/40">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded bg-gradient-to-tr from-emerald-500 to-teal-500" />
          <span className="text-lg font-bold tracking-tight">{t("brand.name")}</span>
        </a>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/app/LanguageSwitcher";
import ThemeToggle from "@/components/app/ThemeToggle";

export default function Header() {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/30 transition-shadow">
            <span className="text-white font-bold text-lg">KS</span>
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">{t("brand.name")}</span>
        </a>
        <nav className="flex items-center gap-1 sm:gap-2">
          <a href="/chat" className="text-sm font-medium text-foreground/70 hover:text-foreground transition-all px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30">Chat</a>
          <LanguageSwitcher />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

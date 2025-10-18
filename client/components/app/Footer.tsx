import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-gradient-to-t from-emerald-50/30 to-background dark:from-emerald-950/10 dark:to-background mt-20">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">KS</span>
              </div>
              <span className="font-bold text-lg">{t("brand.name")}</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">Smart farming solutions powered by soil science and AI.</p>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="/chat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Chat</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            </nav>
          </div>
          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider">Legal</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.privacy")}</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.terms")}</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{t("footer.contact")}</a>
            </nav>
          </div>
        </div>
        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {t("brand.name")} · All rights reserved</p>
          <div className="flex items-center gap-6">
            <a className="hover:text-foreground transition-colors" href="#">Twitter</a>
            <a className="hover:text-foreground transition-colors" href="#">GitHub</a>
            <a className="hover:text-foreground transition-colors" href="#">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

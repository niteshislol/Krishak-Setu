import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} {t("brand.name")} · All rights reserved</p>
        <nav className="flex items-center gap-6">
          <a className="hover:text-foreground" href="#">{t("footer.privacy")}</a>
          <a className="hover:text-foreground" href="#">{t("footer.terms")}</a>
          <a className="hover:text-foreground" href="#">{t("footer.contact")}</a>
        </nav>
      </div>
    </footer>
  );
}

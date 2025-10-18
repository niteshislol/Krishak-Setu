import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import ta from "@/locales/ta.json";
import te from "@/locales/te.json";
import bn from "@/locales/bn.json";
import mr from "@/locales/mr.json";
import kn from "@/locales/kn.json";
import gu from "@/locales/gu.json";
import ur from "@/locales/ur.json";
import ml from "@/locales/ml.json";

const resources = { en, hi, ta, te, bn, mr, kn, gu, ur, ml } as const;

const stored = localStorage.getItem("lang") || "en";

void i18n.use(initReactI18next).init({
  resources: Object.fromEntries(
    Object.entries(resources).map(([lng, dict]) => [lng, { translation: dict }]),
  ),
  lng: stored,
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;

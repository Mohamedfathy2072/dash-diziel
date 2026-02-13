import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

const arModules = import.meta.glob("./locales/ar/**/*.json", { eager: true });
const enModules = import.meta.glob("./locales/en/**/*.json", { eager: true });

function buildResources(modules: Record<string, any>, lang: string) {
  const resources: Record<string, any> = {};
  for (const path in modules) {
    const nsPath = path.replace(`./locales/${lang}/`, "").replace(".json", "");
    resources[nsPath] = modules[path].default;
  }
  return resources;
}

const resources = {
  ar: buildResources(arModules, "ar"),
  en: buildResources(enModules, "en"),
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    // lng: localStorage.getItem(import.meta.env.VITE_LANG_STORAGE) || "ar",  flag
    fallbackLng: "ar",
    supportedLngs: ["ar", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: import.meta.env.VITE_LANG_STORAGE,
      caches: ["localStorage"],
    },
  });

export default i18n;

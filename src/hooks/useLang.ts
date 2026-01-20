import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const useLang = () => {
  const { t, i18n } = useTranslation("hooks/use_lang");
  const langStorage = `${import.meta.env.VITE_TOKEN_LANG_STORAGE}`;

  const applyHtmlAttributes = (lang: string) => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === "ar" ? "rtl" : "ltr";
    document.body.classList.remove(lang === "ar" ? "en" : "ar");
    document.body.classList.add(lang);
    document.title = t("title");
    const favicon = document.querySelector(
      "link[rel~='icon']"
    ) as HTMLLinkElement;
    if (favicon) {
      favicon.href =
        lang === "ar"
          ? "/images/logo_arabic-5.jpeg"
          : "/images/logo_arabic-5.jpeg";
    } else {
      const newFavicon = document.createElement("link");
      newFavicon.rel = "icon";
      newFavicon.href =
        lang === "ar"
          ? "/images/logo_arabic-5.jpeg"
          : "/images/logo_english_5.jpeg";
      document.head.appendChild(newFavicon);
    }
  };

  const handleGetLang = () => {
    return i18n.language;
  };

  const handleChangeLang = () => {
    let lang = localStorage.getItem(langStorage);
    if (lang === "en") {
      lang = "ar";
    } else {
      lang = "en";
    }
    localStorage.setItem(langStorage, lang);
    i18n.changeLanguage(lang);
    applyHtmlAttributes(lang);
  };

  const handleSetLang = () => {
    let lang = localStorage.getItem(langStorage);
    if (!lang) {
      lang = "ar";
      localStorage.setItem(langStorage, lang);
    }
    i18n.changeLanguage(lang);
    applyHtmlAttributes(lang);
  };

  useEffect(() => {
    handleSetLang()
  }, [])

  return { handleChangeLang, handleSetLang, handleGetLang };
};

export default useLang;

import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import { createRoot } from "react-dom/client";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import "./assets/index.css";
import i18n from "./i18n";
import logger from "./utils/logger";
import { reportWebVitals } from "./reportWebVitals";
import { router } from "./routers/router";
import { store } from "./store/store";
import { theme } from "./theme";

const createEmotionCache = (lang: string) =>
  createCache({
    key: lang === "ar" ? "muirtl" : "mui",
    insertionPoint: document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]'
    ) || undefined,
    prepend: true,
    stylisPlugins: lang === "ar" ? [prefixer, rtlPlugin] : [prefixer],
  });

const lang = i18n.language || "ar";

const root = createRoot(document.getElementById("root")!);
root.render(
  <CacheProvider value={createEmotionCache(lang)}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <RouterProvider router={router} />
        </I18nextProvider>
      </Provider>
    </ThemeProvider>
  </CacheProvider>
);
reportWebVitals((metric) => {
  logger.debug("Web Vitals", metric);
});
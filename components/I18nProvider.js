"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { translate, DEFAULT_LOCALE } from "@/lib/i18n";

// Lightweight language context: the choice lives in localStorage, the context
// re-renders the tree when it changes, and `t` looks up the centralized
// dictionary in lib/i18n.js. No extra packages.
const I18nContext = createContext({
  lang: DEFAULT_LOCALE,
  setLang: () => {},
  t: (key) => key,
});

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(DEFAULT_LOCALE);

  // Initial load: read the saved preference and apply it to <html lang>.
  useEffect(() => {
    let saved = DEFAULT_LOCALE;
    try {
      saved = window.localStorage.getItem("lang") || DEFAULT_LOCALE;
    } catch {
      saved = DEFAULT_LOCALE;
    }
    if (saved === "en" || saved === "km") {
      setLangState(saved);
      document.documentElement.lang = saved;
      document.documentElement.setAttribute("data-lang", saved);
    }
  }, []);

  function setLang(next) {
    setLangState(next);
    try {
      window.localStorage.setItem("lang", next);
    } catch {
      // ignore private-mode storage errors
    }
    document.documentElement.lang = next;
    document.documentElement.setAttribute("data-lang", next);
  }

  const value = {
    lang,
    setLang,
    t: (key, vars) => translate(lang, key, vars),
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
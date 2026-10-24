"use client";

import { useI18n } from "./I18nProvider";

// Renders its children only while the site language is English. Used to hide
// the English-name lines when the archive is being viewed in Khmer.
export default function ShowEn({ children }) {
  const { lang } = useI18n();
  return lang === "en" ? children : null;
}
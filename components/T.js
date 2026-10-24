"use client";

import { useI18n } from "./I18nProvider";

// Minimal client text element, used where a server page renders a string that
// must switch language after hydration. Usage:
//   <T k="home.title" as="h1" className={styles.heroTitle} />
export default function T({ k, as: Tag = "span", className, vars }) {
  const { t } = useI18n();
  return <Tag className={className}>{t(k, vars)}</Tag>;
}
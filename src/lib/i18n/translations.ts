import translationAr from "./raw/translation.ar.json";
import translationDe from "./raw/translation.de.json";
import translationEn from "./raw/translation.en.json";
import translationEs from "./raw/translation.es.json";
import translationFr from "./raw/translation.fr.json";
import translationHi from "./raw/translation.hi.json";
import translationJa from "./raw/translation.ja.json";
import translationKo from "./raw/translation.ko.json";
import translationPt from "./raw/translation.pt.json";
import translationRu from "./raw/translation.ru.json";
import translationZh from "./raw/translation.zh.json";

export type Locale =
  | "en"
  | "hi"
  | "ar"
  | "ru"
  | "zh"
  | "es"
  | "fr"
  | "de"
  | "ja"
  | "ko"
  | "pt";

export const SUPPORTED_LOCALES: Locale[] = [
  "en",
  "hi",
  "ar",
  "ru",
  "zh",
  "es",
  "fr",
  "de",
  "ja",
  "ko",
  "pt",
];

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  hi: "हिन्दी",
  ar: "العربية",
  ru: "Русский",
  zh: "中文",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  ko: "한국어",
  pt: "Português",
};

export const RTL_LOCALES: Locale[] = ["ar"];

export type TranslationKey = keyof typeof translations.en;

export const translations: Record<Locale, Record<string, string>> = {
  ar: translationAr,
  de: translationDe,
  en: translationEn,
  es: translationEs,
  fr: translationFr,
  hi: translationHi,
  ja: translationJa,
  ko: translationKo,
  pt: translationPt,
  ru: translationRu,
  zh: translationZh,
};

export const en = translations.en;

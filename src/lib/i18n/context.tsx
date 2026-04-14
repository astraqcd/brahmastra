"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Locale,
  type TranslationKey,
  translations,
  en,
  SUPPORTED_LOCALES,
  RTL_LOCALES,
} from "./translations";

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
  isTranslating: boolean;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => en[key] ?? key,
  dir: "ltr",
  isTranslating: false,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [dict, setDict] = useState(en);
  const [isTranslating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("brahmastra-locale") as Locale | null;
    if (stored && SUPPORTED_LOCALES.includes(stored)) {
      setLocaleState(stored);
    } else {
      const browserLang = navigator.language.split("-")[0] as Locale;
      if (SUPPORTED_LOCALES.includes(browserLang)) {
        setLocaleState(browserLang);
      }
    }
  }, []);

  useEffect(() => {
    const localeDictionary = translations[locale] ?? translations.en;
    setDict(localeDictionary);
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("brahmastra-locale", newLocale);
    document.documentElement.dir = RTL_LOCALES.includes(newLocale)
      ? "rtl"
      : "ltr";
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return dict[key] || en[key] || key;
    },
    [dict],
  );

  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir, isTranslating }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import {
  type Locale,
  type TranslationKey,
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

// Build a localStorage cache key per locale
function cacheKey(locale: Locale) {
  return `brahmastra-i18n-${locale}`;
}

function loadCachedTranslations(locale: Locale): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(cacheKey(locale));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Invalidate cache if the English key set changed (new keys added)
    if (Object.keys(parsed).length !== Object.keys(en).length) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveCachedTranslations(
  locale: Locale,
  translations: Record<string, string>
) {
  try {
    localStorage.setItem(cacheKey(locale), JSON.stringify(translations));
  } catch {
    // localStorage full or unavailable — ignore
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [translations, setTranslations] = useState<Record<string, string>>(
    en as unknown as Record<string, string>
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // On mount, restore saved locale
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

  // Fetch translations when locale changes
  useEffect(() => {
    if (locale === "en") {
      setTranslations(en as unknown as Record<string, string>);
      return;
    }

    // Check cache first
    const cached = loadCachedTranslations(locale);
    if (cached) {
      setTranslations(cached);
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const keys = Object.keys(en) as TranslationKey[];
    const values = keys.map((k) => en[k]);

    setIsTranslating(true);

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: values, targetLang: locale }),
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        const translated: Record<string, string> = {};
        keys.forEach((key, i) => {
          translated[key] = data.translations?.[i] || en[key];
        });
        setTranslations(translated);
        saveCachedTranslations(locale, translated);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Translation fetch failed:", err);
          // Fallback to English
          setTranslations(en as unknown as Record<string, string>);
        }
      })
      .finally(() => {
        setIsTranslating(false);
      });

    return () => controller.abort();
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
      return translations[key] || en[key] || key;
    },
    [translations]
  );

  const dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";

  // Set initial direction
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

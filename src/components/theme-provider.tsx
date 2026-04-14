"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { I18nProvider } from "@/lib/i18n/context";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <I18nProvider>{children}</I18nProvider>
    </NextThemesProvider>
  );
}

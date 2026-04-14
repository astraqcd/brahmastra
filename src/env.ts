import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
  server: {
    TOOLS_SHEET_ID: z.string().min(1),
    PHONE_EMAIL_SHEET_GID: z.string().min(1),
    SOCMINT_SHEET_GID: z.string().min(1),
    MALWARE_SHEET_GID: z.string().min(1),
    GEOINT_SHEET_GID: z.string().min(1),
    WEBINT_SHEET_GID: z.string().min(1),
    IMINT_SHEET_GID: z.string().min(1),
    SIGINT_SHEET_GID: z.string().min(1),
    DARKWEB_SHEET_GID: z.string().min(1),
    GOOGLE_SITE_VERIFICATION: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1),
    NEXT_PUBLIC_SITE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  emptyStringAsUndefined: true,
});

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export type SiteTheme = "verde" | "preto";

type Settings = {
  theme: SiteTheme;
  reduceMotion: boolean;
  sidebarCollapsed: boolean;
};

type SettingsContextValue = Settings & {
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void;
  reset: () => void;
};

const STORAGE_KEY = "mfds:configuracoes";
const defaults: Settings = { theme: "verde", reduceMotion: false, sidebarCollapsed: false };

function load(): Settings {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}") as Partial<Settings>;
    return {
      theme: raw.theme === "preto" ? "preto" : "verde",
      reduceMotion: raw.reduceMotion === true,
      sidebarCollapsed: raw.sidebarCollapsed === true,
    };
  } catch {
    return defaults;
  }
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.dataset.motion = settings.reduceMotion ? "reduzida" : "normal";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      /* armazenamento indisponível: a preferência vale só nesta sessão */
    }
  }, [settings]);

  const update = useCallback<SettingsContextValue["update"]>((key, value) => {
    setSettings((current) => ({ ...current, [key]: value }));
  }, []);
  const reset = useCallback(() => setSettings(defaults), []);

  const value = useMemo(() => ({ ...settings, update, reset }), [settings, update, reset]);
  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings deve ser usado dentro de SettingsProvider");
  return ctx;
}

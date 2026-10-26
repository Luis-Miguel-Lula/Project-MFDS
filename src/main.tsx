import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./index.css";
import "./styles/ui.css";
import App from "./App.tsx";
import { SettingsProvider } from "./settings/SettingsContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>,
);

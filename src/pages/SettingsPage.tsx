import { useEffect, useRef, useState } from "react";
import { Check, Keyboard, MonitorCog, Palette, RotateCcw } from "lucide-react";
import { useSettings } from "../settings/SettingsContext";
import type { SiteTheme } from "../settings/SettingsContext";
import "../styles/settings.css";

const themes: { id: SiteTheme; name: string; description: string }[] = [
  { id: "verde", name: "Branco e verde", description: "Fundo claro com destaques em verde." },
  { id: "preto", name: "Branco e preto", description: "Fundo claro com destaques em preto." },
];

const shortcuts = [
  { keys: "Ctrl + K", action: "Abrir a busca de páginas" },
  { keys: "Esc", action: "Fechar busca e menus" },
  { keys: "Enter", action: "Ir para o primeiro resultado da busca" },
];

type SwitchProps = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
};

function Switch({ id, label, description, checked, onChange }: SwitchProps) {
  return (
    <div className="setting-row">
      <div className="setting-copy">
        <label htmlFor={id}>{label}</label>
        <p id={`${id}-desc`}>{description}</p>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-describedby={`${id}-desc`}
        className="switch"
        onClick={() => onChange(!checked)}
      >
        <span className="switch-thumb" />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, reduceMotion, sidebarCollapsed, update, reset } = useSettings();
  const [notice, setNotice] = useState("");
  const timer = useRef<number>(0);

  function announce(message: string) {
    setNotice(message);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(""), 2400);
  }

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function chooseTheme(id: SiteTheme) {
    if (id === theme) return;
    update("theme", id);
    announce(`Tema alterado para ${themes.find((t) => t.id === id)?.name.toLowerCase()}.`);
  }

  return (
    <section className="settings-page">
      <header className="settings-heading">
        <span className="settings-eyebrow">Preferências</span>
        <h1>Configurações</h1>
        <p>Ajuste a aparência e o comportamento do site. As escolhas ficam salvas neste navegador.</p>
      </header>

      <section className="settings-card" aria-labelledby="site-settings">
        <div className="settings-card-head">
          <MonitorCog size={18} />
          <div>
            <h2 id="site-settings">Configurações do Site</h2>
            <p>Opções básicas de aparência e interface.</p>
          </div>
        </div>

        <div className="setting-block">
          <div className="setting-copy">
            <span className="setting-title">
              <Palette size={15} /> Cores do site
            </span>
            <p>Escolha o esquema de cores usado em todas as páginas.</p>
          </div>

          <div className="theme-options" role="radiogroup" aria-label="Cores do site">
            {themes.map((option) => {
              const selected = option.id === theme;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  data-preview={option.id}
                  className={`theme-option ${selected ? "theme-option-selected" : ""}`}
                  onClick={() => chooseTheme(option.id)}
                >
                  <span className="theme-preview" aria-hidden="true">
                    <span className="tp-side" />
                    <span className="tp-main">
                      <span className="tp-line" />
                      <span className="tp-line tp-short" />
                      <span className="tp-btn" />
                    </span>
                  </span>
                  <span className="theme-option-meta">
                    <strong>{option.name}</strong>
                    <small>{option.description}</small>
                  </span>
                  <span className="theme-check" aria-hidden="true">
                    {selected && <Check size={14} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <Switch
          id="sw-motion"
          label="Reduzir animações"
          description="Desativa transições e movimentos da interface."
          checked={reduceMotion}
          onChange={(v) => {
            update("reduceMotion", v);
            announce(v ? "Animações reduzidas." : "Animações ativadas.");
          }}
        />
        <Switch
          id="sw-sidebar"
          label="Menu lateral recolhido"
          description="Mostra apenas os ícones da navegação."
          checked={sidebarCollapsed}
          onChange={(v) => {
            update("sidebarCollapsed", v);
            announce(v ? "Menu lateral recolhido." : "Menu lateral expandido.");
          }}
        />
      </section>

      <section className="settings-card" aria-labelledby="shortcuts">
        <div className="settings-card-head">
          <Keyboard size={18} />
          <div>
            <h2 id="shortcuts">Atalhos de teclado</h2>
            <p>Navegue sem tirar as mãos do teclado.</p>
          </div>
        </div>
        <dl className="shortcut-list">
          {shortcuts.map((item) => (
            <div key={item.keys} className="shortcut-row">
              <dt>{item.action}</dt>
              <dd>
                <kbd>{item.keys}</kbd>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="settings-footer">
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            reset();
            announce("Configurações restauradas para o padrão.");
          }}
        >
          <RotateCcw size={14} /> Restaurar padrões
        </button>
      </div>

      <div className="settings-toast" role="status" aria-live="polite" data-visible={notice !== ""}>
        {notice && (
          <>
            <Check size={14} /> {notice}
          </>
        )}
      </div>
    </section>
  );
}

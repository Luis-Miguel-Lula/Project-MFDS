type Props = { size?: number; className?: string };

/** Símbolo da Nexora. Usa as cores do tema ativo (fundo = destaque, fita = texto sobre destaque). */
export default function NexoraMark({ size = 40, className }: Props) {
  const ribbon = { fill: "var(--on-accent)" };
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Nexora"
    >
      <rect width="64" height="64" rx="16" style={{ fill: "var(--accent)" }} />
      <path
        style={ribbon}
        fillOpacity=".55"
        d="M14 26 C14 24.4 14.8 23 16.2 22.2 L26 29.5 V42.5 C26 44.3 25 45.6 23.6 46.2 L15.4 49.6 C14.6 49.9 14 49.4 14 48.6 Z"
      />
      <path
        style={ribbon}
        fillOpacity=".82"
        d="M16.2 22.2 C18.6 19.9 22 19.7 24.6 21.9 L38 33.2 V47 L26 37 V29.5 Z"
      />
      <path
        style={ribbon}
        d="M38 20.4 L49 15.4 C49.6 15.1 50 15.5 50 16.2 V41 C50 42.5 49.3 43.6 48.2 44.5 L43.4 48.4 C41.6 49.8 38 49.4 38 47 Z"
      />
    </svg>
  );
}

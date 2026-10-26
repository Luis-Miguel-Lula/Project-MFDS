import type { ReactNode } from "react";

type IconProps = { size?: number; className?: string };

/**
 * Ícones de navegação da Nexora: contorno fino em currentColor com um detalhe
 * preenchido discreto, seguindo o conjunto de referência da marca.
 */
function Icon({ size = 18, className, children }: IconProps & { children: ReactNode }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

const soft = { fill: "currentColor", fillOpacity: 0.32 } as const;

export function OverviewIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2" {...soft} />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
    </Icon>
  );
}

export function ProjectsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M3.5 8a2 2 0 0 1 2-2h3.6l2 2h7.4a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
      <path d="M3.5 11.5h17v6a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" stroke="none" {...soft} />
    </Icon>
  );
}

export function TasksIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16.5 8v7.5a4 4 0 0 1-4 4h-5a4 4 0 0 1-4-4v-5a4 4 0 0 1 4-4H13" />
      <path d="m8.2 13 2.3 2.3 4.2-4.3" />
      <circle cx="18.5" cy="5.5" r="2.5" fill="currentColor" fillOpacity={0.8} stroke="none" />
    </Icon>
  );
}

export function IdeasIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M9 16v-.8c0-1-.5-1.6-1.2-2.4A5 5 0 1 1 16.2 12.8c-.7.8-1.2 1.4-1.2 2.4V16z" />
      <path d="M10 19h4M11 21.3h2" />
      <path d="M12 1v1.4M6.9 4.5l-1-1M17.1 4.5l1-1M4.8 9.6H3.4M19.2 9.6h1.4" />
    </Icon>
  );
}

export function AutomationsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.2 3 7 13.2h4.4L10.6 21 17 10.8h-4.4z" fill="currentColor" fillOpacity={0.85} />
      <path d="M6 6.5A8 8 0 0 0 6 17.5M18 6.5a8 8 0 0 1 0 11" strokeOpacity={0.55} />
    </Icon>
  );
}

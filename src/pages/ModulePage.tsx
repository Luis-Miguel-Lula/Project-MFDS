
import type { ReactNode } from 'react';
import { ArrowRight, Construction } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/module-pages.css';

type ModulePageProps = {
  title: string;
  eyebrow: string;
  description: string;
  icon: ReactNode;
  features: string[];
  nextPath?: string;
  nextLabel?: string;
};

export default function ModulePage({
  title,
  eyebrow,
  description,
  icon,
  features,
  nextPath,
  nextLabel,
}: ModulePageProps) {
  return (
    <section className="module-page">
      <div className="module-heading">
        <span className="module-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="module-status-card">
        <div className="module-icon">{icon}</div>

        <div className="module-status-copy">
          <span className="module-status-label">
            ESTRUTURA INICIAL
          </span>
          <h2>Seu espaço está preparado</h2>
          <p>
            Esta área já possui uma rota própria. As funcionalidades
            definitivas serão implementadas nos próximos tutoriais.
          </p>
        </div>

        <span className="module-badge">
          Em preparação
        </span>
      </div>

      <div className="module-section-heading">
        <div>
          <h2>O que será desenvolvido</h2>
          <p>Escopo previsto para este módulo.</p>
        </div>
      </div>

      <div className="module-feature-grid">
        {features.map((feature, index) => (
          <article className="module-feature" key={feature}>
            <span className="module-feature-number">
              {String(index + 1).padStart(2, '0')}
            </span>
            <p>{feature}</p>
          </article>
        ))}
      </div>

      <div className="module-notice">
        <Construction size={20} />
        <p>
          Esta é uma estrutura demonstrativa. Nenhum dado é salvo
          e nenhuma integração externa é executada nesta etapa.
        </p>
      </div>

      {nextPath && nextLabel && (
        <Link className="module-next-link" to={nextPath}>
          {nextLabel}
          <ArrowRight size={17} />
        </Link>
      )}
    </section>
  );
}

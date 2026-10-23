
import { useMemo, useState, type FormEvent } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CirclePlus,
  Clock3,
  FolderKanban,
  Search,
  Users,
  X,
} from "lucide-react";
import "../styles/projects.css";

type ProjectStatus =
  | "Planejado"
  | "Em andamento"
  | "Em risco"
  | "Concluído";

type Project = {
  id: number;
  name: string;
  description: string;
  owner: string;
  area: string;
  deadline: string;
  status: ProjectStatus;
  progress: number;
};

type ProjectForm = {
  name: string;
  description: string;
  owner: string;
  area: string;
  deadline: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Portal de Gestão MFDS",
    description:
      "Centralizar informações, projetos e atividades da equipe em uma única aplicação.",
    owner: "Ana Martins",
    area: "Produto",
    deadline: "2026-11-30",
    status: "Em andamento",
    progress: 65,
  },
  {
    id: 2,
    name: "Automação de Processos",
    description:
      "Identificar atividades repetitivas e estruturar fluxos de automação.",
    owner: "Carlos Mendes",
    area: "Operações",
    deadline: "2026-12-15",
    status: "Planejado",
    progress: 10,
  },
  {
    id: 3,
    name: "Central de Ideias",
    description:
      "Criar um espaço para registrar, organizar e priorizar sugestões da equipe.",
    owner: "Mariana Costa",
    area: "Inovação",
    deadline: "2026-11-10",
    status: "Em risco",
    progress: 35,
  },
  {
    id: 4,
    name: "Revisão do Processo Interno",
    description:
      "Documentar o fluxo atual de trabalho e identificar oportunidades de melhoria.",
    owner: "Pedro Almeida",
    area: "Processos",
    deadline: "2026-10-15",
    status: "Concluído",
    progress: 100,
  },
];

const statusOptions: ProjectStatus[] = [
  "Planejado",
  "Em andamento",
  "Em risco",
  "Concluído",
];

const emptyForm: ProjectForm = {
  name: "",
  description: "",
  owner: "",
  area: "",
  deadline: "",
};

function formatDate(value: string) {
  if (!value) return "Não definido";

  const [year, month, day] = value.split("-").map(Number);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}

function statusClass(status: ProjectStatus) {
  switch (status) {
    case "Planejado":
      return "planned";
    case "Em andamento":
      return "active";
    case "Em risco":
      return "risk";
    case "Concluído":
      return "completed";
  }
}

function ProjectModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (project: ProjectForm) => void;
}) {
  const [form, setForm] = useState<ProjectForm>(emptyForm);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreate({
      name: form.name.trim(),
      description: form.description.trim(),
      owner: form.owner.trim(),
      area: form.area.trim(),
      deadline: form.deadline,
    });
  }

  return (
    <div
      className="mfds-projects-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="mfds-projects-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-project-title"
      >
        <div className="mfds-projects-modal-header">
          <div>
            <span className="mfds-projects-eyebrow">
              GESTÃO DE PROJETOS
            </span>
            <h2 id="new-project-title">Novo projeto</h2>
            <p>Preencha os dados básicos para cadastrar um projeto.</p>
          </div>

          <button
            type="button"
            className="mfds-projects-icon-button"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mfds-projects-form-grid">
            <label className="mfds-projects-field mfds-projects-field-full">
              Nome do projeto *
              <input
                autoFocus
                required
                maxLength={100}
                value={form.name}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
                placeholder="Ex.: Modernização de processos"
              />
            </label>

            <label className="mfds-projects-field mfds-projects-field-full">
              Descrição
              <textarea
                rows={3}
                maxLength={500}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Descreva o objetivo do projeto"
              />
            </label>

            <label className="mfds-projects-field">
              Responsável *
              <input
                required
                maxLength={100}
                value={form.owner}
                onChange={(event) =>
                  setForm({ ...form, owner: event.target.value })
                }
                placeholder="Nome do responsável"
              />
            </label>

            <label className="mfds-projects-field">
              Área
              <input
                maxLength={80}
                value={form.area}
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value })
                }
                placeholder="Ex.: Produto"
              />
            </label>

            <label className="mfds-projects-field mfds-projects-field-full">
              Prazo
              <input
                type="date"
                value={form.deadline}
                onChange={(event) =>
                  setForm({ ...form, deadline: event.target.value })
                }
              />
            </label>
          </div>

          <p className="mfds-projects-form-note">
            O projeto será criado com status Planejado e progresso de 0%.
          </p>

          <div className="mfds-projects-modal-actions">
            <button
              type="button"
              className="mfds-projects-button mfds-projects-button-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="mfds-projects-button mfds-projects-button-primary"
            >
              <CirclePlus size={17} />
              Criar projeto
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const summary = useMemo(
    () => ({
      total: projects.length,
      active: projects.filter((project) => project.status === "Em andamento")
        .length,
      completed: projects.filter((project) => project.status === "Concluído")
        .length,
      risk: projects.filter((project) => project.status === "Em risco").length,
    }),
    [projects],
  );

  const filteredProjects = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("pt-BR");

    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLocaleLowerCase("pt-BR").includes(normalizedSearch) ||
        project.description
          .toLocaleLowerCase("pt-BR")
          .includes(normalizedSearch) ||
        project.owner.toLocaleLowerCase("pt-BR").includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Todos" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  function createProject(form: ProjectForm) {
    const newProject: Project = {
      id: Date.now(),
      ...form,
      area: form.area || "Não definida",
      deadline: form.deadline,
      status: "Planejado",
      progress: 0,
    };

    setProjects((current) => [newProject, ...current]);
    setShowCreateModal(false);
    setSearch("");
    setStatusFilter("Todos");
  }

  return (
    <main className="mfds-projects-page">
      <header className="mfds-projects-heading">
        <div>
          <span className="mfds-projects-eyebrow">ESPAÇO DE TRABALHO</span>
          <h1>Projetos</h1>
          <p>
            Organize iniciativas, acompanhe o progresso e mantenha a equipe
            alinhada.
          </p>
        </div>

        <button
          type="button"
          className="mfds-projects-button mfds-projects-button-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <CirclePlus size={18} />
          Novo projeto
        </button>
      </header>

      <section
        className="mfds-projects-summary"
        aria-label="Resumo dos projetos"
      >
        <article className="mfds-projects-summary-card">
          <div className="mfds-projects-summary-icon icon-total">
            <FolderKanban size={21} />
          </div>
          <span className="mfds-projects-summary-label">
            Total de projetos
          </span>
          <strong>{summary.total}</strong>
          <span className="mfds-projects-summary-caption">
            Projetos cadastrados nesta sessão
          </span>
        </article>

        <article className="mfds-projects-summary-card">
          <div className="mfds-projects-summary-icon icon-active">
            <Clock3 size={21} />
          </div>
          <span className="mfds-projects-summary-label">Em andamento</span>
          <strong>{summary.active}</strong>
          <span className="mfds-projects-summary-caption">
            Em execução
          </span>
        </article>

        <article className="mfds-projects-summary-card">
          <div className="mfds-projects-summary-icon icon-completed">
            <CheckCircle2 size={21} />
          </div>
          <span className="mfds-projects-summary-label">Concluídos</span>
          <strong>{summary.completed}</strong>
          <span className="mfds-projects-summary-caption">
            Finalizados
          </span>
        </article>

        <article className="mfds-projects-summary-card">
          <div className="mfds-projects-summary-icon icon-risk">
            <CircleAlert size={21} />
          </div>
          <span className="mfds-projects-summary-label">Em risco</span>
          <strong>{summary.risk}</strong>
          <span className="mfds-projects-summary-caption">
            Precisam de atenção
          </span>
        </article>
      </section>

      <section className="mfds-projects-list-section">
        <div className="mfds-projects-list-heading">
          <div>
            <h2>Todos os projetos</h2>
            <p>Consulte e acompanhe as iniciativas da equipe.</p>
          </div>
          <span className="mfds-projects-count">
            {filteredProjects.length}{" "}
            {filteredProjects.length === 1 ? "projeto" : "projetos"}
          </span>
        </div>

        <div className="mfds-projects-toolbar">
          <label className="mfds-projects-search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Pesquisar projetos"
              placeholder="Pesquisar por nome, descrição ou responsável..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="mfds-projects-filter">
            <span>Status</span>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="Todos">Todos os status</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="mfds-projects-grid">
            {filteredProjects.map((project) => (
              <article className="mfds-project-card" key={project.id}>
                <div className="mfds-project-card-top">
                  <div className="mfds-project-card-icon">
                    <FolderKanban size={21} />
                  </div>
                  <span
                    className={`mfds-project-status ${statusClass(project.status)}`}
                  >
                    <span className="mfds-project-status-dot" />
                    {project.status}
                  </span>
                </div>

                <h3>{project.name}</h3>
                <p className="mfds-project-description">
                  {project.description || "Nenhuma descrição informada."}
                </p>

                <div className="mfds-project-progress">
                  <div className="mfds-project-progress-heading">
                    <span>Progresso</span>
                    <strong>{project.progress}%</strong>
                  </div>
                  <div
                    className="mfds-project-progress-track"
                    role="progressbar"
                    aria-label={`Progresso de ${project.name}`}
                    aria-valuenow={project.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <span style={{ width: `${project.progress}%` }} />
                  </div>
                </div>

                <div className="mfds-project-meta">
                  <div>
                    <Users size={16} />
                    <span>{project.owner}</span>
                  </div>
                  <div>
                    <CalendarDays size={16} />
                    <span>{formatDate(project.deadline)}</span>
                  </div>
                </div>

                <div className="mfds-project-card-footer">
                  <span className="mfds-project-area">{project.area}</span>
                  <button
                    type="button"
                    className="mfds-project-details-button"
                    onClick={() => setSelectedProject(project)}
                  >
                    Ver detalhes
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mfds-projects-empty">
            <div className="mfds-projects-empty-icon">
              <Search size={24} />
            </div>
            <h3>Nenhum projeto encontrado</h3>
            <p>
              Tente mudar a pesquisa ou selecionar outro filtro de status.
            </p>
            <button
              type="button"
              className="mfds-projects-button mfds-projects-button-secondary"
              onClick={() => {
                setSearch("");
                setStatusFilter("Todos");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {showCreateModal && (
        <ProjectModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createProject}
        />
      )}

      {selectedProject && (
        <div
          className="mfds-projects-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProject(null);
            }
          }}
        >
          <section
            className="mfds-projects-modal mfds-projects-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-details-title"
          >
            <div className="mfds-projects-modal-header">
              <div>
                <span className="mfds-projects-eyebrow">
                  DETALHES DO PROJETO
                </span>
                <h2 id="project-details-title">{selectedProject.name}</h2>
                <p>Informações gerais da iniciativa selecionada.</p>
              </div>
              <button
                type="button"
                className="mfds-projects-icon-button"
                onClick={() => setSelectedProject(null)}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mfds-projects-details-description">
              {selectedProject.description || "Nenhuma descrição informada."}
            </p>

            <div className="mfds-projects-details-grid">
              <div>
                <span>Status</span>
                <strong
                  className={`mfds-project-status ${statusClass(selectedProject.status)}`}
                >
                  <span className="mfds-project-status-dot" />
                  {selectedProject.status}
                </strong>
              </div>
              <div>
                <span>Responsável</span>
                <strong>{selectedProject.owner}</strong>
              </div>
              <div>
                <span>Área</span>
                <strong>{selectedProject.area}</strong>
              </div>
              <div>
                <span>Prazo</span>
                <strong>{formatDate(selectedProject.deadline)}</strong>
              </div>
            </div>

            <div className="mfds-project-progress mfds-project-details-progress">
              <div className="mfds-project-progress-heading">
                <span>Progresso registrado</span>
                <strong>{selectedProject.progress}%</strong>
              </div>
              <div
                className="mfds-project-progress-track"
                role="progressbar"
                aria-label="Progresso do projeto"
                aria-valuenow={selectedProject.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <span style={{ width: `${selectedProject.progress}%` }} />
              </div>
            </div>

            <div className="mfds-projects-modal-actions">
              <button
                type="button"
                className="mfds-projects-button mfds-projects-button-primary"
                onClick={() => setSelectedProject(null)}
              >
                Fechar
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

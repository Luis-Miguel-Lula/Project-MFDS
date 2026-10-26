import { useMemo, useState, type FormEvent } from "react";
import {
  Activity,
  Archive,
  ArrowRight,
  Bot,
  CalendarClock,
  Check,
  ChevronDown,
  CirclePause,
  CirclePlay,
  Clock3,
  Layers3,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Workflow,
  X,
} from "lucide-react";
import "../styles/automations.css";

type AutomationStatus = "Ativa" | "Pausada" | "Rascunho" | "Arquivada";

type TriggerType = "Agendamento" | "Tarefa concluída" | "Manual";

type ActionType =
  | "Enviar notificação"
  | "Criar tarefa"
  | "Gerar resumo"
  | "Organizar projeto";

type Automation = {
  id: number;
  name: string;
  description: string;
  trigger: TriggerType;
  action: ActionType;
  status: AutomationStatus;
  updatedAt: string;
};

type AutomationForm = {
  name: string;
  description: string;
  trigger: TriggerType;
  action: ActionType;
  status: AutomationStatus;
};

const initialAutomations: Automation[] = [
  {
    id: 1,
    name: "Resumo semanal do projeto",
    description:
      "Organiza os principais pontos do projeto para revisão semanal.",
    trigger: "Agendamento",
    action: "Gerar resumo",
    status: "Ativa",
    updatedAt: "22/10/2026",
  },
  {
    id: 2,
    name: "Aviso de tarefa concluída",
    description: "Prepara uma notificação quando uma tarefa é concluída.",
    trigger: "Tarefa concluída",
    action: "Enviar notificação",
    status: "Ativa",
    updatedAt: "21/10/2026",
  },
  {
    id: 3,
    name: "Planejamento de próximas tarefas",
    description: "Ajuda a organizar o próximo passo de um projeto.",
    trigger: "Manual",
    action: "Criar tarefa",
    status: "Pausada",
    updatedAt: "20/10/2026",
  },
  {
    id: 4,
    name: "Organização inicial do projeto",
    description:
      "Rascunho de uma rotina para organizar as etapas de um projeto.",
    trigger: "Manual",
    action: "Organizar projeto",
    status: "Rascunho",
    updatedAt: "18/10/2026",
  },
];

const emptyForm: AutomationForm = {
  name: "",
  description: "",
  trigger: "Manual",
  action: "Enviar notificação",
  status: "Rascunho",
};

function getStatusClass(status: AutomationStatus) {
  switch (status) {
    case "Ativa":
      return "is-active";
    case "Pausada":
      return "is-paused";
    case "Rascunho":
      return "is-draft";
    case "Arquivada":
      return "is-archived";
  }
}

export default function AutomationsPage() {
  const [automations, setAutomations] =
    useState<Automation[]>(initialAutomations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [detailsId, setDetailsId] = useState<number | null>(null);
  const [menuId, setMenuId] = useState<number | null>(null);
  const [form, setForm] = useState<AutomationForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const visibleAutomations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return automations.filter((automation) => {
      const matchesStatus =
        statusFilter === "Todas" || automation.status === statusFilter;

      const matchesSearch =
        !query ||
        [
          automation.name,
          automation.description,
          automation.trigger,
          automation.action,
        ].some((value) => value.toLowerCase().includes(query));

      return (
        matchesStatus && matchesSearch && automation.status !== "Arquivada"
      );
    });
  }, [automations, search, statusFilter]);

  const activeCount = automations.filter(
    (item) => item.status === "Ativa",
  ).length;

  const pausedCount = automations.filter(
    (item) => item.status === "Pausada",
  ).length;

  const draftCount = automations.filter(
    (item) => item.status === "Rascunho",
  ).length;

  const detailsAutomation = automations.find((item) => item.id === detailsId);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
    setMenuId(null);
  }

  function openEditModal(automation: Automation) {
    setEditingId(automation.id);
    setForm({
      name: automation.name,
      description: automation.description,
      trigger: automation.trigger,
      action: automation.action,
      status: automation.status,
    });
    setFormError("");
    setModalOpen(true);
    setMenuId(null);
    setDetailsId(null);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) {
      setFormError("Informe o nome da automação.");
      return;
    }

    if (!form.description.trim()) {
      setFormError("Informe uma descrição para a automação.");
      return;
    }

    const today = new Intl.DateTimeFormat("pt-BR").format(new Date());

    if (editingId !== null) {
      setAutomations((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...form,
                name,
                description: form.description.trim(),
                updatedAt: today,
              }
            : item,
        ),
      );
      setNotice("Automação atualizada nesta sessão.");
    } else {
      const newAutomation: Automation = {
        id: Date.now(),
        ...form,
        name,
        description: form.description.trim(),
        updatedAt: today,
      };

      setAutomations((current) => [newAutomation, ...current]);
      setNotice("Automação criada nesta sessão.");
    }

    closeModal();
  }

  function toggleStatus(automation: Automation) {
    const nextStatus: AutomationStatus =
      automation.status === "Ativa" ? "Pausada" : "Ativa";

    setAutomations((current) =>
      current.map((item) =>
        item.id === automation.id ? { ...item, status: nextStatus } : item,
      ),
    );

    setNotice(
      nextStatus === "Ativa"
        ? "Automação marcada como ativa nesta sessão."
        : "Automação pausada nesta sessão.",
    );
    setMenuId(null);
    setDetailsId(null);
  }

  function archiveAutomation(automation: Automation) {
    const confirmed = window.confirm(
      `Arquivar a automação "${automation.name}"?`,
    );

    if (!confirmed) return;

    setAutomations((current) =>
      current.map((item) =>
        item.id === automation.id ? { ...item, status: "Arquivada" } : item,
      ),
    );

    setNotice("Automação arquivada nesta sessão.");
    setMenuId(null);
    setDetailsId(null);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todas");
  }

  return (
    <main className="mfds-automations">
      <div className="mfds-automations__topline">
        <div className="mfds-automations__breadcrumb">
          <span>Workspace</span>
          <ArrowRight size={14} aria-hidden="true" />
          <span>Automações</span>
        </div>

        <div className="mfds-automations__demo">
          <span className="mfds-automations__demo-dot" />
          Dados demonstrativos
        </div>
      </div>

      <header className="mfds-automations__header">
        <div>
          <div className="mfds-automations__eyebrow">
            <Sparkles size={15} aria-hidden="true" />
            PRODUTIVIDADE INTELIGENTE
          </div>
          <h1>Automações</h1>
          <p>
            Organize rotinas, reduza tarefas repetitivas e acompanhe suas
            configurações em um só lugar.
          </p>
        </div>

        <button
          type="button"
          className="mfds-automations__primary-button"
          onClick={openCreateModal}
        >
          <Plus size={18} aria-hidden="true" />
          Nova automação
        </button>
      </header>

      {notice && (
        <div className="mfds-automations__notice" role="status">
          <Check size={17} aria-hidden="true" />
          <span>{notice}</span>
          <button
            type="button"
            aria-label="Fechar aviso"
            onClick={() => setNotice("")}
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <section
        className="mfds-automations__summary"
        aria-label="Resumo das automações"
      >
        <article className="mfds-automations__summary-card">
          <div className="mfds-automations__summary-icon icon-purple">
            <Workflow size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Total cadastradas</span>
            <strong>{automations.length}</strong>
            <small>Inclui itens arquivados</small>
          </div>
        </article>

        <article className="mfds-automations__summary-card">
          <div className="mfds-automations__summary-icon icon-green">
            <CirclePlay size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Ativas</span>
            <strong>{activeCount}</strong>
            <small>Marcadas como ativas</small>
          </div>
        </article>

        <article className="mfds-automations__summary-card">
          <div className="mfds-automations__summary-icon icon-orange">
            <CirclePause size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Pausadas</span>
            <strong>{pausedCount}</strong>
            <small>Aguardando retomada</small>
          </div>
        </article>

        <article className="mfds-automations__summary-card">
          <div className="mfds-automations__summary-icon icon-blue">
            <Layers3 size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Rascunhos</span>
            <strong>{draftCount}</strong>
            <small>Configurações iniciais</small>
          </div>
        </article>
      </section>

      <section className="mfds-automations__content">
        <div className="mfds-automations__section-heading">
          <div>
            <h2>Suas rotinas</h2>
            <p>
              Gerencie suas configurações e escolha o que deseja manter ativo.
            </p>
          </div>
          <span className="mfds-automations__count">
            {visibleAutomations.length}{" "}
            {visibleAutomations.length === 1 ? "item" : "itens"}
          </span>
        </div>

        <div className="mfds-automations__toolbar">
          <label className="mfds-automations__search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              placeholder="Buscar automação..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Buscar automação"
            />
          </label>

          <label className="mfds-automations__filter">
            <span>Estado</span>
            <span className="mfds-automations__select-wrap">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filtrar por estado"
              >
                <option value="Todas">Todos os estados</option>
                <option value="Ativa">Ativas</option>
                <option value="Pausada">Pausadas</option>
                <option value="Rascunho">Rascunhos</option>
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </span>
          </label>
        </div>

        {visibleAutomations.length > 0 ? (
          <div className="mfds-automations__grid">
            {visibleAutomations.map((automation) => (
              <article className="mfds-automations__card" key={automation.id}>
                <div className="mfds-automations__card-top">
                  <div className="mfds-automations__card-icon">
                    <Bot size={21} aria-hidden="true" />
                  </div>

                  <span
                    className={`mfds-automations__status ${getStatusClass(
                      automation.status,
                    )}`}
                  >
                    <span />
                    {automation.status}
                  </span>

                  <div className="mfds-automations__menu-wrap">
                    <button
                      type="button"
                      className="mfds-automations__icon-button"
                      aria-label={`Opções de ${automation.name}`}
                      aria-expanded={menuId === automation.id}
                      onClick={() =>
                        setMenuId((current) =>
                          current === automation.id ? null : automation.id,
                        )
                      }
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuId === automation.id && (
                      <div className="mfds-automations__menu">
                        <button
                          type="button"
                          onClick={() => openEditModal(automation)}
                        >
                          <Pencil size={15} />
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleStatus(automation)}
                        >
                          {automation.status === "Ativa" ? (
                            <CirclePause size={15} />
                          ) : (
                            <CirclePlay size={15} />
                          )}
                          {automation.status === "Ativa" ? "Pausar" : "Ativar"}
                        </button>
                        <button
                          type="button"
                          onClick={() => archiveAutomation(automation)}
                        >
                          <Archive size={15} />
                          Arquivar
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className="mfds-automations__card-title-button"
                  onClick={() => setDetailsId(automation.id)}
                >
                  {automation.name}
                </button>

                <p className="mfds-automations__card-description">
                  {automation.description}
                </p>

                <div className="mfds-automations__flow">
                  <div>
                    <span>GATILHO</span>
                    <strong>
                      <CalendarClock size={15} />
                      {automation.trigger}
                    </strong>
                  </div>
                  <ArrowRight
                    size={16}
                    className="mfds-automations__flow-arrow"
                    aria-hidden="true"
                  />
                  <div>
                    <span>AÇÃO</span>
                    <strong>
                      <Activity size={15} />
                      {automation.action}
                    </strong>
                  </div>
                </div>

                <div className="mfds-automations__card-footer">
                  <span>
                    <Clock3 size={14} aria-hidden="true" />
                    Atualizada em {automation.updatedAt}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailsId(automation.id)}
                  >
                    Ver detalhes
                    <ArrowRight size={14} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mfds-automations__empty">
            <div>
              <Search size={25} aria-hidden="true" />
            </div>
            <h3>Nenhuma automação encontrada</h3>
            <p>Tente alterar a pesquisa ou remover os filtros aplicados.</p>
            <button
              type="button"
              className="mfds-automations__secondary-button"
              onClick={clearFilters}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <aside className="mfds-automations__info">
        <div className="mfds-automations__info-icon">
          <Sparkles size={19} aria-hidden="true" />
        </div>
        <div>
          <strong>Um ponto importante sobre esta versão</strong>
          <p>
            Os estados e as configurações são demonstrativos. Marcar uma rotina
            como ativa não executa tarefas em segundo plano. A execução real
            requer integração com um serviço de backend.
          </p>
        </div>
      </aside>

      {modalOpen && (
        <div
          className="mfds-automations__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            className="mfds-automations__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mfds-automation-modal-title"
          >
            <header className="mfds-automations__modal-header">
              <div>
                <span className="mfds-automations__eyebrow">CONFIGURAÇÃO</span>
                <h2 id="mfds-automation-modal-title">
                  {editingId === null ? "Nova automação" : "Editar automação"}
                </h2>
                <p>Defina o gatilho e a ação desta rotina.</p>
              </div>
              <button
                type="button"
                className="mfds-automations__icon-button"
                aria-label="Fechar formulário"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </header>

            <form className="mfds-automations__form" onSubmit={handleSubmit}>
              <label>
                Nome da automação *
                <input
                  autoFocus
                  maxLength={80}
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Ex.: Revisão semanal do projeto"
                  required
                />
              </label>

              <label>
                Descrição *
                <textarea
                  rows={3}
                  maxLength={240}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Explique o objetivo desta automação."
                  required
                />
              </label>

              <div className="mfds-automations__form-row">
                <label>
                  Gatilho
                  <select
                    value={form.trigger}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        trigger: event.target.value as TriggerType,
                      }))
                    }
                  >
                    <option>Manual</option>
                    <option>Agendamento</option>
                    <option>Tarefa concluída</option>
                  </select>
                </label>

                <label>
                  Ação
                  <select
                    value={form.action}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        action: event.target.value as ActionType,
                      }))
                    }
                  >
                    <option>Enviar notificação</option>
                    <option>Criar tarefa</option>
                    <option>Gerar resumo</option>
                    <option>Organizar projeto</option>
                  </select>
                </label>
              </div>

              <label>
                Estado inicial
                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value as AutomationStatus,
                    }))
                  }
                >
                  <option>Rascunho</option>
                  <option>Ativa</option>
                  <option>Pausada</option>
                </select>
              </label>

              {formError && (
                <p className="mfds-automations__form-error" role="alert">
                  {formError}
                </p>
              )}

              <div className="mfds-automations__form-note">
                <Clock3 size={16} aria-hidden="true" />
                Nesta versão, salvar registra a configuração somente no estado
                local da página.
              </div>

              <footer className="mfds-automations__form-actions">
                <button
                  type="button"
                  className="mfds-automations__secondary-button"
                  onClick={closeModal}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="mfds-automations__primary-button"
                >
                  <Check size={17} />
                  {editingId === null ? "Criar automação" : "Salvar alterações"}
                </button>
              </footer>
            </form>
          </section>
        </div>
      )}

      {detailsAutomation && (
        <div
          className="mfds-automations__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDetailsId(null);
            }
          }}
        >
          <section
            className="mfds-automations__modal mfds-automations__details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="mfds-automation-details-title"
          >
            <header className="mfds-automations__modal-header">
              <div>
                <span className="mfds-automations__eyebrow">
                  DETALHES DA ROTINA
                </span>
                <h2 id="mfds-automation-details-title">
                  {detailsAutomation.name}
                </h2>
              </div>
              <button
                type="button"
                className="mfds-automations__icon-button"
                aria-label="Fechar detalhes"
                onClick={() => setDetailsId(null)}
              >
                <X size={20} />
              </button>
            </header>

            <p className="mfds-automations__details-description">
              {detailsAutomation.description}
            </p>

            <div className="mfds-automations__details-grid">
              <div>
                <span>Estado</span>
                <strong
                  className={`mfds-automations__status ${getStatusClass(
                    detailsAutomation.status,
                  )}`}
                >
                  <span />
                  {detailsAutomation.status}
                </strong>
              </div>
              <div>
                <span>Gatilho</span>
                <strong>{detailsAutomation.trigger}</strong>
              </div>
              <div>
                <span>Ação configurada</span>
                <strong>{detailsAutomation.action}</strong>
              </div>
              <div>
                <span>Última atualização</span>
                <strong>{detailsAutomation.updatedAt}</strong>
              </div>
            </div>

            <div className="mfds-automations__form-note">
              <Clock3 size={16} aria-hidden="true" />
              Este painel apresenta a configuração. Não há histórico de execução
              conectado nesta versão.
            </div>

            <footer className="mfds-automations__form-actions">
              <button
                type="button"
                className="mfds-automations__secondary-button"
                onClick={() => setDetailsId(null)}
              >
                Fechar
              </button>
              <button
                type="button"
                className="mfds-automations__primary-button"
                onClick={() => openEditModal(detailsAutomation)}
              >
                <Pencil size={16} />
                Editar
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

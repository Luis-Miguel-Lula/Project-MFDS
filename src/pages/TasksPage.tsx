
import { useMemo, useState, type FormEvent } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  CirclePlus,
  Clock3,
  ListTodo,
  Search,
  UserRound,
  X,
} from "lucide-react";
import "../styles/tasks.css";

type TaskStatus = "Pendente" | "Em andamento" | "Concluída";
type TaskPriority = "Baixa" | "Média" | "Alta" | "Urgente";

type Task = {
  id: number;
  title: string;
  description: string;
  project: string;
  owner: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
};

type TaskForm = {
  title: string;
  description: string;
  project: string;
  owner: string;
  dueDate: string;
  priority: TaskPriority;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Definir os requisitos do portal",
    description:
      "Consolidar as necessidades iniciais e documentar os requisitos do produto.",
    project: "Portal de Gestão MFDS",
    owner: "Ana Martins",
    dueDate: "2026-10-28",
    priority: "Alta",
    status: "Em andamento",
  },
  {
    id: 2,
    title: "Revisar o fluxo de navegação",
    description:
      "Verificar os caminhos entre o painel principal e os módulos da aplicação.",
    project: "Portal de Gestão MFDS",
    owner: "Carlos Mendes",
    dueDate: "2026-10-24",
    priority: "Urgente",
    status: "Pendente",
  },
  {
    id: 3,
    title: "Organizar as sugestões recebidas",
    description:
      "Agrupar as ideias por tema e preparar uma lista para priorização.",
    project: "Central de Ideias",
    owner: "Mariana Costa",
    dueDate: "2026-11-02",
    priority: "Média",
    status: "Em andamento",
  },
  {
    id: 4,
    title: "Documentar o processo atual",
    description:
      "Registrar as etapas do processo interno e suas principais dependências.",
    project: "Revisão do Processo Interno",
    owner: "Pedro Almeida",
    dueDate: "2026-10-15",
    priority: "Baixa",
    status: "Concluída",
  },
  {
    id: 5,
    title: "Mapear oportunidades de automação",
    description:
      "Identificar atividades repetitivas que possam ser candidatas à automação.",
    project: "Automação de Processos",
    owner: "Ana Martins",
    dueDate: "2026-11-12",
    priority: "Média",
    status: "Pendente",
  },
];

const statusOptions: TaskStatus[] = [
  "Pendente",
  "Em andamento",
  "Concluída",
];

const priorityOptions: TaskPriority[] = [
  "Baixa",
  "Média",
  "Alta",
  "Urgente",
];

const emptyForm: TaskForm = {
  title: "",
  description: "",
  project: "",
  owner: "",
  dueDate: "",
  priority: "Média",
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

function statusClass(status: TaskStatus) {
  switch (status) {
    case "Pendente":
      return "pending";
    case "Em andamento":
      return "in-progress";
    case "Concluída":
      return "done";
  }
}

function priorityClass(priority: TaskPriority) {
  switch (priority) {
    case "Baixa":
      return "low";
    case "Média":
      return "medium";
    case "Alta":
      return "high";
    case "Urgente":
      return "urgent";
  }
}

function isOverdue(task: Task) {
  if (!task.dueDate || task.status === "Concluída") return false;

  const today = new Date();
  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  return task.dueDate < todayKey;
}

function TaskModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (form: TaskForm) => void;
}) {
  const [form, setForm] = useState<TaskForm>(emptyForm);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    onCreate({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      project: form.project.trim(),
      owner: form.owner.trim(),
    });
  }

  return (
    <div
      className="mfds-tasks-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="mfds-tasks-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-task-title"
      >
        <div className="mfds-tasks-modal-header">
          <div>
            <span className="mfds-tasks-eyebrow">GESTÃO DE ATIVIDADES</span>
            <h2 id="new-task-title">Nova tarefa</h2>
            <p>Cadastre uma atividade e defina seus principais dados.</p>
          </div>

          <button
            type="button"
            className="mfds-tasks-icon-button"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mfds-tasks-form-grid">
            <label className="mfds-tasks-field mfds-tasks-field-full">
              Título da tarefa *
              <input
                autoFocus
                required
                maxLength={120}
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="Ex.: Revisar documentação"
              />
            </label>

            <label className="mfds-tasks-field mfds-tasks-field-full">
              Descrição
              <textarea
                rows={3}
                maxLength={500}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Descreva o que precisa ser feito"
              />
            </label>

            <label className="mfds-tasks-field mfds-tasks-field-full">
              Projeto *
              <input
                required
                maxLength={120}
                value={form.project}
                onChange={(event) =>
                  setForm({ ...form, project: event.target.value })
                }
                placeholder="Nome do projeto associado"
              />
            </label>

            <label className="mfds-tasks-field">
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

            <label className="mfds-tasks-field">
              Prioridade
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({
                    ...form,
                    priority: event.target.value as TaskPriority,
                  })
                }
              >
                {priorityOptions.map((priority) => (
                  <option key={priority} value={priority}>
                    {priority}
                  </option>
                ))}
              </select>
            </label>

            <label className="mfds-tasks-field mfds-tasks-field-full">
              Prazo
              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  setForm({ ...form, dueDate: event.target.value })
                }
              />
            </label>
          </div>

          <p className="mfds-tasks-form-note">
            A tarefa será criada com status Pendente. O projeto e o
            responsável serão registrados como texto nesta versão.
          </p>

          <div className="mfds-tasks-modal-actions">
            <button
              type="button"
              className="mfds-tasks-button mfds-tasks-button-secondary"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="mfds-tasks-button mfds-tasks-button-primary"
            >
              <CirclePlus size={17} />
              Criar tarefa
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [priorityFilter, setPriorityFilter] = useState("Todas");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const summary = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((task) => task.status === "Pendente").length,
      active: tasks.filter((task) => task.status === "Em andamento").length,
      completed: tasks.filter((task) => task.status === "Concluída").length,
    }),
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("pt-BR");

    return tasks.filter((task) => {
      const matchesSearch = [
        task.title,
        task.description,
        task.project,
        task.owner,
      ].some((value) => value.toLocaleLowerCase("pt-BR").includes(query));

      const matchesStatus =
        statusFilter === "Todos" || task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "Todas" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, search, statusFilter, priorityFilter]);

  function createTask(form: TaskForm) {
    const newTask: Task = {
      id: Date.now(),
      ...form,
      status: "Pendente",
    };

    setTasks((current) => [newTask, ...current]);
    setShowCreateModal(false);
    setSearch("");
    setStatusFilter("Todos");
    setPriorityFilter("Todas");
  }

  function updateTaskStatus(taskId: number, status: TaskStatus) {
    setTasks((current) =>
      current.map((task) =>
        task.id === taskId ? { ...task, status } : task,
      ),
    );

    setSelectedTask((current) =>
      current && current.id === taskId ? { ...current, status } : current,
    );
  }

  return (
    <main className="mfds-tasks-page">
      <header className="mfds-tasks-heading">
        <div>
          <span className="mfds-tasks-eyebrow">ESPAÇO DE TRABALHO</span>
          <h1>Tarefas</h1>
          <p>
            Organize as atividades, acompanhe os prazos e saiba o que precisa
            de atenção.
          </p>
        </div>

        <button
          type="button"
          className="mfds-tasks-button mfds-tasks-button-primary"
          onClick={() => setShowCreateModal(true)}
        >
          <CirclePlus size={18} />
          Nova tarefa
        </button>
      </header>

      <section className="mfds-tasks-summary" aria-label="Resumo das tarefas">
        <article className="mfds-tasks-summary-card">
          <div className="mfds-tasks-summary-icon total">
            <ListTodo size={21} />
          </div>
          <span>Total de tarefas</span>
          <strong>{summary.total}</strong>
          <small>Tarefas cadastradas nesta sessão</small>
        </article>

        <article className="mfds-tasks-summary-card">
          <div className="mfds-tasks-summary-icon pending">
            <Clock3 size={21} />
          </div>
          <span>Pendentes</span>
          <strong>{summary.pending}</strong>
          <small>Aguardando execução</small>
        </article>

        <article className="mfds-tasks-summary-card">
          <div className="mfds-tasks-summary-icon active">
            <CircleAlert size={21} />
          </div>
          <span>Em andamento</span>
          <strong>{summary.active}</strong>
          <small>Em execução</small>
        </article>

        <article className="mfds-tasks-summary-card">
          <div className="mfds-tasks-summary-icon completed">
            <CheckCircle2 size={21} />
          </div>
          <span>Concluídas</span>
          <strong>{summary.completed}</strong>
          <small>Finalizadas</small>
        </article>
      </section>

      <section className="mfds-tasks-list-section">
        <div className="mfds-tasks-list-heading">
          <div>
            <h2>Todas as tarefas</h2>
            <p>Pesquise, filtre e acompanhe as atividades cadastradas.</p>
          </div>

          <span className="mfds-tasks-count">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "tarefa" : "tarefas"}
          </span>
        </div>

        <div className="mfds-tasks-toolbar">
          <label className="mfds-tasks-search">
            <Search size={18} />
            <input
              type="search"
              aria-label="Pesquisar tarefas"
              placeholder="Pesquisar por tarefa, projeto ou responsável..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="mfds-tasks-filter">
            <span>Status</span>
            <select
              aria-label="Filtrar por status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="Todos">Todos</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>

          <label className="mfds-tasks-filter">
            <span>Prioridade</span>
            <select
              aria-label="Filtrar por prioridade"
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="Todas">Todas</option>
              {priorityOptions.map((priority) => (
                <option key={priority} value={priority}>
                  {priority}
                </option>
              ))}
            </select>
          </label>
        </div>

        {filteredTasks.length > 0 ? (
          <div className="mfds-tasks-grid">
            {filteredTasks.map((task) => (
              <article className="mfds-task-card" key={task.id}>
                <div className="mfds-task-card-top">
                  <span className="mfds-task-project">
                    {task.project}
                  </span>

                  <span
                    className={`mfds-task-priority ${priorityClass(task.priority)}`}
                  >
                    {task.priority}
                  </span>
                </div>

                <h3>{task.title}</h3>

                <p className="mfds-task-description">
                  {task.description || "Nenhuma descrição informada."}
                </p>

                <div className="mfds-task-status-row">
                  <span
                    className={`mfds-task-status ${statusClass(task.status)}`}
                  >
                    <span className="mfds-task-status-dot" />
                    {task.status}
                  </span>

                  {isOverdue(task) && (
                    <span className="mfds-task-overdue">
                      Atrasada
                    </span>
                  )}
                </div>

                <div className="mfds-task-meta">
                  <div>
                    <UserRound size={16} />
                    <span>{task.owner}</span>
                  </div>
                  <div>
                    <CalendarDays size={16} />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                </div>

                <div className="mfds-task-card-footer">
                  <button
                    type="button"
                    className="mfds-task-details-button"
                    onClick={() => setSelectedTask(task)}
                  >
                    Ver detalhes
                  </button>

                  <label className="mfds-task-quick-status">
                    <span className="mfds-sr-only">
                      Alterar status de {task.title}
                    </span>
                    <select
                      aria-label={`Alterar status de ${task.title}`}
                      value={task.status}
                      onChange={(event) =>
                        updateTaskStatus(
                          task.id,
                          event.target.value as TaskStatus,
                        )
                      }
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mfds-tasks-empty">
            <div className="mfds-tasks-empty-icon">
              <Search size={24} />
            </div>
            <h3>Nenhuma tarefa encontrada</h3>
            <p>
              Tente alterar a pesquisa ou ajustar os filtros selecionados.
            </p>
            <button
              type="button"
              className="mfds-tasks-button mfds-tasks-button-secondary"
              onClick={() => {
                setSearch("");
                setStatusFilter("Todos");
                setPriorityFilter("Todas");
              }}
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      {showCreateModal && (
        <TaskModal
          onClose={() => setShowCreateModal(false)}
          onCreate={createTask}
        />
      )}

      {selectedTask && (
        <div
          className="mfds-tasks-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedTask(null);
            }
          }}
        >
          <section
            className="mfds-tasks-modal mfds-tasks-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="task-details-title"
          >
            <div className="mfds-tasks-modal-header">
              <div>
                <span className="mfds-tasks-eyebrow">DETALHES DA TAREFA</span>
                <h2 id="task-details-title">{selectedTask.title}</h2>
                <p>Consulte os dados e atualize o andamento da atividade.</p>
              </div>

              <button
                type="button"
                className="mfds-tasks-icon-button"
                onClick={() => setSelectedTask(null)}
                aria-label="Fechar detalhes"
              >
                <X size={20} />
              </button>
            </div>

            <p className="mfds-tasks-details-description">
              {selectedTask.description || "Nenhuma descrição informada."}
            </p>

            <div className="mfds-tasks-details-grid">
              <div>
                <span>Projeto</span>
                <strong>{selectedTask.project}</strong>
              </div>
              <div>
                <span>Responsável</span>
                <strong>{selectedTask.owner}</strong>
              </div>
              <div>
                <span>Prioridade</span>
                <strong
                  className={`mfds-task-priority ${priorityClass(selectedTask.priority)}`}
                >
                  {selectedTask.priority}
                </strong>
              </div>
              <div>
                <span>Prazo</span>
                <strong>{formatDate(selectedTask.dueDate)}</strong>
              </div>
            </div>

            <label className="mfds-tasks-field mfds-tasks-details-status">
              Status da tarefa
              <select
                value={selectedTask.status}
                onChange={(event) =>
                  updateTaskStatus(
                    selectedTask.id,
                    event.target.value as TaskStatus,
                  )
                }
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>

            {isOverdue(selectedTask) && (
              <p className="mfds-tasks-overdue-note">
                Esta tarefa está com prazo vencido e ainda não foi concluída.
              </p>
            )}

            <div className="mfds-tasks-modal-actions">
              <button
                type="button"
                className="mfds-tasks-button mfds-tasks-button-primary"
                onClick={() => setSelectedTask(null)}
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

import { useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Blocks,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Command,
  Compass,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  ListTodo,
  Menu,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import '../App.css';

type Task = {
  id: number;
  title: string;
  project: string;
  priority: "Alta" | "Média" | "Baixa";
  done: boolean;
};

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Definir a estrutura inicial do projeto",
    project: "MFDS Workspace",
    priority: "Alta",
    done: false,
  },
  {
    id: 2,
    title: "Organizar os requisitos do MVP",
    project: "Planejamento",
    priority: "Alta",
    done: false,
  },
  {
    id: 3,
    title: "Revisar as referências visuais",
    project: "Design e experiência",
    priority: "Média",
    done: true,
  },
  {
    id: 4,
    title: "Preparar o ambiente de desenvolvimento",
    project: "MFDS Workspace",
    priority: "Baixa",
    done: false,
  },
];

const projects = [
  {
    name: "MFDS Workspace",
    category: "Produto principal",
    progress: 35,
    color: "mint",
    icon: Blocks,
  },
  {
    name: "Assistente de ideias",
    category: "Inteligência artificial",
    progress: 20,
    color: "violet",
    icon: Lightbulb,
  },
  {
    name: "Automação de processos",
    category: "Produtividade",
    progress: 12,
    color: "amber",
    icon: Zap,
  },
];

const navigation = [
  { label: "Visão geral", icon: LayoutDashboard },
  { label: "Projetos", icon: FolderKanban },
  { label: "Minhas tarefas", icon: ListTodo },
  { label: "Ideias", icon: Lightbulb },
  { label: "Automações", icon: Zap },
];

function App() {
  const [activePage, setActivePage] = useState("Visão geral");
  const [tasks, setTasks] = useState(initialTasks);
  const [idea, setIdea] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const completedTasks = tasks.filter((task) => task.done).length;
  const pendingTasks = tasks.filter((task) => !task.done).length;

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    );
  }

  function addTask() {
    const title = newTaskTitle.trim();

    if (!title) return;

    setTasks((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((task) => task.id)) + 1,
        title,
        project: "MFDS Workspace",
        priority: "Média",
        done: false,
      },
    ]);

    setNewTaskTitle("");
    setShowNewTask(false);
    setNotice("Tarefa adicionada nesta demonstração.");
  }

  function handleIdeaSubmit() {
    if (!idea.trim()) {
      setNotice("Escreva uma ideia ou um desafio primeiro.");
      return;
    }

    setNotice(
      "Esta é uma interface demonstrativa. A integração com IA será criada em um tutorial posterior.",
    );
  }

  function selectPage(label: string) {
    setActivePage(label);
    setMobileMenuOpen(false);

    if (label !== "Visão geral") {
      setNotice(
        `A área "${label}" terá sua própria implementação em um próximo tutorial.`,
      );
    } else {
      setNotice("");
    }
  }

  return (
    <div className="app-shell">
      {mobileMenuOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <a
          className="brand"
          href="#"
          onClick={(event) => {
            event.preventDefault();
            selectPage("Visão geral");
          }}
        >
          <span className="brand-mark">
            <Command size={22} strokeWidth={2.4} />
          </span>
          <span className="brand-copy">
            <strong>mfds</strong>
            <span>WORKSPACE</span>
          </span>
        </a>

        <div className="workspace-switcher">
          <span className="workspace-avatar">M</span>
          <span className="workspace-info">
            <strong>Meu workspace</strong>
            <small>Plano de desenvolvimento</small>
          </span>
          <ChevronDown size={16} />
        </div>

        <div className="nav-section-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`nav-link ${
                  activePage === item.label ? "nav-link-active" : ""
                }`}
                onClick={() => selectPage(item.label)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.label === "Minhas tarefas" && (
                  <span className="nav-count">{pendingTasks}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="nav-section-label tools-label">PREFERÊNCIAS</div>
        <nav className="main-nav" aria-label="Preferências">
          <button
            className={`nav-link ${
              activePage === "Configurações" ? "nav-link-active" : ""
            }`}
            onClick={() => selectPage("Configurações")}
          >
            <Settings2 size={18} />
            <span>Configurações</span>
          </button>
          <button
            className="nav-link"
            onClick={() =>
              setNotice("A central de ajuda será implementada posteriormente.")
            }
          >
            <CircleHelp size={18} />
            <span>Ajuda e suporte</span>
          </button>
        </nav>

        <div className="sidebar-spacer" />

        <div className="sidebar-tip">
          <div className="tip-icon">
            <Sparkles size={18} />
          </div>
          <strong>Uma ideia de cada vez.</strong>
          <p>Transforme seus objetivos em pequenos passos possíveis.</p>
          <button onClick={() => selectPage("Ideias")}>
            Explorar ideias <ArrowRight size={14} />
          </button>
        </div>

        <div className="profile-row">
          <div className="profile-avatar">MF</div>
          <div className="profile-copy">
            <strong>Meu perfil</strong>
            <span>Espaço pessoal</span>
          </div>
          <MoreHorizontal size={19} />
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Abrir menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{activePage}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <button
              className={`search-button ${searchOpen ? "search-button-active" : ""}`}
              onClick={() => setSearchOpen((open) => !open)}
            >
              <Search size={17} />
              <span>Buscar</span>
              <kbd>⌘ K</kbd>
            </button>
            <button
              className="icon-button notification-button"
              aria-label="Notificações"
              onClick={() =>
                setNotice("Você não tem notificações novas nesta demonstração.")
              }
            >
              <Bell size={19} />
              <span className="notification-dot" />
            </button>
            <div className="topbar-avatar">MF</div>
          </div>
        </header>

        {searchOpen && (
          <div className="search-panel">
            <Search size={18} />
            <input
              autoFocus
              placeholder="Buscar projetos, tarefas ou ideias..."
              onKeyDown={(event) => {
                if (event.key === "Escape") setSearchOpen(false);
              }}
            />
            <button
              className="icon-button"
              onClick={() => setSearchOpen(false)}
            >
              <X size={17} />
            </button>
          </div>
        )}

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                SEU ESPAÇO DE CRIAÇÃO
              </div>
              <h1>
                Vamos fazer acontecer<span>.</span>
              </h1>
              <p className="welcome-subtitle">
                Organize suas ideias, avance nos projetos e concentre-se no que
                importa.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => setShowNewTask(true)}
            >
              <Plus size={18} />
              Nova tarefa
            </button>
          </section>

          {notice && (
            <div className="notice-banner" role="status">
              <span>{notice}</span>
              <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
                <X size={16} />
              </button>
            </div>
          )}

          {activePage !== "Visão geral" && (
            <div className="section-placeholder">
              <div className="placeholder-icon">
                <Compass size={24} />
              </div>
              <h2>{activePage}</h2>
              <p>
                Esta área está planejada para os próximos tutoriais. Por
                enquanto, você pode explorar a visão geral.
              </p>
              <button
                className="secondary-button"
                onClick={() => selectPage("Visão geral")}
              >
                Voltar à visão geral <ArrowRight size={16} />
              </button>
            </div>
          )}

          {activePage === "Visão geral" && (
            <>
              <section
                className="stats-grid"
                aria-label="Indicadores do workspace"
              >
                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Projetos ativos</span>
                    <span className="stat-icon stat-icon-mint">
                      <FolderKanban size={19} />
                    </span>
                  </div>
                  <div className="stat-number">03</div>
                  <div className="stat-foot">
                    <span className="stat-neutral">Em andamento</span>
                    <span className="stat-foot-note">dados demonstrativos</span>
                  </div>
                  <div className="stat-decoration decoration-mint" />
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Tarefas pendentes</span>
                    <span className="stat-icon stat-icon-amber">
                      <ListTodo size={19} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {String(pendingTasks).padStart(2, "0")}
                  </div>
                  <div className="stat-foot">
                    <span className="stat-neutral">Para continuar</span>
                    <span className="stat-foot-note">
                      lista de demonstração
                    </span>
                  </div>
                  <div className="stat-decoration decoration-amber" />
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Tarefas concluídas</span>
                    <span className="stat-icon stat-icon-blue">
                      <Check size={19} />
                    </span>
                  </div>
                  <div className="stat-number">
                    {String(completedTasks).padStart(2, "0")}
                  </div>
                  <div className="stat-foot">
                    <span className="stat-positive">
                      <ArrowUpRight size={14} /> Concluídas
                    </span>
                    <span className="stat-foot-note">nesta demonstração</span>
                  </div>
                  <div className="stat-decoration decoration-blue" />
                </article>

                <article className="stat-card">
                  <div className="stat-top">
                    <span className="stat-label">Ritmo de execução</span>
                    <span className="stat-icon stat-icon-violet">
                      <Activity size={19} />
                    </span>
                  </div>
                  <div className="stat-number">
                    Foco<span className="stat-word-dot">.</span>
                  </div>
                  <div className="stat-foot">
                    <span className="stat-neutral">Um passo por vez</span>
                  </div>
                  <div className="stat-decoration decoration-violet" />
                </article>
              </section>

              <section className="content-grid">
                <div className="main-column">
                  <section className="panel projects-panel">
                    <div className="panel-heading">
                      <div>
                        <div className="section-kicker">ACOMPANHAMENTO</div>
                        <h2>Seus projetos</h2>
                        <p>Ideias em movimento, um passo de cada vez.</p>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => selectPage("Projetos")}
                      >
                        Ver projetos <ArrowRight size={15} />
                      </button>
                    </div>

                    <div className="projects-list">
                      {projects.map((project) => {
                        const Icon = project.icon;
                        return (
                          <article className="project-row" key={project.name}>
                            <div
                              className={`project-icon project-${project.color}`}
                            >
                              <Icon size={21} />
                            </div>
                            <div className="project-details">
                              <div className="project-title-row">
                                <h3>{project.name}</h3>
                                <span className="project-percent">
                                  {project.progress}%
                                </span>
                              </div>
                              <span className="project-category">
                                {project.category}
                              </span>
                              <div
                                className="progress-track"
                                role="progressbar"
                                aria-label={`Progresso de ${project.name}`}
                                aria-valuenow={project.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <span
                                  className={`progress-fill progress-${project.color}`}
                                  style={{ width: `${project.progress}%` }}
                                />
                              </div>
                            </div>
                            <button
                              className="project-more icon-button"
                              aria-label={`Abrir projeto ${project.name}`}
                              onClick={() => selectPage("Projetos")}
                            >
                              <ArrowUpRight size={17} />
                            </button>
                          </article>
                        );
                      })}
                    </div>
                    <button
                      className="add-project-button"
                      onClick={() => selectPage("Projetos")}
                    >
                      <Plus size={16} /> Explorar área de projetos
                    </button>
                  </section>

                  <section className="panel tasks-panel">
                    <div className="panel-heading">
                      <div>
                        <div className="section-kicker">PRÓXIMAS AÇÕES</div>
                        <h2>
                          Minhas tarefas{" "}
                          <span className="heading-count">{pendingTasks}</span>
                        </h2>
                        <p>Pequenos avanços também contam.</p>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => selectPage("Minhas tarefas")}
                      >
                        Ver todas <ArrowRight size={15} />
                      </button>
                    </div>

                    {showNewTask && (
                      <form
                        className="new-task-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          addTask();
                        }}
                      >
                        <input
                          autoFocus
                          value={newTaskTitle}
                          onChange={(event) =>
                            setNewTaskTitle(event.target.value)
                          }
                          placeholder="O que você precisa fazer?"
                          aria-label="Título da nova tarefa"
                        />
                        <button
                          className="primary-button small-button"
                          type="submit"
                        >
                          Adicionar
                        </button>
                        <button
                          className="icon-button"
                          type="button"
                          aria-label="Cancelar"
                          onClick={() => setShowNewTask(false)}
                        >
                          <X size={17} />
                        </button>
                      </form>
                    )}

                    <div className="task-list">
                      {tasks.map((task) => (
                        <article
                          className={`task-row ${task.done ? "task-done" : ""}`}
                          key={task.id}
                        >
                          <button
                            className={`task-checkbox ${task.done ? "task-checkbox-checked" : ""}`}
                            aria-label={
                              task.done ? "Reabrir tarefa" : "Concluir tarefa"
                            }
                            aria-pressed={task.done}
                            onClick={() => toggleTask(task.id)}
                          >
                            {task.done && <Check size={13} />}
                          </button>
                          <div className="task-details">
                            <span className="task-title">{task.title}</span>
                            <span className="task-project">{task.project}</span>
                          </div>
                          <span
                            className={`priority priority-${task.priority.toLowerCase()}`}
                          >
                            <span /> {task.priority}
                          </span>
                        </article>
                      ))}
                    </div>

                    <button
                      className="add-task-link"
                      onClick={() => setShowNewTask(true)}
                    >
                      <Plus size={16} /> Adicionar uma tarefa
                    </button>
                  </section>
                </div>

                <aside className="right-column">
                  <section className="focus-card">
                    <div className="focus-card-top">
                      <div className="focus-symbol">
                        <Target size={22} />
                      </div>
                      <span className="focus-label">SEU FOCO</span>
                    </div>
                    <h2>O progresso começa com o próximo passo.</h2>
                    <p>Escolha uma tarefa pequena e dê a ela sua atenção.</p>
                    <div className="focus-divider" />
                    <div className="focus-foot">
                      <Clock3 size={15} />
                      <span>Seu ritmo, suas prioridades.</span>
                    </div>
                    <div className="focus-orb focus-orb-one" />
                    <div className="focus-orb focus-orb-two" />
                  </section>

                  <section className="panel assistant-panel">
                    <div className="assistant-heading">
                      <span className="assistant-icon">
                        <WandSparkles size={19} />
                      </span>
                      <div>
                        <h2>Espaço de ideias</h2>
                        <p>Comece por uma pergunta.</p>
                      </div>
                    </div>
                    <label className="idea-label" htmlFor="idea-input">
                      O que está tentando resolver?
                    </label>
                    <textarea
                      id="idea-input"
                      value={idea}
                      onChange={(event) => setIdea(event.target.value)}
                      placeholder="Tenho uma ideia, mas preciso organizar os próximos passos..."
                      rows={4}
                    />
                    <button className="idea-submit" onClick={handleIdeaSubmit}>
                      <Sparkles size={16} />
                      Explorar minha ideia
                      <ArrowRight size={15} />
                    </button>
                    <p className="assistant-disclaimer">
                      <ShieldCheck size={14} />
                      Assistência por IA disponível em uma etapa futura.
                    </p>
                  </section>

                  <section className="mini-note">
                    <div className="mini-note-icon">
                      <Lightbulb size={18} />
                    </div>
                    <div>
                      <strong>Uma ideia para lembrar</strong>
                      <p>
                        Não é preciso resolver tudo hoje. Comece pelo que pode
                        fazer agora.
                      </p>
                    </div>
                    <ArrowDownRight className="mini-note-arrow" size={17} />
                  </section>

                  <div className="demo-disclaimer">
                    <ShieldCheck size={14} />
                    <span>
                      Esta versão utiliza dados demonstrativos, sem conta ou
                      banco de dados.
                    </span>
                  </div>
                </aside>
              </section>

              <footer className="page-footer">
                <span>
                  MFDS Workspace <span className="footer-dot">·</span> Base
                  inicial
                </span>
                <span>Feito para transformar intenção em ação.</span>
              </footer>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;

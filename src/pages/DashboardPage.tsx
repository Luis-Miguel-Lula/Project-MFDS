import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  CircleCheck,
  CircleCheckBig,
  Clock3,
  Lightbulb,
  Plus,
  ShieldCheck,
  Sparkles,
  Target,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import '../App.css';
import '../styles/dashboard-cards.css';

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
    project: "Nexora",
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
    project: "Nexora",
    priority: "Baixa",
    done: false,
  },
];

const projects = [
  {
    name: "Nexora",
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

function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);
  const [idea, setIdea] = useState("");
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
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
        project: "Nexora",
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

  return (
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

          <>
              <section className="nx-grid" aria-label="Indicadores do workspace">
                <Link to="/projetos" className="nx-card nx-green nx-span-2">
                  <div className="nx-tile"><Blocks size={21} /></div>
                  <div className="nx-body">
                    <p className="nx-label">Projetos ativos</p>
                    <p className="nx-number">03</p>
                  </div>
                  <div className="nx-foot">
                    <ArrowUpRight size={16} />
                    <strong>Em andamento</strong>
                    <span>dados demonstrativos</span>
                  </div>
                  <Blocks className="nx-mark" size={190} strokeWidth={1.3} aria-hidden="true" />
                </Link>

                <Link to="/tarefas" className="nx-card nx-orange nx-span-2">
                  <div className="nx-tile"><CircleCheck size={21} /></div>
                  <div className="nx-body">
                    <p className="nx-label">Tarefas pendentes</p>
                    <p className="nx-number">{String(pendingTasks).padStart(2, "0")}</p>
                  </div>
                  <div className="nx-foot">
                    <ArrowUpRight size={16} />
                    <strong>Para continuar</strong>
                    <span>lista de demonstração</span>
                  </div>
                  <CircleCheck className="nx-mark" size={190} strokeWidth={1.3} aria-hidden="true" />
                </Link>

                <Link to="/tarefas" className="nx-card nx-blue nx-span-2">
                  <div className="nx-tile"><CircleCheckBig size={21} /></div>
                  <div className="nx-body">
                    <p className="nx-label">Tarefas concluídas</p>
                    <p className="nx-number">{String(completedTasks).padStart(2, "0")}</p>
                  </div>
                  <div className="nx-foot">
                    <ArrowUpRight size={16} />
                    <strong>Concluídas</strong>
                    <span>nesta demonstração</span>
                  </div>
                  <CircleCheckBig className="nx-mark" size={190} strokeWidth={1.3} aria-hidden="true" />
                </Link>

                <article className="nx-card nx-card-hover nx-purple nx-span-3">
                  <div className="nx-tile"><Clock3 size={21} /></div>
                  <div className="nx-body">
                    <p className="nx-label">Ritmo de execução</p>
                    <p className="nx-title">Foco.</p>
                  </div>
                  <div className="nx-foot">
                    <ArrowUpRight size={16} />
                    <strong>Um passo por vez</strong>
                  </div>
                  <Clock3 className="nx-mark" size={200} strokeWidth={1.2} aria-hidden="true" />
                </article>

                <article className="nx-card nx-card-hover nx-teal nx-span-3">
                  <div className="nx-tile"><Target size={21} /></div>
                  <div className="nx-hero-row">
                    <div className="nx-body">
                      <p className="nx-label">Acompanhamento</p>
                      <p className="nx-title">Seus projetos</p>
                      <p className="nx-text">Ideias em movimento, um passo de cada vez.</p>
                    </div>
                    <button className="nx-pill" onClick={() => navigate("/projetos")}>
                      Ver projetos <ArrowRight size={15} />
                    </button>
                  </div>
                  <Target className="nx-mark" size={200} strokeWidth={1.2} aria-hidden="true" />
                </article>
              </section>

              <section className="content-grid">
                <div className="main-column">
                  <section className="panel projects-panel">
                    <div className="panel-heading">
                      <div>
                        <div className="section-kicker">PROGRESSO</div>
                        <h2>Andamento por projeto</h2>
                        <p>Acompanhe cada frente em um só lugar.</p>
                      </div>
                      <button
                        className="text-button"
                        onClick={() => navigate("/projetos")}
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
                              onClick={() => navigate("/projetos")}
                            >
                              <ArrowUpRight size={17} />
                            </button>
                          </article>
                        );
                      })}
                    </div>
                    <button
                      className="add-project-button"
                      onClick={() => navigate("/projetos")}
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
                        onClick={() => navigate("/tarefas")}
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
                  Nexora <span className="footer-dot">·</span> Base
                  inicial
                </span>
                <span>Feito para transformar intenção em ação.</span>
              </footer>
          </>
    </div>
  );
}

export default App;

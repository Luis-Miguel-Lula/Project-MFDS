import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Lightbulb, Pencil, Plus, Search, ThumbsUp, Trash2, X } from "lucide-react";
import "../styles/ideas.css";

type Status = "nova" | "analise" | "aprovada" | "descartada";
type Idea = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: Status;
  votes: number;
  createdAt: number;
};

const STORAGE_KEY = "nexora:ideias";
const categories = ["Produto", "Processo", "Marketing", "Tecnologia", "Outro"];
const statusLabel: Record<Status, string> = {
  nova: "Nova",
  analise: "Em análise",
  aprovada: "Aprovada",
  descartada: "Descartada",
};
const statuses = Object.keys(statusLabel) as Status[];

function load(): Idea[] {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(raw) ? (raw as Idea[]) : [];
  } catch {
    return [];
  }
}

const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>(load);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Status | "todas">("todas");
  const [sort, setSort] = useState<"recentes" | "votadas">("recentes");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
    } catch {
      /* sem armazenamento: as ideias valem só nesta sessão */
    }
  }, [ideas]);

  useEffect(() => {
    if (formOpen) titleRef.current?.focus();
  }, [formOpen, editingId]);

  const counts = useMemo(
    () => ({
      total: ideas.length,
      analise: ideas.filter((i) => i.status === "analise").length,
      aprovada: ideas.filter((i) => i.status === "aprovada").length,
      votes: ideas.reduce((sum, i) => sum + i.votes, 0),
    }),
    [ideas],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return ideas
      .filter((i) => filter === "todas" || i.status === filter)
      .filter((i) => !term || `${i.title} ${i.description} ${i.category}`.toLowerCase().includes(term))
      .sort((a, b) => (sort === "votadas" ? b.votes - a.votes || b.createdAt - a.createdAt : b.createdAt - a.createdAt));
  }, [ideas, query, filter, sort]);

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory(categories[0]);
    setError("");
  }

  function startEdit(idea: Idea) {
    setEditingId(idea.id);
    setTitle(idea.title);
    setDescription(idea.description);
    setCategory(idea.category);
    setError("");
    setFormOpen(true);
  }

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const clean = title.trim();
    if (clean.length < 3) {
      setError("Dê um título com pelo menos 3 caracteres.");
      titleRef.current?.focus();
      return;
    }
    if (editingId) {
      setIdeas((list) =>
        list.map((i) => (i.id === editingId ? { ...i, title: clean, description: description.trim(), category } : i)),
      );
    } else {
      setIdeas((list) => [
        { id: crypto.randomUUID(), title: clean, description: description.trim(), category, status: "nova", votes: 0, createdAt: Date.now() },
        ...list,
      ]);
    }
    closeForm();
  }

  const patch = (id: string, change: Partial<Idea>) =>
    setIdeas((list) => list.map((i) => (i.id === id ? { ...i, ...change } : i)));

  return (
    <section className="ideas-page">
      <header className="ideas-heading">
        <div>
          <span className="ideas-eyebrow">Criatividade</span>
          <h1>Ideias</h1>
          <p>Registre, avalie e priorize propostas antes de transformá-las em projetos.</p>
        </div>
        <button className="primary-button" onClick={() => (formOpen ? closeForm() : setFormOpen(true))}>
          {formOpen ? <X size={15} /> : <Plus size={15} />}
          {formOpen ? "Cancelar" : "Nova ideia"}
        </button>
      </header>

      <div className="ideas-stats">
        {[
          ["Total", counts.total],
          ["Em análise", counts.analise],
          ["Aprovadas", counts.aprovada],
          ["Votos", counts.votes],
        ].map(([label, value]) => (
          <div className="ideas-stat" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {formOpen && (
        <form
          className="ideas-form"
          onSubmit={submit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submit();
          }}
          noValidate
        >
          <h2>{editingId ? "Editar ideia" : "Nova ideia"}</h2>
          <label>
            Título
            <input
              ref={titleRef}
              className="ui-field"
              value={title}
              maxLength={90}
              aria-invalid={error ? "true" : undefined}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError("");
              }}
              placeholder="Qual é a ideia?"
            />
            {error && <p className="ui-field-error">{error}</p>}
          </label>
          <label>
            Descrição
            <textarea
              className="ui-field"
              rows={3}
              value={description}
              maxLength={400}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contexto, problema que resolve, próximos passos (opcional)"
            />
          </label>
          <label className="ideas-form-select">
            Categoria
            <select className="ui-field" value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <div className="ideas-form-actions">
            <span>Ctrl + Enter para salvar</span>
            <button type="button" className="secondary-button" onClick={closeForm}>
              Cancelar
            </button>
            <button type="submit" className="primary-button">
              {editingId ? "Salvar alterações" : "Adicionar ideia"}
            </button>
          </div>
        </form>
      )}

      {ideas.length > 0 && (
        <div className="ideas-toolbar">
          <div className="ideas-search">
            <Search size={15} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ideias"
              aria-label="Buscar ideias"
            />
          </div>
          <div className="ideas-chips" role="group" aria-label="Filtrar por status">
            {(["todas", ...statuses] as const).map((s) => (
              <button
                key={s}
                className={`ideas-chip ${filter === s ? "ideas-chip-active" : ""}`}
                aria-pressed={filter === s}
                onClick={() => setFilter(s)}
              >
                {s === "todas" ? "Todas" : statusLabel[s]}
              </button>
            ))}
          </div>
          <select
            className="ui-field ideas-sort"
            value={sort}
            aria-label="Ordenar"
            onChange={(e) => setSort(e.target.value as "recentes" | "votadas")}
          >
            <option value="recentes">Mais recentes</option>
            <option value="votadas">Mais votadas</option>
          </select>
        </div>
      )}

      {ideas.length === 0 ? (
        <div className="ui-empty">
          <Lightbulb size={22} />
          <strong>Nenhuma ideia registrada</strong>
          <p>Anote a primeira ideia antes que ela escape. Você pode avaliá-la e votar depois.</p>
          <button className="primary-button" onClick={() => setFormOpen(true)}>
            <Plus size={15} /> Nova ideia
          </button>
        </div>
      ) : visible.length === 0 ? (
        <div className="ui-empty">
          <strong>Nada encontrado</strong>
          <p>Nenhuma ideia corresponde à busca ou ao filtro atual.</p>
        </div>
      ) : (
        <ul className="ideas-list">
          {visible.map((idea) => (
            <li key={idea.id} className={`idea-card idea-${idea.status}`}>
              <button
                className="idea-vote"
                aria-label={`Votar em ${idea.title}. Votos: ${idea.votes}`}
                onClick={() => patch(idea.id, { votes: idea.votes + 1 })}
              >
                <ThumbsUp size={15} />
                <strong>{idea.votes}</strong>
              </button>
              <div className="idea-body">
                <h3>{idea.title}</h3>
                {idea.description && <p>{idea.description}</p>}
                <div className="idea-meta">
                  <span className="ui-badge">{idea.category}</span>
                  <span>{dateFmt.format(idea.createdAt)}</span>
                </div>
              </div>
              <div className="idea-actions">
                <select
                  className="ui-field idea-status"
                  value={idea.status}
                  aria-label={`Status de ${idea.title}`}
                  onChange={(e) => patch(idea.id, { status: e.target.value as Status })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>
                <button className="icon-button" aria-label="Editar ideia" onClick={() => startEdit(idea)}>
                  <Pencil size={15} />
                </button>
                {confirmId === idea.id ? (
                  <button
                    className="idea-confirm"
                    onClick={() => {
                      setIdeas((list) => list.filter((i) => i.id !== idea.id));
                      setConfirmId(null);
                    }}
                    onBlur={() => setConfirmId(null)}
                    autoFocus
                  >
                    Confirmar exclusão
                  </button>
                ) : (
                  <button className="icon-button" aria-label="Excluir ideia" onClick={() => setConfirmId(idea.id)}>
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

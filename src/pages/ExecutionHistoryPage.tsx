import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownUp,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileSearch,
  Filter,
  History,
  Search,
  X,
  XCircle,
  LoaderCircle,
} from "lucide-react";
import "../styles/execution-history.css";

type ExecutionStatus = "Sucesso" | "Falha" | "Em andamento";

type ExecutionSource = "Agendamento" | "Manual" | "Evento";

type ExecutionRecord = {
  id: number;
  automationName: string;
  status: ExecutionStatus;
  source: ExecutionSource;
  startedAt: string;
  durationSeconds: number | null;
  summary: string;
};

type PeriodFilter = "Todos" | "Hoje" | "7 dias";

const initialExecutions: ExecutionRecord[] = [
  {
    id: 1001,
    automationName: "Resumo semanal do projeto",
    status: "Sucesso",
    source: "Agendamento",
    startedAt: "2026-10-22T09:15:00",
    durationSeconds: 18,
    summary:
      "Execução demonstrativa concluída sem erros. O resumo foi gerado no cenário de exemplo.",
  },
  {
    id: 1002,
    automationName: "Aviso de tarefa concluída",
    status: "Sucesso",
    source: "Evento",
    startedAt: "2026-10-22T08:42:00",
    durationSeconds: 4,
    summary:
      "Execução demonstrativa concluída. A notificação representa um resultado fictício.",
  },
  {
    id: 1003,
    automationName: "Organização inicial do projeto",
    status: "Falha",
    source: "Manual",
    startedAt: "2026-10-21T16:30:00",
    durationSeconds: 7,
    summary:
      "Falha simulada para demonstrar o estado de erro. Nenhum serviço externo foi chamado.",
  },
  {
    id: 1004,
    automationName: "Planejamento de próximas tarefas",
    status: "Em andamento",
    source: "Manual",
    startedAt: "2026-10-21T14:05:00",
    durationSeconds: null,
    summary:
      "Registro demonstrativo em andamento. Não representa um processo real em execução.",
  },
  {
    id: 1005,
    automationName: "Resumo semanal do projeto",
    status: "Sucesso",
    source: "Agendamento",
    startedAt: "2026-10-20T09:15:00",
    durationSeconds: 21,
    summary: "Execução demonstrativa concluída com sucesso.",
  },
  {
    id: 1006,
    automationName: "Aviso de tarefa concluída",
    status: "Falha",
    source: "Evento",
    startedAt: "2026-10-19T11:20:00",
    durationSeconds: 3,
    summary:
      "Falha demonstrativa. A mensagem existe apenas para ilustrar o histórico.",
  },
];

function formatDateTime(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(seconds: number | null) {
  if (seconds === null) {
    return "—";
  }

  if (seconds < 60) {
    return `${seconds} s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes} min ${remainingSeconds} s`;
}

function getStatusClass(status: ExecutionStatus) {
  switch (status) {
    case "Sucesso":
      return "is-success";
    case "Falha":
      return "is-failure";
    case "Em andamento":
      return "is-running";
  }
}

function StatusIcon({ status }: { status: ExecutionStatus }) {
  if (status === "Sucesso") {
    return <CheckCircle2 size={16} aria-hidden="true" />;
  }

  if (status === "Falha") {
    return <XCircle size={16} aria-hidden="true" />;
  }

  return <LoaderCircle size={16} aria-hidden="true" />;
}

export default function ExecutionHistoryPage() {
  const [records] = useState<ExecutionRecord[]>(initialExecutions);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [periodFilter, setPeriodFilter] = useState<PeriodFilter>("Todos");
  const [selectedRecord, setSelectedRecord] = useState<ExecutionRecord | null>(
    null,
  );
  const [sortNewestFirst, setSortNewestFirst] = useState(true);

  const successCount = records.filter(
    (record) => record.status === "Sucesso",
  ).length;

  const failureCount = records.filter(
    (record) => record.status === "Falha",
  ).length;

  const runningCount = records.filter(
    (record) => record.status === "Em andamento",
  ).length;

  const visibleRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    const now = new Date();

    const filtered = records.filter((record) => {
      const matchesSearch = [
        record.automationName,
        record.summary,
        record.source,
        String(record.id),
      ].some((value) => value.toLowerCase().includes(query));

      const matchesStatus =
        statusFilter === "Todos" || record.status === statusFilter;

      const executionDate = new Date(record.startedAt);
      const ageInDays =
        (now.getTime() - executionDate.getTime()) / (1000 * 60 * 60 * 24);

      const matchesPeriod =
        periodFilter === "Todos" ||
        (periodFilter === "Hoje" &&
          executionDate.toDateString() === now.toDateString()) ||
        (periodFilter === "7 dias" && ageInDays >= 0 && ageInDays <= 7);

      return matchesSearch && matchesStatus && matchesPeriod;
    });

    return filtered.sort((a, b) => {
      const difference =
        new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime();

      return sortNewestFirst ? -difference : difference;
    });
  }, [records, search, statusFilter, periodFilter, sortNewestFirst]);

  function clearFilters() {
    setSearch("");
    setStatusFilter("Todos");
    setPeriodFilter("Todos");
  }

  return (
    <main className="mfds-execution-history">
      <div className="mfds-execution-history__topline">
        <div className="mfds-execution-history__breadcrumb">
          <span>Workspace</span>
          <ArrowRight size={14} aria-hidden="true" />
          <span>Automações</span>
          <ArrowRight size={14} aria-hidden="true" />
          <span>Histórico</span>
        </div>

        <span className="mfds-execution-history__demo-label">
          <span />
          Dados demonstrativos
        </span>
      </div>

      <header className="mfds-execution-history__header">
        <div>
          <div className="mfds-execution-history__eyebrow">
            <History size={15} aria-hidden="true" />
            MONITORAMENTO
          </div>

          <h1>Histórico de execuções</h1>

          <p>
            Consulte os resultados e os detalhes dos registros de execução das
            suas automações.
          </p>
        </div>
      </header>

      <section
        className="mfds-execution-history__metrics"
        aria-label="Indicadores do histórico"
      >
        <article className="mfds-execution-history__metric">
          <div className="metric-icon metric-purple">
            <Activity size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Total de registros</span>
            <strong>{records.length}</strong>
            <small>Dados de demonstração</small>
          </div>
        </article>

        <article className="mfds-execution-history__metric">
          <div className="metric-icon metric-green">
            <CheckCircle2 size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Sucesso</span>
            <strong>{successCount}</strong>
            <small>Resultados demonstrativos</small>
          </div>
        </article>

        <article className="mfds-execution-history__metric">
          <div className="metric-icon metric-red">
            <XCircle size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Falhas</span>
            <strong>{failureCount}</strong>
            <small>Resultados demonstrativos</small>
          </div>
        </article>

        <article className="mfds-execution-history__metric">
          <div className="metric-icon metric-blue">
            <Clock3 size={20} aria-hidden="true" />
          </div>
          <div>
            <span>Em andamento</span>
            <strong>{runningCount}</strong>
            <small>Estado de exemplo</small>
          </div>
        </article>
      </section>

      <section className="mfds-execution-history__panel">
        <div className="mfds-execution-history__panel-heading">
          <div>
            <h2>Registros de execução</h2>
            <p>Consulte o resultado, a origem e a duração de cada registro.</p>
          </div>

          <span className="mfds-execution-history__result-count">
            {visibleRecords.length}{" "}
            {visibleRecords.length === 1 ? "registro" : "registros"}
          </span>
        </div>

        <div className="mfds-execution-history__filters">
          <label className="mfds-execution-history__search">
            <Search size={18} aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar automação ou ID..."
              aria-label="Buscar no histórico"
            />
          </label>

          <label className="mfds-execution-history__select">
            <Filter size={15} aria-hidden="true" />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filtrar por resultado"
            >
              <option value="Todos">Todos os resultados</option>
              <option value="Sucesso">Sucesso</option>
              <option value="Falha">Falha</option>
              <option value="Em andamento">Em andamento</option>
            </select>
          </label>

          <label className="mfds-execution-history__select">
            <CalendarClock size={15} aria-hidden="true" />
            <select
              value={periodFilter}
              onChange={(event) =>
                setPeriodFilter(event.target.value as PeriodFilter)
              }
              aria-label="Filtrar por período"
            >
              <option value="Todos">Todo o período</option>
              <option value="Hoje">Hoje</option>
              <option value="7 dias">Últimos 7 dias</option>
            </select>
          </label>

          <button
            type="button"
            className="mfds-execution-history__sort"
            onClick={() => setSortNewestFirst((current) => !current)}
            aria-label={
              sortNewestFirst
                ? "Ordenar do mais antigo para o mais recente"
                : "Ordenar do mais recente para o mais antigo"
            }
          >
            <ArrowDownUp size={16} aria-hidden="true" />
            {sortNewestFirst ? "Mais recentes" : "Mais antigos"}
          </button>
        </div>

        {visibleRecords.length > 0 ? (
          <>
            <div className="mfds-execution-history__table-wrap">
              <table className="mfds-execution-history__table">
                <thead>
                  <tr>
                    <th>Automação</th>
                    <th>Resultado</th>
                    <th>Início</th>
                    <th>Origem</th>
                    <th>Duração</th>
                    <th>
                      <span className="sr-only">Detalhes</span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div className="mfds-execution-history__automation-cell">
                          <span className="mfds-execution-history__automation-icon">
                            <Activity size={17} aria-hidden="true" />
                          </span>
                          <span>
                            <strong>{record.automationName}</strong>
                            <small>Execução #{record.id}</small>
                          </span>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`mfds-execution-history__status ${getStatusClass(
                            record.status,
                          )}`}
                        >
                          <StatusIcon status={record.status} />
                          {record.status}
                        </span>
                      </td>

                      <td>
                        <span className="mfds-execution-history__date">
                          {formatDateTime(record.startedAt)}
                        </span>
                      </td>

                      <td>
                        <span className="mfds-execution-history__source">
                          {record.source}
                        </span>
                      </td>

                      <td>
                        <span className="mfds-execution-history__duration">
                          {formatDuration(record.durationSeconds)}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="mfds-execution-history__details-button"
                          onClick={() => setSelectedRecord(record)}
                          aria-label={`Ver detalhes da execução ${record.id}`}
                        >
                          Detalhes
                          <ArrowRight size={14} aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mfds-execution-history__mobile-list">
              {visibleRecords.map((record) => (
                <article
                  className="mfds-execution-history__mobile-card"
                  key={record.id}
                >
                  <div className="mfds-execution-history__mobile-card-top">
                    <strong>{record.automationName}</strong>
                    <span
                      className={`mfds-execution-history__status ${getStatusClass(
                        record.status,
                      )}`}
                    >
                      <StatusIcon status={record.status} />
                      {record.status}
                    </span>
                  </div>

                  <p>Execução #{record.id}</p>

                  <div className="mfds-execution-history__mobile-meta">
                    <span>{formatDateTime(record.startedAt)}</span>
                    <span>{record.source}</span>
                    <span>{formatDuration(record.durationSeconds)}</span>
                  </div>

                  <button
                    type="button"
                    className="mfds-execution-history__details-button"
                    onClick={() => setSelectedRecord(record)}
                  >
                    Ver detalhes
                    <ArrowRight size={14} aria-hidden="true" />
                  </button>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="mfds-execution-history__empty">
            <div>
              <FileSearch size={26} aria-hidden="true" />
            </div>
            <h3>Nenhum registro encontrado</h3>
            <p>
              Altere a pesquisa ou os filtros para consultar outros registros.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mfds-execution-history__clear-button"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </section>

      <aside className="mfds-execution-history__notice">
        <div>
          <History size={19} aria-hidden="true" />
        </div>
        <section>
          <strong>Sobre estes registros</strong>
          <p>
            Este histórico contém dados fictícios para demonstrar a interface.
            Os resultados não representam execuções reais e não são atualizados
            por um serviço de backend.
          </p>
        </section>
      </aside>

      {selectedRecord && (
        <div
          className="mfds-execution-history__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedRecord(null);
            }
          }}
        >
          <section
            className="mfds-execution-history__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="execution-details-title"
          >
            <header className="mfds-execution-history__modal-header">
              <div>
                <span className="mfds-execution-history__eyebrow">
                  DETALHES DO REGISTRO
                </span>
                <h2 id="execution-details-title">
                  {selectedRecord.automationName}
                </h2>
                <p>Execução #{selectedRecord.id}</p>
              </div>

              <button
                type="button"
                className="mfds-execution-history__close"
                aria-label="Fechar detalhes"
                onClick={() => setSelectedRecord(null)}
              >
                <X size={20} aria-hidden="true" />
              </button>
            </header>

            <div className="mfds-execution-history__detail-status">
              <span>Resultado</span>
              <span
                className={`mfds-execution-history__status ${getStatusClass(
                  selectedRecord.status,
                )}`}
              >
                <StatusIcon status={selectedRecord.status} />
                {selectedRecord.status}
              </span>
            </div>

            <div className="mfds-execution-history__detail-grid">
              <div>
                <span>Data e hora de início</span>
                <strong>{formatDateTime(selectedRecord.startedAt)}</strong>
              </div>

              <div>
                <span>Duração</span>
                <strong>
                  {formatDuration(selectedRecord.durationSeconds)}
                </strong>
              </div>

              <div>
                <span>Origem do disparo</span>
                <strong>{selectedRecord.source}</strong>
              </div>

              <div>
                <span>Identificador</span>
                <strong>#{selectedRecord.id}</strong>
              </div>
            </div>

            <section className="mfds-execution-history__summary">
              <h3>Resumo do registro</h3>
              <p>{selectedRecord.summary}</p>
            </section>

            <div className="mfds-execution-history__demo-disclaimer">
              Estes dados são demonstrativos e não correspondem a um histórico
              real do sistema.
            </div>

            <footer className="mfds-execution-history__modal-actions">
              <button type="button" onClick={() => setSelectedRecord(null)}>
                Fechar detalhes
              </button>
            </footer>
          </section>
        </div>
      )}
    </main>
  );
}

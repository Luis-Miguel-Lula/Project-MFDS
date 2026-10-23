import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import IdeasPage from "./pages/IdeasPage";
import AutomationsPage from "./pages/AutomationsPage";
import SettingsPage from "./pages/SettingsPage";
import ExecutionHistoryPage from "./pages/ExecutionHistoryPage";

function NotFoundPage() {
  return (
    <section
      style={{
        maxWidth: 680,
        margin: "70px auto",
        padding: 24,
        textAlign: "center",
      }}
    >
      <p
        style={{
          color: "#6258d9",
          fontWeight: 800,
          letterSpacing: 2,
        }}
      >
        ERRO 404
      </p>

      <h1 style={{ fontSize: 32, color: "#20283a" }}>Página não encontrada</h1>

      <p style={{ color: "#7a8498", lineHeight: 1.8 }}>
        O endereço acessado não corresponde a uma página disponível nesta versão
        da aplicação.
      </p>

      <Link
        to="/"
        style={{
          display: "inline-block",
          marginTop: 16,
          padding: "12px 18px",
          color: "#fff",
          background: "#5146e5",
          borderRadius: 10,
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        Voltar ao dashboard
      </Link>
    </section>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projetos" element={<ProjectsPage />} />
          <Route path="tarefas" element={<TasksPage />} />
          <Route path="ideias" element={<IdeasPage />} />
          <Route path="automacoes" element={<AutomationsPage />} />
          <Route path="configuracoes" element={<SettingsPage />} />
          <Route
            path="/historico-execucoes"
            element={<ExecutionHistoryPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

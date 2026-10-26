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
    <section className="not-found">
      <p className="not-found-code">ERRO 404</p>
      <h1>Página não encontrada</h1>
      <p>
        O endereço acessado não corresponde a uma página disponível nesta
        versão da aplicação.
      </p>
      <Link className="not-found-link" to="/">
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

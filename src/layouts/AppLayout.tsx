
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Activity,
  Bell,
  Bot,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Settings,
  X,
} from 'lucide-react';
import '../styles/navigation.css';

const navigationItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard, end: true },
  { label: 'Projetos', to: '/projetos', icon: FolderKanban },
  { label: 'Tarefas', to: '/tarefas', icon: CheckSquare },
  { label: 'Ideias', to: '/ideias', icon: Lightbulb },
  { label: 'Automações', to: '/automacoes', icon: Bot },
  { label: 'Configurações', to: '/configuracoes', icon: Settings },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`mfds-shell ${collapsed ? 'mfds-collapsed' : ''}`}>
      {sidebarOpen && (
        <button
          className="mfds-backdrop"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`mfds-sidebar ${sidebarOpen ? 'mfds-sidebar-open' : ''}`}>
        <div className="mfds-brand">
          <div className="mfds-brand-mark">
            <Activity size={22} />
          </div>

          <div className="mfds-brand-text">
            <strong>MFDS</strong>
            <span>Workspace</span>
          </div>

          <button
            className="mfds-icon-button mfds-mobile-close"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="mfds-workspace-label">WORKSPACE</div>

        <nav className="mfds-navigation" aria-label="Navegação principal">
          {navigationItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `mfds-nav-link ${isActive ? 'mfds-nav-active' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={19} strokeWidth={1.8} />
              <span className="mfds-nav-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mfds-sidebar-bottom">
          <div className="mfds-plan-card">
            <div className="mfds-plan-icon">
              <Activity size={17} />
            </div>
            <div className="mfds-plan-text">
              <strong>Seu espaço de trabalho</strong>
              <span>Organize seus projetos</span>
            </div>
          </div>

          <button
            className="mfds-collapse-button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!collapsed && <span>Recolher menu</span>}
          </button>
        </div>
      </aside>

      <div className="mfds-main">
        <header className="mfds-topbar">
          <div className="mfds-topbar-left">
            <button
              className="mfds-icon-button mfds-mobile-menu"
              aria-label="Abrir menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={21} />
            </button>

            <div className="mfds-breadcrumb">
              <span>Workspace</span>
              <span className="mfds-breadcrumb-separator">/</span>
              <span className="mfds-breadcrumb-current">
                MFDS
              </span>
            </div>
          </div>

          <div className="mfds-topbar-right">
            <span className="mfds-environment">
              <span className="mfds-status-dot" />
              Ambiente de desenvolvimento
            </span>

            <button
              className="mfds-icon-button"
              aria-label="Notificações demonstrativas"
              title="Notificações demonstrativas"
            >
              <Bell size={19} />
            </button>

            <div className="mfds-avatar" title="Perfil demonstrativo">
              MF
            </div>
          </div>
        </header>

        <main className="mfds-content">
          <Outlet />
        </main>

        <footer className="mfds-footer">
          <span>MFDS Workspace</span>
          <span>Versão inicial · Sprint 1</span>
        </footer>
      </div>
    </div>
  );
}

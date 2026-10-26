import { useEffect, useMemo, useRef, useState } from 'react';
import type { ComponentType } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  History,
  Menu,
  Search,
  Settings2,
  X,
} from 'lucide-react';
import NexoraMark from '../components/NexoraMark';
import {
  AutomationsIcon,
  IdeasIcon,
  OverviewIcon,
  ProjectsIcon,
  TasksIcon,
} from '../components/NavIcons';
import { useSettings } from '../settings/SettingsContext';
import '../styles/navigation.css';

type NavigationItem = {
  label: string;
  to: string;
  icon: ComponentType<{ size?: number }>;
  end?: boolean;
};

const mainItems: NavigationItem[] = [
  { label: 'Visão geral', to: '/', icon: OverviewIcon, end: true },
  { label: 'Projetos', to: '/projetos', icon: ProjectsIcon },
  { label: 'Minhas tarefas', to: '/tarefas', icon: TasksIcon },
  { label: 'Ideias', to: '/ideias', icon: IdeasIcon },
  { label: 'Automações', to: '/automacoes', icon: AutomationsIcon },
  { label: 'Histórico', to: '/historico-execucoes', icon: History },
];

const preferenceItems: NavigationItem[] = [
  { label: 'Configurações', to: '/configuracoes', icon: Settings2 },
];

const allItems = [...mainItems, ...preferenceItems];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { sidebarCollapsed: collapsed, update } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const currentLabel =
    allItems.find((item) =>
      item.end
        ? location.pathname === item.to
        : location.pathname.startsWith(item.to),
    )?.label ?? 'Página não encontrada';

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return allItems;
    return allItems.filter((item) => item.label.toLowerCase().includes(term));
  }, [query]);

  function closeSearch() {
    setSearchOpen(false);
    setQuery('');
  }

  function goTo(to: string) {
    navigate(to);
    closeSearch();
    setSidebarOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape') {
        setSearchOpen(false);
        setQuery('');
        setNotificationsOpen(false);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const closeMobile = () => setSidebarOpen(false);

  function renderLink({ label, to, icon: Icon, end }: NavigationItem) {
    return (
      <NavLink
        key={to}
        to={to}
        end={end}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          `nav-link ${isActive ? 'nav-link-active' : ''}`
        }
        onClick={closeMobile}
      >
        <Icon size={18} />
        <span>{label}</span>
      </NavLink>
    );
  }

  return (
    <div className={`app-shell ${collapsed ? 'app-shell-collapsed' : ''}`}>
      {sidebarOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Fechar menu"
          onClick={closeMobile}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <NavLink className="brand" to="/" end onClick={closeMobile}>
          <span className="brand-mark">
            <NexoraMark size={40} />
          </span>
          <span className="brand-copy">
            <strong>Nexora</strong>
            <span>Seu trabalho. Em movimento.</span>
          </span>
        </NavLink>

        <div className="workspace-switcher">
          <span className="workspace-avatar">M</span>
          <span className="workspace-info">
            <strong>Meu workspace</strong>
            <small>Plano de desenvolvimento</small>
          </span>
        </div>

        <div className="nav-section-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Navegação principal">
          {mainItems.map(renderLink)}
        </nav>

        <div className="nav-section-label tools-label">PREFERÊNCIAS</div>
        <nav className="main-nav" aria-label="Preferências">
          {preferenceItems.map(renderLink)}
        </nav>

        <div className="sidebar-spacer" />


        <button
          className="nav-link sidebar-collapse"
          onClick={() => update('sidebarCollapsed', !collapsed)}
          aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          <span>Recolher menu</span>
        </button>

        <div className="profile-row">
          <div className="profile-avatar">MF</div>
          <div className="profile-copy">
            <strong>Meu perfil</strong>
            <span>Espaço pessoal</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-button mobile-menu-button"
              aria-label="Abrir menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <div className="breadcrumb">
              Workspace <span>/</span> <strong>{currentLabel}</strong>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              className={`search-button ${searchOpen ? 'search-button-active' : ''}`}
              onClick={() => (searchOpen ? closeSearch() : setSearchOpen(true))}
            >
              <Search size={17} />
              <span>Buscar</span>
              <kbd>Ctrl K</kbd>
            </button>

            <div className="notification-wrap">
              <button
                className="icon-button notification-button"
                aria-label="Notificações"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((value) => !value)}
              >
                <Bell size={19} />
              </button>
              {notificationsOpen && (
                <div className="notification-popover" role="status">
                  Nenhuma notificação por enquanto.
                </div>
              )}
            </div>

            <div className="topbar-avatar">MF</div>
          </div>
        </header>

        {searchOpen && (
          <>
            <div className="search-panel">
              <Search size={18} />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && results[0]) goTo(results[0].to);
                }}
                placeholder="Ir para uma página..."
                aria-label="Ir para uma página"
              />
              <button
                className="icon-button"
                aria-label="Fechar busca"
                onClick={closeSearch}
              >
                <X size={17} />
              </button>
            </div>

            <ul className="search-results">
              {results.map(({ label, to, icon: Icon }) => (
                <li key={to}>
                  <button onClick={() => goTo(to)}>
                    <Icon size={16} />
                    {label}
                  </button>
                </li>
              ))}
              {results.length === 0 && (
                <li className="search-empty">Nenhuma página encontrada.</li>
              )}
            </ul>
          </>
        )}

        <div
          key={location.pathname}
          className={`route-fade ${location.pathname === '/' ? '' : 'page-area'}`.trim()}
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
}

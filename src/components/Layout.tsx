import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Server,
  Database,
  Activity,
  HardDrive,
  Bell,
  ShieldAlert,
  BarChart3,
  FileText,
  PenSquare,
  Home,
  ChevronLeft,
  ChevronRight,
  Zap,
  BellRing,
  CheckCheck,
} from 'lucide-react';
import type { SimulationState, SNSNotification } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import { formatDistanceToNow } from 'date-fns';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [simState, setSimState] = useState<SimulationState | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const engine = getSimulationEngine();
    const unsub = engine.subscribe(setSimState);
    engine.start();
    return unsub;
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const health = simState?.serviceHealth;
  const unreadCount = simState?.notifications.filter((n) => !n.read).length ?? 0;

  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/') return ['Blog', 'Home'];
    if (path.startsWith('/post/')) return ['Blog', 'Post'];
    if (path === '/editor') return ['Blog', 'New Post'];
    if (path.startsWith('/editor/')) return ['Blog', 'Edit Post'];
    if (path === '/dashboard') return ['AWS', 'Dashboard'];
    if (path === '/ec2') return ['AWS', 'EC2 Monitor'];
    if (path === '/rds') return ['AWS', 'RDS Monitor'];
    if (path === '/cloudwatch') return ['AWS', 'CloudWatch'];
    if (path === '/s3') return ['AWS', 'S3 Backups'];
    if (path === '/sns') return ['AWS', 'SNS Alerts'];
    if (path === '/recovery') return ['AWS', 'Recovery'];
    if (path === '/traffic') return ['AWS', 'Traffic Analytics'];
    return ['Home'];
  };

  const breadcrumb = getBreadcrumb();

  const handleMarkAllRead = () => {
    getSimulationEngine().markAllNotificationsRead();
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Zap size={20} />
          </div>
          {!collapsed && (
            <div className="sidebar-title">
              Self-Healing <span>AWS</span>
            </div>
          )}
        </div>

        <nav className="sidebar-nav">
          {/* Blog Section */}
          <div className="sidebar-section">
            {!collapsed && <div className="sidebar-section-title">Blog Platform</div>}
            <NavLink to="/" end className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Home size={18} />
              {!collapsed && <span>Blog Home</span>}
            </NavLink>
            <NavLink to="/editor" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <PenSquare size={18} />
              {!collapsed && <span>New Post</span>}
            </NavLink>
          </div>

          {/* AWS Dashboard Section */}
          <div className="sidebar-section">
            {!collapsed && <div className="sidebar-section-title">AWS Infrastructure</div>}
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} />
              {!collapsed && <span>Dashboard</span>}
              {!collapsed && <div className={`sidebar-health-dot ${health?.overall || 'healthy'}`} />}
            </NavLink>
            <NavLink to="/ec2" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Server size={18} />
              {!collapsed && <span>EC2 Monitor</span>}
              {!collapsed && <div className={`sidebar-health-dot ${health?.ec2 || 'healthy'}`} />}
            </NavLink>
            <NavLink to="/rds" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Database size={18} />
              {!collapsed && <span>RDS Monitor</span>}
              {!collapsed && <div className={`sidebar-health-dot ${health?.rds || 'healthy'}`} />}
            </NavLink>
            <NavLink to="/cloudwatch" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Activity size={18} />
              {!collapsed && <span>CloudWatch</span>}
              {!collapsed && <div className={`sidebar-health-dot ${health?.cloudwatch || 'healthy'}`} />}
            </NavLink>
            <NavLink to="/s3" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <HardDrive size={18} />
              {!collapsed && <span>S3 Backups</span>}
              {!collapsed && <div className={`sidebar-health-dot ${health?.s3 || 'healthy'}`} />}
            </NavLink>
            <NavLink to="/sns" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <Bell size={18} />
              {!collapsed && <span>SNS Alerts</span>}
              {!collapsed && <div className={`sidebar-health-dot ${health?.sns || 'healthy'}`} />}
            </NavLink>
          </div>

          {/* Operations Section */}
          <div className="sidebar-section">
            {!collapsed && <div className="sidebar-section-title">Operations</div>}
            <NavLink to="/recovery" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <ShieldAlert size={18} />
              {!collapsed && <span>Recovery</span>}
            </NavLink>
            <NavLink to="/traffic" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <BarChart3 size={18} />
              {!collapsed && <span>Traffic Analytics</span>}
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-toggle">
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="topbar-breadcrumb">
              <FileText size={14} />
              {breadcrumb.map((item, i) => (
                <span key={i}>
                  {i > 0 && <span style={{ margin: '0 4px' }}>/</span>}
                  <span className={i === breadcrumb.length - 1 ? 'current' : ''}>{item}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="topbar-right">
            {/* Simulation Status */}
            <div className="flex items-center gap-sm">
              <div className={`status-dot ${health?.overall || 'healthy'}`} />
              <span className="text-sm text-secondary">
                {health?.overall === 'healthy' ? 'All Systems Healthy' :
                 health?.overall === 'warning' ? 'Warning Detected' :
                 health?.overall === 'critical' ? 'Critical Alert' : 'Monitoring'}
              </span>
            </div>

            {/* Notifications */}
            <div className="notification-bell" ref={notifRef}>
              <button
                className="btn-icon"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <BellRing size={18} />
                {unreadCount > 0 && <div className="badge">{unreadCount}</div>}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-dropdown-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && (
                      <button className="btn btn-sm btn-ghost" onClick={handleMarkAllRead}>
                        <CheckCheck size={14} /> Mark all read
                      </button>
                    )}
                  </div>
                  <div className="notification-list">
                    {simState?.notifications.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
                        No notifications
                      </div>
                    ) : (
                      simState?.notifications.slice(0, 15).map((n: SNSNotification) => (
                        <div
                          key={n.id}
                          className={`notification-item ${!n.read ? 'unread' : ''}`}
                          onClick={() => getSimulationEngine().markNotificationRead(n.id)}
                        >
                          <div className="notification-item-title">
                            <span className={`status-dot ${n.severity === 'critical' ? 'critical' : n.severity === 'warning' ? 'warning' : 'healthy'}`}
                              style={{ display: 'inline-block', width: 6, height: 6, marginRight: 6, verticalAlign: 'middle' }}
                            />
                            {n.subject}
                          </div>
                          <div className="notification-item-message">{n.message}</div>
                          <div className="notification-item-time">
                            {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="page-content animate-fadeIn" key={location.pathname}>
          {children}
        </div>
      </div>
    </div>
  );
}

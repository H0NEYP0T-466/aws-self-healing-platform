import { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  CheckCheck,
  Filter,
  AlertTriangle,
  Info,
  AlertOctagon,
  Mail,
} from 'lucide-react';
import type { SimulationState } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import { format, formatDistanceToNow } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function SNSAlerts() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const engine = getSimulationEngine();
    return engine.subscribe(setState);
  }, []);

  if (!state) return null;

  const { notifications } = state;
  const unread = notifications.filter((n) => !n.read).length;
  const criticalCount = notifications.filter((n) => n.severity === 'critical').length;
  const warningCount = notifications.filter((n) => n.severity === 'warning').length;
  const infoCount = notifications.filter((n) => n.severity === 'info').length;

  const filteredNotifs = filter === 'all'
    ? notifications
    : filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications.filter((n) => n.severity === filter);

  const severityData = [
    { name: 'Critical', value: criticalCount, color: '#ef4444' },
    { name: 'Warning', value: warningCount, color: '#f59e0b' },
    { name: 'Info', value: infoCount, color: '#06b6d4' },
  ].filter((d) => d.value > 0);


  const SeverityIcon = ({ severity }: { severity: string }) => {
    if (severity === 'critical') return <AlertOctagon size={16} style={{ color: 'var(--color-critical)' }} />;
    if (severity === 'warning') return <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />;
    return <Info size={16} style={{ color: 'var(--color-info)' }} />;
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Amazon SNS Alerts</h1>
            <p>Simple Notification Service — Alert management and notification history</p>
          </div>
          <div className="flex gap-sm">
            {unread > 0 && (
              <button className="btn btn-ghost" onClick={() => getSimulationEngine().markAllNotificationsRead()}>
                <CheckCheck size={16} /> Mark All Read ({unread})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-4 mb-xl">
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Bell size={20} /></div>
          </div>
          <div className="metric-card-label">Total Alerts</div>
          <div className="metric-card-value">{notifications.length}</div>
        </div>
        <div className="metric-card critical">
          <div className="metric-card-header">
            <div className="metric-card-icon critical"><AlertOctagon size={20} /></div>
          </div>
          <div className="metric-card-label">Critical</div>
          <div className="metric-card-value">{criticalCount}</div>
        </div>
        <div className="metric-card warning">
          <div className="metric-card-header">
            <div className="metric-card-icon warning"><AlertTriangle size={20} /></div>
          </div>
          <div className="metric-card-label">Warning</div>
          <div className="metric-card-value">{warningCount}</div>
        </div>
        <div className={`metric-card ${unread > 0 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${unread > 0 ? 'warning' : 'healthy'}`}><BellRing size={20} /></div>
          </div>
          <div className="metric-card-label">Unread</div>
          <div className="metric-card-value">{unread}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-2 mb-xl">
        <div className="chart-container">
          <div className="chart-title mb-md">Alert Severity Distribution</div>
          {severityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={severityData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                  {severityData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} />
                <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
              <p>No alerts to display</p>
            </div>
          )}
        </div>

        <div className="glass-card">
          <div className="chart-title mb-md">SNS Topic Configuration</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div className="flex items-center gap-sm mb-sm">
                <Mail size={14} style={{ color: 'var(--color-accent-primary)' }} />
                <span className="text-sm font-semibold">Topic: BlogPlatform-Alerts</span>
              </div>
              <div className="text-xs text-muted font-mono">arn:aws:sns:us-east-1:123456789012:BlogPlatform-Alerts</div>
            </div>
            <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div className="text-xs font-semibold text-muted mb-sm" style={{ textTransform: 'uppercase' }}>Subscriptions</div>
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-sm text-sm">
                  <div className="status-dot healthy" /> Email: ops-team@company.com
                </div>
                <div className="flex items-center gap-sm text-sm">
                  <div className="status-dot healthy" /> SMS: +1-555-0123
                </div>
                <div className="flex items-center gap-sm text-sm">
                  <div className="status-dot healthy" /> Lambda: auto-recovery-handler
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="glass-card">
        <div className="chart-header mb-lg">
          <div className="chart-title">Notification Feed</div>
          <div className="flex gap-sm items-center">
            <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
            {['all', 'unread', 'critical', 'warning', 'info'].map((f) => (
              <button
                key={f}
                className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '0.7rem', textTransform: 'capitalize' }}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredNotifs.length === 0 ? (
          <div className="empty-state">
            <Bell size={40} />
            <h3>No notifications</h3>
            <p>No alerts match the current filter.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            {filteredNotifs.map((n) => (
              <div
                key={n.id}
                className={`notification-item ${!n.read ? 'unread' : ''}`}
                style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                onClick={() => getSimulationEngine().markNotificationRead(n.id)}
              >
                <div className="flex items-center gap-sm mb-sm">
                  <SeverityIcon severity={n.severity} />
                  <span className="notification-item-title" style={{ flex: 1 }}>{n.subject}</span>
                  <span className="tag" style={{ fontSize: '0.6rem' }}>{n.service}</span>
                </div>
                <div className="notification-item-message">{n.message}</div>
                <div className="notification-item-time">
                  {format(new Date(n.timestamp), 'MMM dd, HH:mm:ss')} • {formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Server,
  Database,
  Activity,
  HardDrive,
  Bell,
  ShieldAlert,
  ArrowRight,
  Zap,
  Cloud,
  Wifi,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
} from 'lucide-react';
import type { SimulationState } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const [state, setState] = useState<SimulationState | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const engine = getSimulationEngine();
    return engine.subscribe(setState);
  }, []);

  if (!state) return null;

  const { ec2, rds, serviceHealth, alarms, backups, notifications, traffic } = state;
  const activeAlarms = alarms.filter((a) => a.state === 'ALARM').length;
  const recentBackups = backups.filter((b) => b.status === 'completed').length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const latestTraffic = traffic.slice(-20);
  const avgResponseTime = traffic.length > 0
    ? (traffic.slice(-10).reduce((s, t) => s + t.responseTime, 0) / Math.min(traffic.length, 10)).toFixed(0)
    : '0';
  const totalRequests = traffic.slice(-10).reduce((s, t) => s + t.requests, 0);

  const uptimePercent = state.failureInjected ? '97.3' : '99.95';

  const serviceCards = [
    {
      name: 'Amazon EC2',
      subtitle: 'Web Server',
      icon: Server,
      status: serviceHealth.ec2,
      metric: ec2.state === 'running' ? `${ec2.cpuUtilization.toFixed(1)}% CPU` : ec2.state.toUpperCase(),
      path: '/ec2',
      color: '#3b82f6',
    },
    {
      name: 'Amazon RDS',
      subtitle: 'MySQL Database',
      icon: Database,
      status: serviceHealth.rds,
      metric: rds.status === 'available' ? `${rds.connections} connections` : rds.status.toUpperCase(),
      path: '/rds',
      color: '#8b5cf6',
    },
    {
      name: 'CloudWatch',
      subtitle: 'Monitoring',
      icon: Activity,
      status: serviceHealth.cloudwatch,
      metric: `${activeAlarms} active alarms`,
      path: '/cloudwatch',
      color: '#f59e0b',
    },
    {
      name: 'Amazon S3',
      subtitle: 'Backup Storage',
      icon: HardDrive,
      status: serviceHealth.s3,
      metric: `${recentBackups} backups`,
      path: '/s3',
      color: '#10b981',
    },
    {
      name: 'Amazon SNS',
      subtitle: 'Notifications',
      icon: Bell,
      status: serviceHealth.sns,
      metric: `${unreadNotifs} unread`,
      path: '/sns',
      color: '#06b6d4',
    },
  ];

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'healthy') return <CheckCircle2 size={16} style={{ color: 'var(--color-healthy)' }} />;
    if (status === 'warning') return <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />;
    return <XCircle size={16} style={{ color: 'var(--color-critical)' }} />;
  };

  return (
    <div className="animate-fadeIn">
      {/* Active Alerts Banner */}
      {activeAlarms > 0 && (
        <div className="alert-banner critical">
          <ShieldAlert size={20} />
          <div className="alert-banner-content">
            <div className="alert-banner-title">{activeAlarms} Active Alarm{activeAlarms > 1 ? 's' : ''} Detected</div>
            <div className="alert-banner-message">CloudWatch has detected threshold breaches requiring attention.</div>
          </div>
          <button className="btn btn-sm btn-danger" onClick={() => navigate('/cloudwatch')}>
            View Alarms
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>AWS Infrastructure Dashboard</h1>
            <p>Self-Healing Multi-Tier Blogging Platform — Real-time monitoring overview</p>
          </div>
          <div className="flex gap-md">
            <button className="btn btn-danger" onClick={() => navigate('/recovery')}>
              <ShieldAlert size={16} /> Simulate Failure
            </button>
          </div>
        </div>
      </div>

      {/* Architecture Diagram */}
      <div className="glass-card mb-xl">
        <div className="chart-header">
          <div>
            <div className="chart-title">Multi-Tier Architecture</div>
            <div className="chart-subtitle">Data flow between AWS services</div>
          </div>
          <div className={`status-badge ${serviceHealth.overall}`}>
            <div className={`status-dot ${serviceHealth.overall}`} />
            {serviceHealth.overall === 'healthy' ? 'All Systems Operational' :
             serviceHealth.overall === 'warning' ? 'Degraded Performance' : 'Service Disruption'}
          </div>
        </div>
        <div className="arch-diagram">
          <div className="arch-tier">
            <div className="arch-box" onClick={() => navigate('/traffic')} style={{ cursor: 'pointer' }}>
              <div className="arch-box-icon"><Cloud size={24} style={{ color: '#60a5fa', margin: '0 auto' }} /></div>
              <div className="arch-box-label">Internet</div>
              <div className="arch-box-sub">Users & Traffic</div>
            </div>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-tier">
            <div className="arch-box" onClick={() => navigate('/ec2')} style={{ cursor: 'pointer', borderColor: serviceHealth.ec2 === 'healthy' ? 'var(--color-healthy)' : serviceHealth.ec2 === 'warning' ? 'var(--color-warning)' : 'var(--color-critical)' }}>
              <div className="arch-box-icon"><Server size={24} style={{ color: '#3b82f6', margin: '0 auto' }} /></div>
              <div className="arch-box-label">EC2 Instance</div>
              <div className="arch-box-sub">t3.medium • Web Tier</div>
            </div>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-tier">
            <div className="arch-box" onClick={() => navigate('/rds')} style={{ cursor: 'pointer', borderColor: serviceHealth.rds === 'healthy' ? 'var(--color-healthy)' : serviceHealth.rds === 'warning' ? 'var(--color-warning)' : 'var(--color-critical)' }}>
              <div className="arch-box-icon"><Database size={24} style={{ color: '#8b5cf6', margin: '0 auto' }} /></div>
              <div className="arch-box-label">RDS MySQL</div>
              <div className="arch-box-sub">db.t3.medium • Data Tier</div>
            </div>
          </div>
          <div className="arch-arrow">→</div>
          <div className="arch-tier">
            <div className="arch-box" onClick={() => navigate('/s3')} style={{ cursor: 'pointer' }}>
              <div className="arch-box-icon"><HardDrive size={24} style={{ color: '#10b981', margin: '0 auto' }} /></div>
              <div className="arch-box-label">S3 Bucket</div>
              <div className="arch-box-sub">Backups & Assets</div>
            </div>
          </div>
        </div>
        <div className="arch-diagram" style={{ paddingTop: 0, gap: 'var(--space-xl)' }}>
          <div className="arch-box" onClick={() => navigate('/cloudwatch')} style={{ cursor: 'pointer' }}>
            <div className="arch-box-icon"><Activity size={20} style={{ color: '#f59e0b', margin: '0 auto' }} /></div>
            <div className="arch-box-label">CloudWatch</div>
            <div className="arch-box-sub">Monitors all tiers</div>
          </div>
          <div className="arch-box" onClick={() => navigate('/sns')} style={{ cursor: 'pointer' }}>
            <div className="arch-box-icon"><Bell size={20} style={{ color: '#06b6d4', margin: '0 auto' }} /></div>
            <div className="arch-box-label">SNS</div>
            <div className="arch-box-sub">Alert notifications</div>
          </div>
          <div className="arch-box" onClick={() => navigate('/recovery')} style={{ cursor: 'pointer' }}>
            <div className="arch-box-icon"><Zap size={20} style={{ color: '#ef4444', margin: '0 auto' }} /></div>
            <div className="arch-box-label">Auto-Healing</div>
            <div className="arch-box-sub">Recovery engine</div>
          </div>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid grid-5 mb-xl">
        {serviceCards.map((svc) => (
          <div
            key={svc.name}
            className={`metric-card ${svc.status} clickable`}
            onClick={() => navigate(svc.path)}
            style={{ cursor: 'pointer' }}
          >
            <div className="metric-card-header">
              <div className="metric-card-icon" style={{ background: `${svc.color}15`, color: svc.color }}>
                <svc.icon size={20} />
              </div>
              <StatusIcon status={svc.status} />
            </div>
            <div className="metric-card-label">{svc.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 8 }}>{svc.subtitle}</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{svc.metric}</div>
          </div>
        ))}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-4 mb-xl">
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><TrendingUp size={20} /></div>
          </div>
          <div className="metric-card-label">Uptime</div>
          <div className="metric-card-value">{uptimePercent}%</div>
          <div className="metric-card-sublabel">Last 30 days</div>
        </div>

        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Wifi size={20} /></div>
          </div>
          <div className="metric-card-label">Requests</div>
          <div className="metric-card-value">{totalRequests.toLocaleString()}</div>
          <div className="metric-card-sublabel">Last 10 intervals</div>
        </div>

        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Clock size={20} /></div>
          </div>
          <div className="metric-card-label">Avg Response</div>
          <div className="metric-card-value">{avgResponseTime}ms</div>
          <div className="metric-card-sublabel">P50 latency</div>
        </div>

        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><ShieldAlert size={20} /></div>
          </div>
          <div className="metric-card-label">Recoveries</div>
          <div className="metric-card-value">{state.recoveryWorkflows.filter((w) => w.status === 'completed').length}</div>
          <div className="metric-card-sublabel">Auto-healed incidents</div>
        </div>
      </div>

      {/* Traffic Mini Chart + Recent Logs */}
      <div className="grid grid-2">
        <div className="chart-container" style={{ cursor: 'pointer' }} onClick={() => navigate('/traffic')}>
          <div className="chart-header">
            <div>
              <div className="chart-title">Traffic Overview</div>
              <div className="chart-subtitle">Request rate (last 20 intervals)</div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={latestTraffic}>
              <defs>
                <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }}
                labelStyle={{ display: 'none' }}
              />
              <Area type="monotone" dataKey="requests" stroke="#3b82f6" fill="url(#trafficGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card" style={{ cursor: 'pointer' }} onClick={() => navigate('/cloudwatch')}>
          <div className="chart-header">
            <div>
              <div className="chart-title">Recent Logs</div>
              <div className="chart-subtitle">Latest CloudWatch entries</div>
            </div>
            <ArrowRight size={16} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="log-viewer" style={{ maxHeight: 180 }}>
            {state.logs.slice(-8).reverse().map((log) => (
              <div key={log.id} className="log-entry">
                <span className={`log-level ${log.level}`}>{log.level}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  HardDrive,
  Download,
  Plus,
  CheckCircle2,
  XCircle,
  Loader2,
  Server,
  Database,
  Archive,
  Calendar,
} from 'lucide-react';
import type { SimulationState, S3Backup } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import { formatDistanceToNow } from 'date-fns';

export default function S3Backups() {
  const [state, setState] = useState<SimulationState | null>(null);

  useEffect(() => {
    const engine = getSimulationEngine();
    return engine.subscribe(setState);
  }, []);

  if (!state) return null;

  const { backups } = state;
  const completedBackups = backups.filter((b) => b.status === 'completed');
  const totalSize = completedBackups.reduce((s, b) => s + b.size, 0);
  const autoBackups = backups.filter((b) => b.type === 'auto').length;
  const manualBackups = backups.filter((b) => b.type === 'manual').length;

  const handleBackup = (source: S3Backup['source']) => {
    getSimulationEngine().triggerManualBackup(source);
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'completed') return <CheckCircle2 size={14} style={{ color: 'var(--color-healthy)' }} />;
    if (status === 'failed') return <XCircle size={14} style={{ color: 'var(--color-critical)' }} />;
    return <Loader2 size={14} style={{ color: 'var(--color-info)', animation: 'spin 1s linear infinite' }} />;
  };

  const SourceIcon = ({ source }: { source: string }) => {
    if (source === 'EC2') return <Server size={14} style={{ color: '#3b82f6' }} />;
    if (source === 'RDS') return <Database size={14} style={{ color: '#8b5cf6' }} />;
    return <Archive size={14} style={{ color: '#10b981' }} />;
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Amazon S3 Backups</h1>
            <p>Backup storage, auto-backup workflow, and recovery points</p>
          </div>
          <div className="flex gap-sm">
            <button className="btn btn-primary" onClick={() => handleBackup('EC2')}>
              <Plus size={16} /> Backup EC2
            </button>
            <button className="btn btn-primary" onClick={() => handleBackup('RDS')}>
              <Plus size={16} /> Backup RDS
            </button>
          </div>
        </div>
      </div>

      {/* Bucket Info */}
      <div className="glass-card mb-xl">
        <div className="flex items-center gap-md mb-lg">
          <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HardDrive size={22} style={{ color: '#10b981' }} />
          </div>
          <div>
            <div className="chart-title">blog-platform-backups-us-east-1</div>
            <div className="chart-subtitle">S3 Standard • Versioning Enabled • us-east-1</div>
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: 'var(--space-md)' }}>
          <div className="metric-card info">
            <div className="metric-card-label">Total Backups</div>
            <div className="metric-card-value">{backups.length}</div>
          </div>
          <div className="metric-card info">
            <div className="metric-card-label">Total Size</div>
            <div className="metric-card-value">{totalSize >= 1000 ? `${(totalSize / 1000).toFixed(1)} GB` : `${totalSize.toFixed(0)} MB`}</div>
          </div>
          <div className="metric-card info">
            <div className="metric-card-label">Auto Backups</div>
            <div className="metric-card-value">{autoBackups}</div>
          </div>
          <div className="metric-card info">
            <div className="metric-card-label">Manual Backups</div>
            <div className="metric-card-value">{manualBackups}</div>
          </div>
        </div>
      </div>

      {/* Auto-Backup Schedule */}
      <div className="glass-card mb-xl">
        <div className="chart-header mb-lg">
          <div className="chart-title">Auto-Backup Schedule</div>
          <div className="status-badge healthy"><CheckCircle2 size={12} /> Active</div>
        </div>
        <div className="grid grid-3" style={{ gap: 'var(--space-md)' }}>
          <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-sm mb-sm">
              <Calendar size={14} style={{ color: 'var(--color-accent-primary)' }} />
              <span className="text-sm font-semibold">EC2 Backup</span>
            </div>
            <div className="text-xs text-muted">Every 6 hours • Retention: 7 days</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-sm mb-sm">
              <Calendar size={14} style={{ color: '#8b5cf6' }} />
              <span className="text-sm font-semibold">RDS Snapshot</span>
            </div>
            <div className="text-xs text-muted">Daily at 03:00 UTC • Retention: 30 days</div>
          </div>
          <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
            <div className="flex items-center gap-sm mb-sm">
              <Calendar size={14} style={{ color: '#10b981' }} />
              <span className="text-sm font-semibold">Application Data</span>
            </div>
            <div className="text-xs text-muted">Every 12 hours • Retention: 14 days</div>
          </div>
        </div>
      </div>

      {/* Backup History */}
      <div className="glass-card">
        <div className="chart-header mb-lg">
          <div className="chart-title">Backup History</div>
          <div className="chart-subtitle">{backups.length} total backups</div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Type</th>
                <th>Source</th>
                <th>Key</th>
                <th>Size</th>
                <th>Duration</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <StatusIcon status={backup.status} />
                      <span className={`status-badge ${backup.status === 'completed' ? 'healthy' : backup.status === 'failed' ? 'critical' : 'recovering'}`}
                        style={{ fontSize: '0.65rem' }}>
                        {backup.status}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="tag" style={backup.type === 'recovery' ? { background: 'var(--color-critical-bg)', color: 'var(--color-critical)' } : backup.type === 'manual' ? { background: 'var(--color-warning-bg)', color: 'var(--color-warning)' } : {}}>
                      {backup.type}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-xs">
                      <SourceIcon source={backup.source} />
                      <span className="text-sm">{backup.source}</span>
                    </div>
                  </td>
                  <td className="mono" style={{ fontSize: '0.7rem', maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>{backup.key}</td>
                  <td className="text-sm">{backup.size.toFixed(0)} MB</td>
                  <td className="text-sm font-mono">{backup.duration}s</td>
                  <td className="text-xs text-muted">{formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true })}</td>
                  <td>
                    {backup.status === 'completed' && (
                      <button className="btn btn-sm btn-ghost" style={{ padding: '4px 8px' }}>
                        <Download size={12} /> Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

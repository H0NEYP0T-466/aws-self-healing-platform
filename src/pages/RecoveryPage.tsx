import { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Zap,
  Server,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  Play,
  CheckCircle2,
  XCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import type { SimulationState, RecoveryWorkflow } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import { format, formatDistanceToNow } from 'date-fns';

export default function RecoveryPage() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [recovering, setRecovering] = useState(false);

  useEffect(() => {
    const engine = getSimulationEngine();
    return engine.subscribe(setState);
  }, []);

  if (!state) return null;

  const { recoveryWorkflows, failureInjected } = state;
  const completedRecoveries = recoveryWorkflows.filter((w) => w.status === 'completed').length;
  const failedRecoveries = recoveryWorkflows.filter((w) => w.status === 'failed').length;
  const activeRecovery = recoveryWorkflows.find((w) => w.status === 'in-progress');

  const failureTypes: { type: RecoveryWorkflow['failureType']; label: string; description: string; icon: typeof Server; color: string }[] = [
    { type: 'ec2-crash', label: 'EC2 Instance Crash', description: 'Simulate complete web server failure — instance stops responding', icon: Server, color: '#ef4444' },
    { type: 'rds-failure', label: 'RDS Database Failure', description: 'Simulate database failure — all connections drop', icon: Database, color: '#8b5cf6' },
    { type: 'high-cpu', label: 'High CPU Spike', description: 'Simulate CPU spike above threshold — performance degradation', icon: Cpu, color: '#f59e0b' },
    { type: 'disk-full', label: 'Disk Space Exhaustion', description: 'Simulate running out of disk space on RDS', icon: HardDrive, color: '#10b981' },
    { type: 'network-issue', label: 'Network Connectivity Issue', description: 'Simulate network degradation — packet loss on web server', icon: Wifi, color: '#06b6d4' },
  ];

  const handleInjectFailure = async (type: RecoveryWorkflow['failureType']) => {
    if (failureInjected || recovering) return;
    const engine = getSimulationEngine();
    engine.injectFailure(type);
    setRecovering(true);
    await engine.triggerRecovery(type);
    setRecovering(false);
  };

  const StepIcon = ({ status }: { status: string }) => {
    if (status === 'completed') return <CheckCircle2 size={14} style={{ color: 'var(--color-healthy)' }} />;
    if (status === 'in-progress') return <Loader2 size={14} style={{ color: 'var(--color-accent-primary)', animation: 'spin 1s linear infinite' }} />;
    if (status === 'failed') return <XCircle size={14} style={{ color: 'var(--color-critical)' }} />;
    return <Clock size={14} style={{ color: 'var(--color-text-muted)' }} />;
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Recovery & Failure Simulation</h1>
            <p>Inject failures into the infrastructure and watch the auto-recovery workflow</p>
          </div>
          {failureInjected && (
            <div className="status-badge critical">
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />
              Recovery In Progress
            </div>
          )}
        </div>
      </div>

      {/* Active Alert */}
      {failureInjected && (
        <div className="alert-banner critical">
          <ShieldAlert size={20} />
          <div className="alert-banner-content">
            <div className="alert-banner-title">⚡ Failure Injected — Auto-Recovery in Progress</div>
            <div className="alert-banner-message">The self-healing engine has detected the failure and is executing the recovery workflow.</div>
          </div>
        </div>
      )}

      {/* Recovery Stats */}
      <div className="grid grid-4 mb-xl">
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Zap size={20} /></div>
          </div>
          <div className="metric-card-label">Total Recoveries</div>
          <div className="metric-card-value">{recoveryWorkflows.length}</div>
        </div>
        <div className="metric-card healthy">
          <div className="metric-card-header">
            <div className="metric-card-icon healthy"><CheckCircle2 size={20} /></div>
          </div>
          <div className="metric-card-label">Successful</div>
          <div className="metric-card-value">{completedRecoveries}</div>
        </div>
        <div className="metric-card critical">
          <div className="metric-card-header">
            <div className="metric-card-icon critical"><XCircle size={20} /></div>
          </div>
          <div className="metric-card-label">Failed</div>
          <div className="metric-card-value">{failedRecoveries}</div>
        </div>
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Clock size={20} /></div>
          </div>
          <div className="metric-card-label">Success Rate</div>
          <div className="metric-card-value">{recoveryWorkflows.length > 0 ? `${((completedRecoveries / recoveryWorkflows.length) * 100).toFixed(0)}%` : 'N/A'}</div>
        </div>
      </div>

      {/* Failure Injection Panel */}
      <div className="glass-card mb-xl">
        <div className="chart-header mb-lg">
          <div>
            <div className="chart-title">🔥 Failure Injection Panel</div>
            <div className="chart-subtitle">Choose a failure scenario to test the auto-recovery system</div>
          </div>
          {!failureInjected && !recovering && (
            <div className="status-badge healthy">
              <div className="status-dot healthy" /> Ready
            </div>
          )}
        </div>

        <div className="grid grid-3" style={{ gap: 'var(--space-md)' }}>
          {failureTypes.map((ft) => (
            <div
              key={ft.type}
              className="glass-card clickable"
              style={{
                cursor: failureInjected || recovering ? 'not-allowed' : 'pointer',
                opacity: failureInjected || recovering ? 0.5 : 1,
                border: `1px solid ${ft.color}20`,
              }}
              onClick={() => handleInjectFailure(ft.type)}
            >
              <div className="flex items-center gap-md mb-md">
                <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: `${ft.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ft.icon size={20} style={{ color: ft.color }} />
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{ft.label}</div>
                </div>
              </div>
              <div className="text-xs text-secondary mb-md">{ft.description}</div>
              <button className="btn btn-sm btn-danger w-full" disabled={failureInjected || recovering}>
                <Play size={12} /> Inject Failure
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recovery Workflow Visualization */}
      {activeRecovery && (
        <div className="glass-card mb-xl" style={{ borderColor: 'var(--color-accent-primary)', boxShadow: 'var(--shadow-glow-blue)' }}>
          <div className="chart-header mb-lg">
            <div>
              <div className="chart-title">🔄 Active Recovery Workflow</div>
              <div className="chart-subtitle">
                Triggered by: {activeRecovery.triggeredBy} • Type: {activeRecovery.failureType}
              </div>
            </div>
            <div className="status-badge recovering">
              <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> In Progress
            </div>
          </div>

          <div className="recovery-timeline">
            {activeRecovery.steps.map((step) => (
              <div key={step.id} className="timeline-step">
                <div className={`timeline-dot ${step.status}`} />
                <div className="flex items-center gap-sm">
                  <StepIcon status={step.status} />
                  <span className="timeline-step-title">{step.name}</span>
                </div>
                <div className="timeline-step-desc">{step.description}</div>
                {step.startTime && (
                  <div className="timeline-step-time">{format(new Date(step.startTime), 'HH:mm:ss.SSS')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Recovery History */}
      {recoveryWorkflows.length > 0 && (
        <div className="glass-card">
          <div className="chart-header mb-lg">
            <div className="chart-title">Recovery History</div>
            <div className="chart-subtitle">{recoveryWorkflows.length} workflow{recoveryWorkflows.length !== 1 ? 's' : ''} executed</div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Failure Type</th>
                  <th>Triggered By</th>
                  <th>Steps</th>
                  <th>Started</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                {recoveryWorkflows.map((wf) => (
                  <tr key={wf.id}>
                    <td>
                      <span className={`status-badge ${wf.status === 'completed' ? 'healthy' : wf.status === 'failed' ? 'critical' : 'recovering'}`} style={{ fontSize: '0.65rem' }}>
                        {wf.status === 'completed' ? <CheckCircle2 size={12} /> : wf.status === 'failed' ? <XCircle size={12} /> : <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} />}
                        {wf.status}
                      </span>
                    </td>
                    <td className="font-semibold text-sm">{wf.failureType}</td>
                    <td className="text-sm text-secondary">{wf.triggeredBy}</td>
                    <td className="text-sm">{wf.steps.filter((s) => s.status === 'completed').length}/{wf.steps.length}</td>
                    <td className="text-xs text-muted">{formatDistanceToNow(new Date(wf.startTime), { addSuffix: true })}</td>
                    <td className="text-sm font-mono">
                      {wf.endTime
                        ? `${((new Date(wf.endTime).getTime() - new Date(wf.startTime).getTime()) / 1000).toFixed(1)}s`
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Auto-Recovery Workflow Explanation */}
      {recoveryWorkflows.length === 0 && !failureInjected && (
        <div className="glass-card">
          <div className="chart-title mb-lg">How Auto-Recovery Works</div>
          <div className="recovery-timeline">
            {[
              { name: 'CloudWatch Detects Failure', desc: 'Alarm threshold breached — metric anomaly detected', status: 'completed' as const },
              { name: 'SNS Sends Notification', desc: 'Alert dispatched to email, SMS, and Lambda function', status: 'completed' as const },
              { name: 'Emergency Backup to S3', desc: 'Current state backed up to S3 before recovery attempt', status: 'completed' as const },
              { name: 'Affected Service Stopped', desc: 'Graceful shutdown of the unhealthy service', status: 'completed' as const },
              { name: 'Restore from Last Known Good State', desc: 'Service restored from backup or restarted fresh', status: 'completed' as const },
              { name: 'Health Check Verification', desc: 'Post-recovery health check confirms service is responding', status: 'completed' as const },
              { name: 'Recovery Complete', desc: 'Service restored — monitoring continues', status: 'completed' as const },
            ].map((step, i) => (
              <div key={i} className="timeline-step">
                <div className={`timeline-dot ${step.status}`} />
                <div className="timeline-step-title">{step.name}</div>
                <div className="timeline-step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  Filter,
} from 'lucide-react';
import type { SimulationState, AlarmState } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import { format, formatDistanceToNow } from 'date-fns';

export default function CloudWatchPage() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [logFilter, setLogFilter] = useState<string>('ALL');

  useEffect(() => {
    const engine = getSimulationEngine();
    return engine.subscribe(setState);
  }, []);

  if (!state) return null;

  const { alarms, logs } = state;
  const activeAlarms = alarms.filter((a) => a.state === 'ALARM').length;

  const AlarmIcon = ({ s }: { s: AlarmState }) => {
    if (s === 'OK') return <CheckCircle2 size={16} style={{ color: 'var(--color-healthy)' }} />;
    if (s === 'ALARM') return <AlertTriangle size={16} style={{ color: 'var(--color-critical)' }} />;
    return <HelpCircle size={16} style={{ color: 'var(--color-text-muted)' }} />;
  };

  const filteredLogs = logFilter === 'ALL'
    ? logs
    : logs.filter((l) => l.level === logFilter);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>Amazon CloudWatch</h1>
            <p>Monitoring, alarms, and log management for all AWS resources</p>
          </div>
          <div className="flex gap-md">
            <div className={`status-badge ${activeAlarms > 0 ? 'critical' : 'healthy'}`}>
              <Activity size={12} />
              {activeAlarms > 0 ? `${activeAlarms} Active Alarm${activeAlarms > 1 ? 's' : ''}` : 'All OK'}
            </div>
          </div>
        </div>
      </div>

      {/* Alarms Section */}
      <div className="glass-card mb-xl">
        <div className="chart-header mb-lg">
          <div className="chart-title">CloudWatch Alarms ({alarms.length})</div>
          <div className="flex gap-sm">
            <span className="status-badge healthy" style={{ fontSize: '0.7rem' }}>
              {alarms.filter((a) => a.state === 'OK').length} OK
            </span>
            <span className="status-badge critical" style={{ fontSize: '0.7rem' }}>
              {alarms.filter((a) => a.state === 'ALARM').length} ALARM
            </span>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>State</th>
                <th>Alarm Name</th>
                <th>Metric</th>
                <th>Namespace</th>
                <th>Threshold</th>
                <th>Service</th>
                <th>Reason</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {alarms.map((alarm) => (
                <tr key={alarm.id}>
                  <td>
                    <div className="flex items-center gap-sm">
                      <AlarmIcon s={alarm.state} />
                      <span className={`status-badge ${alarm.state === 'OK' ? 'healthy' : alarm.state === 'ALARM' ? 'critical' : 'stopped'}`}
                        style={{ fontSize: '0.65rem' }}>
                        {alarm.state}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{alarm.alarmName}</td>
                  <td className="mono">{alarm.metricName}</td>
                  <td className="mono" style={{ fontSize: '0.75rem' }}>{alarm.namespace}</td>
                  <td>{alarm.comparisonOperator === 'GreaterThanThreshold' || alarm.comparisonOperator === 'GreaterThanOrEqualToThreshold' ? '>' : '<'} {alarm.threshold}</td>
                  <td>
                    <span className="tag">{alarm.service}</span>
                  </td>
                  <td style={{ maxWidth: 250, fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{alarm.stateReason}</td>
                  <td className="text-xs text-muted">{formatDistanceToNow(new Date(alarm.lastUpdated), { addSuffix: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Log Stream */}
      <div className="glass-card">
        <div className="chart-header mb-lg">
          <div>
            <div className="chart-title">Log Stream</div>
            <div className="chart-subtitle">Real-time log entries from all services</div>
          </div>
          <div className="flex gap-sm items-center">
            <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
            {['ALL', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map((level) => (
              <button
                key={level}
                className={`btn btn-sm ${logFilter === level ? 'btn-primary' : 'btn-ghost'}`}
                style={{ padding: '4px 10px', fontSize: '0.7rem' }}
                onClick={() => setLogFilter(level)}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="log-viewer" style={{ maxHeight: 500 }}>
          {filteredLogs.slice().reverse().map((log) => (
            <div key={log.id} className="log-entry">
              <span className="log-timestamp">{format(new Date(log.timestamp), 'HH:mm:ss.SSS')}</span>
              <span className={`log-level ${log.level}`}>{log.level}</span>
              <span className="log-source">[{log.source}]</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

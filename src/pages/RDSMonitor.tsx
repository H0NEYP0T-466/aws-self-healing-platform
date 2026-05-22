import { useState, useEffect } from 'react';
import {
  Database,
  Activity,
  HardDrive,
  CheckCircle2,
  XCircle,
  Layers,
  Clock,
  Info,
} from 'lucide-react';
import type { SimulationState } from '../types';
import { getSimulationEngine } from '../simulation/engine';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from 'recharts';
import { format } from 'date-fns';

export default function RDSMonitor() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [metrics, setMetrics] = useState<ReturnType<ReturnType<typeof getSimulationEngine>['getMetricsHistory']> | null>(null);

  useEffect(() => {
    const engine = getSimulationEngine();
    const unsub = engine.subscribe((s) => {
      setState(s);
      setMetrics(engine.getMetricsHistory());
    });
    return unsub;
  }, []);

  if (!state || !metrics) return null;

  const { rds, serviceHealth } = state;
  const storagePercent = ((rds.allocatedStorage - rds.freeStorageSpace) / rds.allocatedStorage * 100).toFixed(1);
  const connPercent = ((rds.connections / rds.maxConnections) * 100).toFixed(1);

  const formatTime = (ts: number) => format(new Date(ts), 'HH:mm:ss');

  const ChartTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.[0]) return null;
    return (
      <div className="chart-tooltip">
        <div className="label">{typeof label === 'number' ? formatTime(label) : label}</div>
        <div className="value">{payload[0].value.toFixed(1)} {payload[0].name}</div>
      </div>
    );
  };

  // Gauge SVG helper
  const GaugeRing = ({ value, max, color, label, unit }: { value: number; max: number; color: string; label: string; unit: string }) => {
    const r = 42;
    const c = 2 * Math.PI * r;
    const pct = Math.min(value / max, 1);
    const offset = c * (1 - pct);
    const displayColor = pct > 0.85 ? 'var(--color-critical)' : pct > 0.65 ? 'var(--color-warning)' : color;

    return (
      <div className="gauge-container">
        <div className="gauge-ring">
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle className="bg" cx="50" cy="50" r={r} />
            <circle className="fg" cx="50" cy="50" r={r} stroke={displayColor} strokeDasharray={c} strokeDashoffset={offset} />
          </svg>
          <div className="gauge-value" style={{ color: displayColor }}>{value.toFixed(0)}<span style={{ fontSize: '0.7rem' }}>{unit}</span></div>
        </div>
        <div className="gauge-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>RDS Database Monitor</h1>
            <p>Amazon Relational Database Service — MySQL primary instance</p>
          </div>
          <div className={`status-badge ${serviceHealth.rds}`}>
            <div className={`status-dot ${serviceHealth.rds}`} />
            {serviceHealth.rds.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Instance Details */}
      <div className="glass-card mb-xl">
        <div className="chart-header mb-lg">
          <div className="flex items-center gap-md">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Database size={22} style={{ color: '#8b5cf6' }} />
            </div>
            <div>
              <div className="chart-title" style={{ fontSize: '1.1rem' }}>{rds.dbInstanceId}</div>
              <div className="chart-subtitle">{rds.engine} {rds.engineVersion} • {rds.instanceClass}</div>
            </div>
          </div>
          <div className={`status-badge ${rds.status === 'available' ? 'healthy' : 'critical'}`}>
            {rds.status === 'available' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
            {rds.status}
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: 'var(--space-md)' }}>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability Zone</div>
            <div className="text-sm">{rds.availabilityZone}</div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Multi-AZ</div>
            <div className={`status-badge ${rds.multiAZ ? 'healthy' : 'warning'}`}>
              {rds.multiAZ ? <CheckCircle2 size={12} /> : <Info size={12} />}
              {rds.multiAZ ? 'Enabled' : 'Disabled'}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Storage</div>
            <div className="text-sm">{rds.allocatedStorage} GB (gp3)</div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Replica Lag</div>
            <div className="text-sm font-mono">{rds.replicaLag.toFixed(2)}s</div>
          </div>
        </div>
      </div>

      {/* Gauges Row */}
      <div className="glass-card mb-xl">
        <div className="chart-title mb-lg">Connection Pool & Storage</div>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 'var(--space-lg)' }}>
          <GaugeRing value={rds.connections} max={rds.maxConnections} color="#8b5cf6" label={`Connections (${connPercent}%)`} unit="" />
          <GaugeRing value={parseFloat(storagePercent)} max={100} color="#3b82f6" label={`Storage Used (${(rds.allocatedStorage - rds.freeStorageSpace).toFixed(1)} GB)`} unit="%" />
          <GaugeRing value={rds.cpuUtilization} max={100} color="#10b981" label="CPU Utilization" unit="%" />
          <GaugeRing value={rds.freeableMemory} max={4} color="#f59e0b" label="Freeable Memory" unit="GB" />
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-4 mb-xl">
        <div className={`metric-card ${rds.cpuUtilization > 75 ? 'critical' : rds.cpuUtilization > 50 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${rds.cpuUtilization > 75 ? 'critical' : rds.cpuUtilization > 50 ? 'warning' : 'healthy'}`}><Activity size={20} /></div>
          </div>
          <div className="metric-card-label">CPU Utilization</div>
          <div className="metric-card-value">{rds.cpuUtilization.toFixed(1)}%</div>
          <div className="metric-card-sublabel">Threshold: 75%</div>
        </div>
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Layers size={20} /></div>
          </div>
          <div className="metric-card-label">Read IOPS</div>
          <div className="metric-card-value">{rds.readIOPS}</div>
          <div className="metric-card-sublabel">Operations/sec</div>
        </div>
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><HardDrive size={20} /></div>
          </div>
          <div className="metric-card-label">Write IOPS</div>
          <div className="metric-card-value">{rds.writeIOPS}</div>
          <div className="metric-card-sublabel">Operations/sec</div>
        </div>
        <div className={`metric-card ${rds.readLatency > 5 ? 'critical' : rds.readLatency > 3 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${rds.readLatency > 5 ? 'critical' : rds.readLatency > 3 ? 'warning' : 'healthy'}`}><Clock size={20} /></div>
          </div>
          <div className="metric-card-label">Read Latency</div>
          <div className="metric-card-value">{rds.readLatency.toFixed(1)}ms</div>
          <div className="metric-card-sublabel">P50 query time</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 mb-xl">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Database Connections</div>
            <div className="chart-subtitle">Active connections over time</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={metrics.rdsConnections}>
              <defs>
                <linearGradient id="connGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 150]} tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="value" name="Connections" stroke="#8b5cf6" fill="url(#connGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Query Latency (ms)</div>
            <div className="chart-subtitle">Read latency over time</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={metrics.rdsLatency}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" name="Latency ms" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Read/Write IOPS</div>
            <div className="chart-subtitle">I/O operations per second</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.rdsReadIOPS.slice(-20).map((d, i) => ({
              timestamp: d.timestamp,
              read: d.value,
              write: metrics.rdsWriteIOPS[metrics.rdsWriteIOPS.length - 20 + i]?.value || 0,
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} labelFormatter={(v) => formatTime(v as number)} />
              <Bar dataKey="read" name="Read IOPS" fill="#3b82f6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="write" name="Write IOPS" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Free Storage Space (GB)</div>
            <div className="chart-subtitle">Available storage over time</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={metrics.rdsStorage}>
              <defs>
                <linearGradient id="storageGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 20]} tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="value" name="Free GB" stroke="#10b981" fill="url(#storageGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

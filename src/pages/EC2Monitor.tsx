import { useState, useEffect } from 'react';
import {
  Server,
  Power,
  PowerOff,
  RotateCcw,
  MapPin,
  Cpu,
  MemoryStick,
  Network,
  HardDrive,
  CheckCircle2,
  XCircle,
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
} from 'recharts';
import { format } from 'date-fns';

export default function EC2Monitor() {
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

  const { ec2, serviceHealth } = state;

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

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-actions">
          <div>
            <h1>EC2 Instance Monitor</h1>
            <p>Amazon Elastic Compute Cloud — Web server tier monitoring</p>
          </div>
          <div className={`status-badge ${serviceHealth.ec2}`}>
            <div className={`status-dot ${serviceHealth.ec2}`} />
            {serviceHealth.ec2.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Instance Details */}
      <div className="glass-card mb-xl">
        <div className="chart-header mb-lg">
          <div className="flex items-center gap-md">
            <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Server size={22} style={{ color: '#3b82f6' }} />
            </div>
            <div>
              <div className="chart-title" style={{ fontSize: '1.1rem' }}>{ec2.instanceId}</div>
              <div className="chart-subtitle">Amazon Linux 2023 • {ec2.instanceType}</div>
            </div>
          </div>
          <div className="flex gap-sm">
            <button className="btn btn-sm btn-success" disabled={ec2.state === 'running'}>
              <Power size={14} /> Start
            </button>
            <button className="btn btn-sm btn-danger" disabled={ec2.state !== 'running'}>
              <PowerOff size={14} /> Stop
            </button>
            <button className="btn btn-sm btn-warning">
              <RotateCcw size={14} /> Reboot
            </button>
          </div>
        </div>

        <div className="grid grid-4" style={{ gap: 'var(--space-md)' }}>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</div>
            <div className={`status-badge ${ec2.state === 'running' ? 'healthy' : 'critical'}`}>
              {ec2.state === 'running' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
              {ec2.state}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Availability Zone</div>
            <div className="flex items-center gap-xs"><MapPin size={14} style={{ color: 'var(--color-accent-primary)' }} /> {ec2.availabilityZone}</div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Public IP</div>
            <div className="font-mono text-sm">{ec2.publicIp}</div>
          </div>
          <div>
            <div className="text-xs text-muted font-semibold mb-sm" style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Private IP</div>
            <div className="font-mono text-sm">{ec2.privateIp}</div>
          </div>
        </div>
      </div>

      {/* Status Checks */}
      <div className="grid grid-2 mb-xl">
        <div className={`metric-card ${ec2.statusCheckSystem === 'passed' ? 'healthy' : 'critical'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${ec2.statusCheckSystem === 'passed' ? 'healthy' : 'critical'}`}>
              {ec2.statusCheckSystem === 'passed' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <Info size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="metric-card-label">System Status Check</div>
          <div className="metric-card-value" style={{ fontSize: '1.25rem', textTransform: 'uppercase' }}>{ec2.statusCheckSystem}</div>
          <div className="metric-card-sublabel">AWS infrastructure health check</div>
        </div>
        <div className={`metric-card ${ec2.statusCheckInstance === 'passed' ? 'healthy' : 'critical'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${ec2.statusCheckInstance === 'passed' ? 'healthy' : 'critical'}`}>
              {ec2.statusCheckInstance === 'passed' ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
            </div>
            <Info size={14} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div className="metric-card-label">Instance Status Check</div>
          <div className="metric-card-value" style={{ fontSize: '1.25rem', textTransform: 'uppercase' }}>{ec2.statusCheckInstance}</div>
          <div className="metric-card-sublabel">Operating system & application health</div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-4 mb-xl">
        <div className={`metric-card ${ec2.cpuUtilization > 80 ? 'critical' : ec2.cpuUtilization > 60 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${ec2.cpuUtilization > 80 ? 'critical' : ec2.cpuUtilization > 60 ? 'warning' : 'healthy'}`}>
              <Cpu size={20} />
            </div>
          </div>
          <div className="metric-card-label">CPU Utilization</div>
          <div className="metric-card-value">{ec2.cpuUtilization.toFixed(1)}%</div>
          <div className="metric-card-sublabel">Threshold: 80%</div>
        </div>
        <div className={`metric-card ${ec2.memoryUtilization > 90 ? 'critical' : ec2.memoryUtilization > 70 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${ec2.memoryUtilization > 90 ? 'critical' : ec2.memoryUtilization > 70 ? 'warning' : 'healthy'}`}>
              <MemoryStick size={20} />
            </div>
          </div>
          <div className="metric-card-label">Memory Utilization</div>
          <div className="metric-card-value">{ec2.memoryUtilization.toFixed(1)}%</div>
          <div className="metric-card-sublabel">Threshold: 90%</div>
        </div>
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Network size={20} /></div>
          </div>
          <div className="metric-card-label">Network In</div>
          <div className="metric-card-value">{ec2.networkIn.toFixed(0)}</div>
          <div className="metric-card-sublabel">KB/s incoming</div>
        </div>
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><HardDrive size={20} /></div>
          </div>
          <div className="metric-card-label">Disk Write Ops</div>
          <div className="metric-card-value">{ec2.diskWriteOps}</div>
          <div className="metric-card-sublabel">Operations/sec</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-2 mb-xl">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">CPU Utilization (%)</div>
            <div className="chart-subtitle">Real-time 5-min window</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={metrics.ec2Cpu}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="value" name="CPU %" stroke="#3b82f6" fill="url(#cpuGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Memory Utilization (%)</div>
            <div className="chart-subtitle">Real-time 5-min window</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={metrics.ec2Memory}>
              <defs>
                <linearGradient id="memGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="value" name="Memory %" stroke="#8b5cf6" fill="url(#memGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-2">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Network In (KB/s)</div>
            <div className="chart-subtitle">Incoming network traffic</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics.ec2NetworkIn}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" name="KB/s" stroke="#10b981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Network Out (KB/s)</div>
            <div className="chart-subtitle">Outgoing network traffic</div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={metrics.ec2NetworkOut}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="value" name="KB/s" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

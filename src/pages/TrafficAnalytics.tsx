import { useState, useEffect } from 'react';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  Globe,
  Zap,
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
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

export default function TrafficAnalytics() {
  const [state, setState] = useState<SimulationState | null>(null);

  useEffect(() => {
    const engine = getSimulationEngine();
    return engine.subscribe(setState);
  }, []);

  if (!state) return null;

  const { traffic } = state;
  const recentTraffic = traffic.slice(-30);

  const totalReqs = recentTraffic.reduce((s, t) => s + t.requests, 0);
  const avgResponse = recentTraffic.length > 0
    ? recentTraffic.reduce((s, t) => s + t.responseTime, 0) / recentTraffic.length
    : 0;
  const avgErrorRate = recentTraffic.length > 0
    ? recentTraffic.reduce((s, t) => s + t.errorRate, 0) / recentTraffic.length
    : 0;
  const peakRequests = Math.max(...recentTraffic.map((t) => t.requests), 0);

  // Aggregate status codes
  const statusCodeTotals = recentTraffic.reduce(
    (acc, t) => ({
      '2xx': acc['2xx'] + t.statusCodes['2xx'],
      '3xx': acc['3xx'] + t.statusCodes['3xx'],
      '4xx': acc['4xx'] + t.statusCodes['4xx'],
      '5xx': acc['5xx'] + t.statusCodes['5xx'],
    }),
    { '2xx': 0, '3xx': 0, '4xx': 0, '5xx': 0 }
  );

  const statusCodeData = [
    { name: '2xx Success', value: statusCodeTotals['2xx'], color: '#10b981' },
    { name: '3xx Redirect', value: statusCodeTotals['3xx'], color: '#3b82f6' },
    { name: '4xx Client Error', value: statusCodeTotals['4xx'], color: '#f59e0b' },
    { name: '5xx Server Error', value: statusCodeTotals['5xx'], color: '#ef4444' },
  ].filter((d) => d.value > 0);

  // Geographic distribution (simulated)
  const geoData = [
    { region: 'North America', requests: Math.floor(totalReqs * 0.42), percentage: 42 },
    { region: 'Europe', requests: Math.floor(totalReqs * 0.28), percentage: 28 },
    { region: 'Asia Pacific', requests: Math.floor(totalReqs * 0.18), percentage: 18 },
    { region: 'South America', requests: Math.floor(totalReqs * 0.07), percentage: 7 },
    { region: 'Other', requests: Math.floor(totalReqs * 0.05), percentage: 5 },
  ];

  const peakHoursData = [
    { hour: '00:00', requests: 45 },
    { hour: '04:00', requests: 22 },
    { hour: '08:00', requests: 120 },
    { hour: '12:00', requests: 185 },
    { hour: '16:00', requests: 165 },
    { hour: '20:00', requests: 140 },
    { hour: '23:00', requests: 78 },
  ];

  const formatTime = (ts: number) => format(new Date(ts), 'HH:mm:ss');

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Traffic Analytics</h1>
        <p>Real-time traffic monitoring, response times, and geographic distribution</p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-4 mb-xl">
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><TrendingUp size={20} /></div>
          </div>
          <div className="metric-card-label">Total Requests</div>
          <div className="metric-card-value">{totalReqs.toLocaleString()}</div>
          <div className="metric-card-sublabel">Last 30 intervals</div>
        </div>
        <div className={`metric-card ${avgResponse > 500 ? 'critical' : avgResponse > 300 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${avgResponse > 500 ? 'critical' : avgResponse > 300 ? 'warning' : 'healthy'}`}><Clock size={20} /></div>
          </div>
          <div className="metric-card-label">Avg Response Time</div>
          <div className="metric-card-value">{avgResponse.toFixed(0)}ms</div>
          <div className="metric-card-sublabel">Target: &lt;250ms</div>
        </div>
        <div className={`metric-card ${avgErrorRate > 10 ? 'critical' : avgErrorRate > 5 ? 'warning' : 'healthy'}`}>
          <div className="metric-card-header">
            <div className={`metric-card-icon ${avgErrorRate > 10 ? 'critical' : avgErrorRate > 5 ? 'warning' : 'healthy'}`}><AlertTriangle size={20} /></div>
          </div>
          <div className="metric-card-label">Error Rate</div>
          <div className="metric-card-value">{avgErrorRate.toFixed(1)}%</div>
          <div className="metric-card-sublabel">Target: &lt;2%</div>
        </div>
        <div className="metric-card info">
          <div className="metric-card-header">
            <div className="metric-card-icon info"><Zap size={20} /></div>
          </div>
          <div className="metric-card-label">Peak Requests</div>
          <div className="metric-card-value">{peakRequests}</div>
          <div className="metric-card-sublabel">Per interval</div>
        </div>
      </div>

      {/* Request Rate Chart */}
      <div className="chart-container mb-xl">
        <div className="chart-header">
          <div className="chart-title">Request Rate Over Time</div>
          <div className="chart-subtitle">Requests per interval (real-time)</div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={recentTraffic}>
            <defs>
              <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} labelFormatter={(v) => formatTime(v as number)} />
            <Area type="monotone" dataKey="requests" name="Requests" stroke="#3b82f6" fill="url(#reqGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Response Time + Error Rate */}
      <div className="grid grid-2 mb-xl">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Response Time (ms)</div>
            <div className="chart-subtitle">Average response latency</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={recentTraffic}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} labelFormatter={(v) => formatTime(v as number)} />
              <Line type="monotone" dataKey="responseTime" name="Response Time (ms)" stroke="#f59e0b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">Error Rate (%)</div>
            <div className="chart-subtitle">Percentage of failed requests</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={recentTraffic}>
              <defs>
                <linearGradient id="errGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" tickFormatter={formatTime} tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} labelFormatter={(v) => formatTime(v as number)} />
              <Area type="monotone" dataKey="errorRate" name="Error Rate (%)" stroke="#ef4444" fill="url(#errGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Codes + Geography */}
      <div className="grid grid-2 mb-xl">
        <div className="chart-container">
          <div className="chart-header">
            <div className="chart-title">HTTP Status Code Distribution</div>
            <div className="chart-subtitle">Breakdown by response category</div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusCodeData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {statusCodeData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} />
              <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card">
          <div className="chart-header mb-lg">
            <div>
              <div className="chart-title">Geographic Distribution</div>
              <div className="chart-subtitle">Traffic by region</div>
            </div>
            <Globe size={18} style={{ color: 'var(--color-text-muted)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            {geoData.map((geo) => (
              <div key={geo.region}>
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-sm font-semibold">{geo.region}</span>
                  <span className="text-xs text-muted">{geo.requests.toLocaleString()} requests ({geo.percentage}%)</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${geo.percentage}%`, height: '100%', background: 'var(--color-accent-gradient)', borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="chart-container">
        <div className="chart-header">
          <div className="chart-title">Peak Hours Analysis</div>
          <div className="chart-subtitle">Average traffic distribution by hour of day</div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={peakHoursData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: '0.8rem' }} />
            <Bar dataKey="requests" name="Avg Requests" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

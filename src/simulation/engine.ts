import { v4 as uuidv4 } from 'uuid';
import type {
  EC2Instance,
  RDSInstance,
  CloudWatchAlarm,
  CloudWatchLog,
  S3Backup,
  SNSNotification,
  MetricDataPoint,
  TrafficData,
  ServiceStatus,
  AlarmState,
  SimulationState,
  RecoveryWorkflow,
} from '../types';

// ============================================================
// Helpers
// ============================================================

function randomBetween(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomBetween(min, max));
}


// ============================================================
// Initial State Generators
// ============================================================

function createEC2Instance(): EC2Instance {
  return {
    instanceId: 'i-0a1b2c3d4e5f67890',
    instanceType: 't3.medium',
    availabilityZone: 'us-east-1a',
    state: 'running',
    publicIp: '54.210.167.204',
    privateIp: '172.31.16.42',
    launchTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    cpuUtilization: randomBetween(15, 45),
    memoryUtilization: randomBetween(30, 60),
    networkIn: randomBetween(500, 2000),
    networkOut: randomBetween(1000, 5000),
    diskReadOps: randomInt(50, 200),
    diskWriteOps: randomInt(100, 400),
    statusCheckSystem: 'passed',
    statusCheckInstance: 'passed',
  };
}

function createRDSInstance(): RDSInstance {
  return {
    dbInstanceId: 'blog-db-primary',
    engine: 'mysql',
    engineVersion: '8.0.35',
    instanceClass: 'db.t3.medium',
    availabilityZone: 'us-east-1a',
    multiAZ: true,
    status: 'available',
    connections: randomInt(5, 30),
    maxConnections: 150,
    cpuUtilization: randomBetween(10, 35),
    freeableMemory: randomBetween(1.5, 3.5),
    readIOPS: randomInt(50, 300),
    writeIOPS: randomInt(30, 200),
    readLatency: randomBetween(0.5, 3),
    writeLatency: randomBetween(1, 5),
    freeStorageSpace: randomBetween(15, 18),
    allocatedStorage: 20,
    replicaLag: randomBetween(0, 0.5),
  };
}

function createDefaultAlarms(): CloudWatchAlarm[] {
  return [
    {
      id: uuidv4(),
      alarmName: 'EC2-HighCPU-BlogServer',
      metricName: 'CPUUtilization',
      namespace: 'AWS/EC2',
      statistic: 'Average',
      threshold: 80,
      comparisonOperator: 'GreaterThanThreshold',
      evaluationPeriods: 3,
      state: 'OK',
      stateReason: 'Threshold not crossed',
      lastUpdated: new Date().toISOString(),
      service: 'EC2',
    },
    {
      id: uuidv4(),
      alarmName: 'EC2-StatusCheck-Failed',
      metricName: 'StatusCheckFailed',
      namespace: 'AWS/EC2',
      statistic: 'Maximum',
      threshold: 1,
      comparisonOperator: 'GreaterThanOrEqualToThreshold',
      evaluationPeriods: 2,
      state: 'OK',
      stateReason: 'All status checks passing',
      lastUpdated: new Date().toISOString(),
      service: 'EC2',
    },
    {
      id: uuidv4(),
      alarmName: 'RDS-HighConnections-BlogDB',
      metricName: 'DatabaseConnections',
      namespace: 'AWS/RDS',
      statistic: 'Average',
      threshold: 120,
      comparisonOperator: 'GreaterThanThreshold',
      evaluationPeriods: 2,
      state: 'OK',
      stateReason: 'Connections within normal range',
      lastUpdated: new Date().toISOString(),
      service: 'RDS',
    },
    {
      id: uuidv4(),
      alarmName: 'RDS-LowStorage-BlogDB',
      metricName: 'FreeStorageSpace',
      namespace: 'AWS/RDS',
      statistic: 'Average',
      threshold: 2,
      comparisonOperator: 'LessThanThreshold',
      evaluationPeriods: 1,
      state: 'OK',
      stateReason: 'Storage space adequate',
      lastUpdated: new Date().toISOString(),
      service: 'RDS',
    },
    {
      id: uuidv4(),
      alarmName: 'EC2-HighMemory-BlogServer',
      metricName: 'MemoryUtilization',
      namespace: 'CWAgent',
      statistic: 'Average',
      threshold: 90,
      comparisonOperator: 'GreaterThanThreshold',
      evaluationPeriods: 3,
      state: 'OK',
      stateReason: 'Memory utilization normal',
      lastUpdated: new Date().toISOString(),
      service: 'EC2',
    },
    {
      id: uuidv4(),
      alarmName: 'RDS-HighCPU-BlogDB',
      metricName: 'CPUUtilization',
      namespace: 'AWS/RDS',
      statistic: 'Average',
      threshold: 75,
      comparisonOperator: 'GreaterThanThreshold',
      evaluationPeriods: 3,
      state: 'OK',
      stateReason: 'CPU utilization within limits',
      lastUpdated: new Date().toISOString(),
      service: 'RDS',
    },
  ];
}

function createInitialBackups(): S3Backup[] {
  const backups: S3Backup[] = [];
  for (let i = 0; i < 5; i++) {
    backups.push({
      id: uuidv4(),
      bucketName: 'blog-platform-backups-us-east-1',
      key: `backups/${i === 0 ? 'rds' : 'ec2'}/backup-${Date.now() - i * 6 * 60 * 60 * 1000}.tar.gz`,
      size: randomBetween(50, 500),
      type: 'auto',
      status: 'completed',
      createdAt: new Date(Date.now() - i * 6 * 60 * 60 * 1000).toISOString(),
      duration: randomInt(30, 180),
      source: i % 2 === 0 ? 'RDS' : 'EC2',
    });
  }
  return backups;
}

// ============================================================
// Simulation Engine
// ============================================================

type SimulationListener = (state: SimulationState) => void;

class SimulationEngine {
  private state: SimulationState;
  private listeners: SimulationListener[] = [];
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private metricsHistory: {
    ec2Cpu: MetricDataPoint[];
    ec2Memory: MetricDataPoint[];
    ec2NetworkIn: MetricDataPoint[];
    ec2NetworkOut: MetricDataPoint[];
    rdsCpu: MetricDataPoint[];
    rdsConnections: MetricDataPoint[];
    rdsReadIOPS: MetricDataPoint[];
    rdsWriteIOPS: MetricDataPoint[];
    rdsLatency: MetricDataPoint[];
    rdsStorage: MetricDataPoint[];
  };

  constructor() {
    this.state = {
      ec2: createEC2Instance(),
      rds: createRDSInstance(),
      alarms: createDefaultAlarms(),
      logs: this.generateInitialLogs(),
      backups: createInitialBackups(),
      notifications: [],
      traffic: this.generateInitialTraffic(),
      recoveryWorkflows: [],
      serviceHealth: {
        ec2: 'healthy',
        rds: 'healthy',
        s3: 'healthy',
        cloudwatch: 'healthy',
        sns: 'healthy',
        overall: 'healthy',
      },
      isRunning: false,
      failureInjected: false,
    };
    this.metricsHistory = {
      ec2Cpu: [],
      ec2Memory: [],
      ec2NetworkIn: [],
      ec2NetworkOut: [],
      rdsCpu: [],
      rdsConnections: [],
      rdsReadIOPS: [],
      rdsWriteIOPS: [],
      rdsLatency: [],
      rdsStorage: [],
    };
    this.initializeMetrics();
  }

  private initializeMetrics() {
    const now = Date.now();
    for (let i = 59; i >= 0; i--) {
      const ts = now - i * 5000;
      this.metricsHistory.ec2Cpu.push({ timestamp: ts, value: randomBetween(15, 45) });
      this.metricsHistory.ec2Memory.push({ timestamp: ts, value: randomBetween(30, 60) });
      this.metricsHistory.ec2NetworkIn.push({ timestamp: ts, value: randomBetween(500, 2000) });
      this.metricsHistory.ec2NetworkOut.push({ timestamp: ts, value: randomBetween(1000, 5000) });
      this.metricsHistory.rdsCpu.push({ timestamp: ts, value: randomBetween(10, 35) });
      this.metricsHistory.rdsConnections.push({ timestamp: ts, value: randomInt(5, 30) });
      this.metricsHistory.rdsReadIOPS.push({ timestamp: ts, value: randomInt(50, 300) });
      this.metricsHistory.rdsWriteIOPS.push({ timestamp: ts, value: randomInt(30, 200) });
      this.metricsHistory.rdsLatency.push({ timestamp: ts, value: randomBetween(0.5, 5) });
      this.metricsHistory.rdsStorage.push({ timestamp: ts, value: randomBetween(15, 18) });
    }
  }

  private generateInitialLogs(): CloudWatchLog[] {
    const logs: CloudWatchLog[] = [];
    const messages = [
      { level: 'INFO' as const, message: 'Application server started successfully', source: 'EC2/WebServer' },
      { level: 'INFO' as const, message: 'Database connection pool initialized (5/150)', source: 'RDS/MySQL' },
      { level: 'INFO' as const, message: 'CloudWatch agent reporting metrics', source: 'CloudWatch/Agent' },
      { level: 'INFO' as const, message: 'S3 backup scheduler initialized', source: 'S3/BackupAgent' },
      { level: 'INFO' as const, message: 'SNS topic subscription confirmed', source: 'SNS/AlertTopic' },
      { level: 'INFO' as const, message: 'Health check endpoint responding 200 OK', source: 'EC2/HealthCheck' },
      { level: 'INFO' as const, message: 'Auto Scaling group capacity: 1/1/3 (min/desired/max)', source: 'EC2/ASG' },
      { level: 'WARNING' as const, message: 'Slow query detected: SELECT * FROM posts (234ms)', source: 'RDS/MySQL' },
      { level: 'INFO' as const, message: 'SSL certificate valid until 2027-03-15', source: 'EC2/WebServer' },
      { level: 'INFO' as const, message: 'Automated backup completed: blog-db-snapshot-auto', source: 'RDS/Backup' },
    ];

    for (let i = 0; i < messages.length; i++) {
      logs.push({
        id: uuidv4(),
        timestamp: new Date(Date.now() - (messages.length - i) * 60000).toISOString(),
        ...messages[i],
      });
    }
    return logs;
  }

  private generateInitialTraffic(): TrafficData[] {
    const traffic: TrafficData[] = [];
    const now = Date.now();
    for (let i = 59; i >= 0; i--) {
      traffic.push({
        timestamp: now - i * 60000,
        requests: randomInt(50, 200),
        responseTime: randomBetween(80, 250),
        errorRate: randomBetween(0, 2),
        statusCodes: {
          '2xx': randomInt(40, 180),
          '3xx': randomInt(5, 20),
          '4xx': randomInt(1, 10),
          '5xx': randomInt(0, 3),
        },
      });
    }
    return traffic;
  }

  subscribe(listener: SimulationListener): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l({ ...this.state }));
  }

  start() {
    if (this.intervalId) return;
    this.state.isRunning = true;
    this.intervalId = setInterval(() => this.tick(), 2000);
    this.addLog('INFO', 'Simulation engine started', 'System/Engine');
    this.notify();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.state.isRunning = false;
    this.addLog('INFO', 'Simulation engine paused', 'System/Engine');
    this.notify();
  }

  getState(): SimulationState {
    return { ...this.state };
  }

  getMetricsHistory() {
    return { ...this.metricsHistory };
  }

  // ---- TICK (main simulation loop) ----
  private tick() {
    const now = Date.now();

    if (!this.state.failureInjected) {
      // Normal operation: small fluctuations
      this.state.ec2.cpuUtilization = Math.max(5, Math.min(100, this.state.ec2.cpuUtilization + randomBetween(-5, 5)));
      this.state.ec2.memoryUtilization = Math.max(10, Math.min(100, this.state.ec2.memoryUtilization + randomBetween(-3, 3)));
      this.state.ec2.networkIn = Math.max(100, this.state.ec2.networkIn + randomBetween(-200, 200));
      this.state.ec2.networkOut = Math.max(200, this.state.ec2.networkOut + randomBetween(-300, 300));
      this.state.ec2.diskReadOps = randomInt(50, 200);
      this.state.ec2.diskWriteOps = randomInt(100, 400);

      this.state.rds.cpuUtilization = Math.max(3, Math.min(100, this.state.rds.cpuUtilization + randomBetween(-4, 4)));
      this.state.rds.connections = Math.max(1, Math.min(150, this.state.rds.connections + randomInt(-3, 3)));
      this.state.rds.readIOPS = Math.max(10, this.state.rds.readIOPS + randomInt(-30, 30));
      this.state.rds.writeIOPS = Math.max(5, this.state.rds.writeIOPS + randomInt(-20, 20));
      this.state.rds.readLatency = Math.max(0.1, this.state.rds.readLatency + randomBetween(-0.3, 0.3));
      this.state.rds.writeLatency = Math.max(0.2, this.state.rds.writeLatency + randomBetween(-0.5, 0.5));
    }

    // Push metric data points
    this.metricsHistory.ec2Cpu.push({ timestamp: now, value: this.state.ec2.cpuUtilization });
    this.metricsHistory.ec2Memory.push({ timestamp: now, value: this.state.ec2.memoryUtilization });
    this.metricsHistory.ec2NetworkIn.push({ timestamp: now, value: this.state.ec2.networkIn });
    this.metricsHistory.ec2NetworkOut.push({ timestamp: now, value: this.state.ec2.networkOut });
    this.metricsHistory.rdsCpu.push({ timestamp: now, value: this.state.rds.cpuUtilization });
    this.metricsHistory.rdsConnections.push({ timestamp: now, value: this.state.rds.connections });
    this.metricsHistory.rdsReadIOPS.push({ timestamp: now, value: this.state.rds.readIOPS });
    this.metricsHistory.rdsWriteIOPS.push({ timestamp: now, value: this.state.rds.writeIOPS });
    this.metricsHistory.rdsLatency.push({ timestamp: now, value: this.state.rds.readLatency });
    this.metricsHistory.rdsStorage.push({ timestamp: now, value: this.state.rds.freeStorageSpace });

    // Trim history to last 60 points
    const maxPoints = 60;
    Object.keys(this.metricsHistory).forEach((key) => {
      const k = key as keyof typeof this.metricsHistory;
      if (this.metricsHistory[k].length > maxPoints) {
        this.metricsHistory[k] = this.metricsHistory[k].slice(-maxPoints);
      }
    });

    // Traffic
    this.state.traffic.push({
      timestamp: now,
      requests: this.state.failureInjected ? randomInt(5, 30) : randomInt(50, 200),
      responseTime: this.state.failureInjected ? randomBetween(500, 3000) : randomBetween(80, 250),
      errorRate: this.state.failureInjected ? randomBetween(20, 60) : randomBetween(0, 2),
      statusCodes: this.state.failureInjected
        ? { '2xx': randomInt(5, 20), '3xx': randomInt(0, 5), '4xx': randomInt(5, 15), '5xx': randomInt(10, 40) }
        : { '2xx': randomInt(40, 180), '3xx': randomInt(5, 20), '4xx': randomInt(1, 10), '5xx': randomInt(0, 3) },
    });
    if (this.state.traffic.length > 60) {
      this.state.traffic = this.state.traffic.slice(-60);
    }

    // Evaluate alarms
    this.evaluateAlarms();

    // Update service health
    this.updateServiceHealth();

    // Random log entry
    if (Math.random() < 0.3) {
      const msgs = this.state.failureInjected
        ? [
            { level: 'ERROR' as const, msg: 'Connection refused: backend service unreachable', src: 'EC2/WebServer' },
            { level: 'CRITICAL' as const, msg: 'Database connection timeout after 30s', src: 'RDS/MySQL' },
            { level: 'ERROR' as const, msg: 'Health check failed: HTTP 503', src: 'EC2/HealthCheck' },
            { level: 'WARNING' as const, msg: 'Request queue depth exceeding threshold', src: 'EC2/WebServer' },
          ]
        : [
            { level: 'INFO' as const, msg: 'Request processed: GET /api/posts (142ms)', src: 'EC2/WebServer' },
            { level: 'INFO' as const, msg: 'Cache hit ratio: 87.3%', src: 'EC2/Cache' },
            { level: 'INFO' as const, msg: 'Heartbeat check: all services responding', src: 'CloudWatch/Agent' },
            { level: 'WARNING' as const, msg: `Slow query: SELECT posts WHERE category=... (${randomInt(100, 300)}ms)`, src: 'RDS/MySQL' },
          ];
      const m = msgs[randomInt(0, msgs.length)];
      this.addLog(m.level, m.msg, m.src);
    }

    this.notify();
  }

  private evaluateAlarms() {
    for (const alarm of this.state.alarms) {
      let currentValue = 0;
      let newState: AlarmState = 'OK';

      switch (alarm.metricName) {
        case 'CPUUtilization':
          currentValue = alarm.service === 'EC2' ? this.state.ec2.cpuUtilization : this.state.rds.cpuUtilization;
          break;
        case 'StatusCheckFailed':
          currentValue = this.state.ec2.statusCheckSystem === 'failed' || this.state.ec2.statusCheckInstance === 'failed' ? 1 : 0;
          break;
        case 'DatabaseConnections':
          currentValue = this.state.rds.connections;
          break;
        case 'FreeStorageSpace':
          currentValue = this.state.rds.freeStorageSpace;
          break;
        case 'MemoryUtilization':
          currentValue = this.state.ec2.memoryUtilization;
          break;
      }

      if (alarm.comparisonOperator === 'GreaterThanThreshold' || alarm.comparisonOperator === 'GreaterThanOrEqualToThreshold') {
        newState = currentValue >= alarm.threshold ? 'ALARM' : 'OK';
      } else if (alarm.comparisonOperator === 'LessThanThreshold') {
        newState = currentValue < alarm.threshold ? 'ALARM' : 'OK';
      }

      if (newState !== alarm.state) {
        alarm.state = newState;
        alarm.lastUpdated = new Date().toISOString();
        alarm.stateReason = newState === 'ALARM'
          ? `Threshold crossed: ${alarm.metricName} = ${currentValue.toFixed(1)} (threshold: ${alarm.threshold})`
          : 'Metric returned to normal range';

        if (newState === 'ALARM') {
          this.addNotification(
            'critical',
            `ALARM: ${alarm.alarmName}`,
            alarm.stateReason,
            'CloudWatch'
          );
        }
      }
    }
  }

  private updateServiceHealth() {
    const ec2State = this.state.ec2.state;
    const ec2Cpu = this.state.ec2.cpuUtilization;
    const rdsState = this.state.rds.status;
    const rdsCpu = this.state.rds.cpuUtilization;

    this.state.serviceHealth.ec2 = ec2State !== 'running' ? 'critical'
      : this.state.ec2.statusCheckSystem === 'failed' ? 'critical'
      : ec2Cpu > 80 ? 'warning'
      : 'healthy';

    this.state.serviceHealth.rds = rdsState !== 'available' ? 'critical'
      : rdsCpu > 75 ? 'warning'
      : this.state.rds.connections > 120 ? 'warning'
      : 'healthy';

    this.state.serviceHealth.s3 = 'healthy';
    this.state.serviceHealth.cloudwatch = 'healthy';
    this.state.serviceHealth.sns = 'healthy';

    const statuses: ServiceStatus[] = [
      this.state.serviceHealth.ec2,
      this.state.serviceHealth.rds,
      this.state.serviceHealth.s3,
    ];
    if (statuses.includes('critical')) {
      this.state.serviceHealth.overall = 'critical';
    } else if (statuses.includes('warning')) {
      this.state.serviceHealth.overall = 'warning';
    } else {
      this.state.serviceHealth.overall = 'healthy';
    }
  }

  // ---- PUBLIC ACTIONS ----

  addLog(level: CloudWatchLog['level'], message: string, source: string) {
    this.state.logs.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
    });
    if (this.state.logs.length > 100) {
      this.state.logs = this.state.logs.slice(-100);
    }
  }

  addNotification(severity: SNSNotification['severity'], subject: string, message: string, service: SNSNotification['service']) {
    this.state.notifications.unshift({
      id: uuidv4(),
      topicArn: 'arn:aws:sns:us-east-1:123456789012:BlogPlatform-Alerts',
      subject,
      message,
      severity,
      timestamp: new Date().toISOString(),
      read: false,
      service,
    });
    if (this.state.notifications.length > 50) {
      this.state.notifications = this.state.notifications.slice(0, 50);
    }
  }

  markNotificationRead(id: string) {
    const n = this.state.notifications.find((n) => n.id === id);
    if (n) n.read = true;
    this.notify();
  }

  markAllNotificationsRead() {
    this.state.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  // ---- FAILURE INJECTION ----

  injectFailure(type: RecoveryWorkflow['failureType']) {
    this.state.failureInjected = true;

    switch (type) {
      case 'ec2-crash':
        this.state.ec2.state = 'stopped';
        this.state.ec2.cpuUtilization = 0;
        this.state.ec2.memoryUtilization = 0;
        this.state.ec2.networkIn = 0;
        this.state.ec2.networkOut = 0;
        this.state.ec2.statusCheckSystem = 'failed';
        this.state.ec2.statusCheckInstance = 'failed';
        this.addLog('CRITICAL', 'EC2 instance i-0a1b2c3d4e5f67890 has stopped unexpectedly', 'EC2/Monitor');
        this.addNotification('critical', 'EC2 Instance Failure', 'Web server instance has crashed and is no longer responding', 'EC2');
        break;

      case 'rds-failure':
        this.state.rds.status = 'failed';
        this.state.rds.connections = 0;
        this.state.rds.cpuUtilization = 0;
        this.state.rds.readIOPS = 0;
        this.state.rds.writeIOPS = 0;
        this.addLog('CRITICAL', 'RDS instance blog-db-primary is in failed state', 'RDS/Monitor');
        this.addNotification('critical', 'RDS Database Failure', 'Primary database instance has entered failed state', 'RDS');
        break;

      case 'high-cpu':
        this.state.ec2.cpuUtilization = randomBetween(88, 99);
        this.state.ec2.memoryUtilization = randomBetween(80, 95);
        this.addLog('WARNING', `CPU utilization spike detected: ${this.state.ec2.cpuUtilization.toFixed(1)}%`, 'EC2/Monitor');
        this.addNotification('warning', 'High CPU Alert', `EC2 CPU at ${this.state.ec2.cpuUtilization.toFixed(1)}% — exceeding threshold`, 'EC2');
        break;

      case 'disk-full':
        this.state.rds.freeStorageSpace = randomBetween(0.3, 1.5);
        this.addLog('CRITICAL', `RDS free storage critically low: ${this.state.rds.freeStorageSpace.toFixed(1)} GB`, 'RDS/Monitor');
        this.addNotification('critical', 'Disk Space Critical', `Free storage: ${this.state.rds.freeStorageSpace.toFixed(1)} GB / ${this.state.rds.allocatedStorage} GB`, 'RDS');
        break;

      case 'network-issue':
        this.state.ec2.networkIn = randomBetween(0, 50);
        this.state.ec2.networkOut = randomBetween(0, 50);
        this.addLog('ERROR', 'Network connectivity degraded — packet loss detected', 'EC2/Network');
        this.addNotification('critical', 'Network Issue', 'Significant packet loss detected on web server instance', 'EC2');
        break;
    }

    this.notify();
  }

  // ---- RECOVERY ----

  async triggerRecovery(failureType: RecoveryWorkflow['failureType']): Promise<RecoveryWorkflow> {
    const workflow: RecoveryWorkflow = {
      id: uuidv4(),
      triggeredBy: 'CloudWatch Auto-Recovery',
      failureType,
      status: 'in-progress',
      startTime: new Date().toISOString(),
      steps: [
        { id: uuidv4(), name: 'Failure Detected', description: 'CloudWatch alarm triggered failure detection', status: 'completed', startTime: new Date().toISOString() },
        { id: uuidv4(), name: 'SNS Notification', description: 'Alert sent to operations team via SNS', status: 'pending' },
        { id: uuidv4(), name: 'Create Backup', description: 'Emergency backup to S3 before recovery', status: 'pending' },
        { id: uuidv4(), name: 'Stop Service', description: 'Gracefully stopping affected service', status: 'pending' },
        { id: uuidv4(), name: 'Restore/Restart', description: 'Restoring from last known good state', status: 'pending' },
        { id: uuidv4(), name: 'Health Check', description: 'Verifying service health post-recovery', status: 'pending' },
        { id: uuidv4(), name: 'Recovery Complete', description: 'All services restored to healthy state', status: 'pending' },
      ],
    };

    this.state.recoveryWorkflows.unshift(workflow);
    this.addLog('INFO', `Auto-recovery workflow initiated for ${failureType}`, 'AutoHealing/Engine');
    this.notify();

    // Simulate step-by-step recovery
    for (let i = 1; i < workflow.steps.length; i++) {
      await this.delay(randomInt(1500, 3000));
      workflow.steps[i].status = 'in-progress';
      workflow.steps[i].startTime = new Date().toISOString();
      this.notify();

      await this.delay(randomInt(1000, 2500));
      workflow.steps[i].status = 'completed';
      workflow.steps[i].endTime = new Date().toISOString();

      // Execute side effects for each step
      switch (i) {
        case 1: // SNS Notification
          this.addNotification('info', 'Recovery Started', `Auto-recovery workflow initiated for ${failureType}`, 'AutoHealing');
          break;
        case 2: // Create Backup
          this.state.backups.unshift({
            id: uuidv4(),
            bucketName: 'blog-platform-backups-us-east-1',
            key: `backups/recovery/emergency-${Date.now()}.tar.gz`,
            size: randomBetween(100, 300),
            type: 'recovery',
            status: 'completed',
            createdAt: new Date().toISOString(),
            duration: randomInt(20, 60),
            source: failureType.startsWith('rds') || failureType === 'disk-full' ? 'RDS' : 'EC2',
          });
          this.addLog('INFO', 'Emergency backup created successfully', 'S3/BackupAgent');
          break;
        case 4: // Restore/Restart
          this.restoreService(failureType);
          break;
        case 5: // Health Check
          this.addLog('INFO', 'Health check passed: all endpoints responding 200 OK', 'EC2/HealthCheck');
          break;
      }
      this.notify();
    }

    workflow.status = 'completed';
    workflow.endTime = new Date().toISOString();
    this.state.failureInjected = false;
    this.addNotification('info', 'Recovery Complete', `Service fully recovered from ${failureType}`, 'AutoHealing');
    this.addLog('INFO', `Recovery workflow completed successfully for ${failureType}`, 'AutoHealing/Engine');
    this.updateServiceHealth();
    this.notify();

    return workflow;
  }

  private restoreService(failureType: RecoveryWorkflow['failureType']) {
    switch (failureType) {
      case 'ec2-crash':
        this.state.ec2.state = 'running';
        this.state.ec2.cpuUtilization = randomBetween(15, 30);
        this.state.ec2.memoryUtilization = randomBetween(30, 50);
        this.state.ec2.networkIn = randomBetween(500, 1500);
        this.state.ec2.networkOut = randomBetween(1000, 3000);
        this.state.ec2.statusCheckSystem = 'passed';
        this.state.ec2.statusCheckInstance = 'passed';
        break;
      case 'rds-failure':
        this.state.rds.status = 'available';
        this.state.rds.connections = randomInt(5, 15);
        this.state.rds.cpuUtilization = randomBetween(10, 25);
        this.state.rds.readIOPS = randomInt(50, 150);
        this.state.rds.writeIOPS = randomInt(30, 100);
        break;
      case 'high-cpu':
        this.state.ec2.cpuUtilization = randomBetween(15, 35);
        this.state.ec2.memoryUtilization = randomBetween(30, 50);
        break;
      case 'disk-full':
        this.state.rds.freeStorageSpace = randomBetween(12, 16);
        break;
      case 'network-issue':
        this.state.ec2.networkIn = randomBetween(500, 2000);
        this.state.ec2.networkOut = randomBetween(1000, 5000);
        break;
    }
    // Reset alarms
    this.state.alarms.forEach((a) => {
      a.state = 'OK';
      a.stateReason = 'Metric returned to normal after recovery';
      a.lastUpdated = new Date().toISOString();
    });
  }

  triggerManualBackup(source: S3Backup['source']): S3Backup {
    const backup: S3Backup = {
      id: uuidv4(),
      bucketName: 'blog-platform-backups-us-east-1',
      key: `backups/manual/${source.toLowerCase()}-${Date.now()}.tar.gz`,
      size: randomBetween(50, 500),
      type: 'manual',
      status: 'in-progress',
      createdAt: new Date().toISOString(),
      duration: 0,
      source,
    };

    this.state.backups.unshift(backup);
    this.addLog('INFO', `Manual backup initiated for ${source}`, 'S3/BackupAgent');
    this.addNotification('info', 'Backup Started', `Manual backup initiated for ${source}`, 'S3');
    this.notify();

    // Simulate backup completion
    setTimeout(() => {
      backup.status = 'completed';
      backup.duration = randomInt(30, 120);
      this.addLog('INFO', `Manual backup completed for ${source} (${backup.duration}s)`, 'S3/BackupAgent');
      this.notify();
    }, randomInt(3000, 6000));

    return backup;
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  destroy() {
    this.stop();
    this.listeners = [];
  }
}

// Singleton instance
let engineInstance: SimulationEngine | null = null;

export function getSimulationEngine(): SimulationEngine {
  if (!engineInstance) {
    engineInstance = new SimulationEngine();
  }
  return engineInstance;
}

export type { SimulationEngine };

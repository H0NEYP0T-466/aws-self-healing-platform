// ============================================================
// Blog Types
// ============================================================

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export const CATEGORIES = [
  'Cloud Computing',
  'AWS',
  'DevOps',
  'Security',
  'Tutorials',
  'Architecture',
] as const;

// ============================================================
// AWS Simulation Types
// ============================================================

export type ServiceStatus = 'healthy' | 'warning' | 'critical' | 'stopped' | 'recovering';
export type AlarmState = 'OK' | 'ALARM' | 'INSUFFICIENT_DATA';
export type RecoveryStepStatus = 'pending' | 'in-progress' | 'completed' | 'failed';

export interface EC2Instance {
  instanceId: string;
  instanceType: string;
  availabilityZone: string;
  state: 'running' | 'stopped' | 'terminated' | 'pending' | 'shutting-down';
  publicIp: string;
  privateIp: string;
  launchTime: string;
  cpuUtilization: number;
  memoryUtilization: number;
  networkIn: number;
  networkOut: number;
  diskReadOps: number;
  diskWriteOps: number;
  statusCheckSystem: 'passed' | 'failed';
  statusCheckInstance: 'passed' | 'failed';
}

export interface RDSInstance {
  dbInstanceId: string;
  engine: string;
  engineVersion: string;
  instanceClass: string;
  availabilityZone: string;
  multiAZ: boolean;
  status: 'available' | 'stopped' | 'creating' | 'failed' | 'rebooting';
  connections: number;
  maxConnections: number;
  cpuUtilization: number;
  freeableMemory: number;
  readIOPS: number;
  writeIOPS: number;
  readLatency: number;
  writeLatency: number;
  freeStorageSpace: number;
  allocatedStorage: number;
  replicaLag: number;
}

export interface CloudWatchAlarm {
  id: string;
  alarmName: string;
  metricName: string;
  namespace: string;
  statistic: string;
  threshold: number;
  comparisonOperator: string;
  evaluationPeriods: number;
  state: AlarmState;
  stateReason: string;
  lastUpdated: string;
  service: 'EC2' | 'RDS' | 'S3' | 'General';
}

export interface CloudWatchLog {
  id: string;
  timestamp: string;
  message: string;
  level: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  source: string;
}

export interface S3Backup {
  id: string;
  bucketName: string;
  key: string;
  size: number;
  type: 'auto' | 'manual' | 'recovery';
  status: 'completed' | 'in-progress' | 'failed';
  createdAt: string;
  duration: number;
  source: 'EC2' | 'RDS' | 'Application';
}

export interface SNSNotification {
  id: string;
  topicArn: string;
  subject: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
  read: boolean;
  service: 'EC2' | 'RDS' | 'CloudWatch' | 'S3' | 'AutoHealing';
}

export interface MetricDataPoint {
  timestamp: number;
  value: number;
  label?: string;
}

export interface TrafficData {
  timestamp: number;
  requests: number;
  responseTime: number;
  errorRate: number;
  statusCodes: {
    '2xx': number;
    '3xx': number;
    '4xx': number;
    '5xx': number;
  };
}

export interface RecoveryStep {
  id: string;
  name: string;
  description: string;
  status: RecoveryStepStatus;
  startTime?: string;
  endTime?: string;
  duration?: number;
}

export interface RecoveryWorkflow {
  id: string;
  triggeredBy: string;
  failureType: 'ec2-crash' | 'rds-failure' | 'high-cpu' | 'disk-full' | 'network-issue';
  status: 'in-progress' | 'completed' | 'failed';
  steps: RecoveryStep[];
  startTime: string;
  endTime?: string;
}

export interface ServiceHealth {
  ec2: ServiceStatus;
  rds: ServiceStatus;
  s3: ServiceStatus;
  cloudwatch: ServiceStatus;
  sns: ServiceStatus;
  overall: ServiceStatus;
}

// ============================================================
// Dashboard State
// ============================================================

export interface SimulationState {
  ec2: EC2Instance;
  rds: RDSInstance;
  alarms: CloudWatchAlarm[];
  logs: CloudWatchLog[];
  backups: S3Backup[];
  notifications: SNSNotification[];
  traffic: TrafficData[];
  recoveryWorkflows: RecoveryWorkflow[];
  serviceHealth: ServiceHealth;
  isRunning: boolean;
  failureInjected: boolean;
}

# Self-Healing Multi-Tier Blogging Platform — AWS Infrastructure

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud (us-east-1)                     │
│                                                                  │
│  ┌──────────────────────── VPC (10.0.0.0/16) ──────────────────┐│
│  │                                                              ││
│  │  ┌─────────── Public Subnets ───────────┐                   ││
│  │  │                                       │                   ││
│  │  │  ┌─────────┐       ┌─────────┐       │                   ││
│  │  │  │ Subnet 1│       │ Subnet 2│       │                   ││
│  │  │  │ AZ: 1a  │       │ AZ: 1b  │       │                   ││
│  │  │  │10.0.1.0 │       │10.0.2.0 │       │                   ││
│  │  │  └────┬────┘       └─────────┘       │                   ││
│  │  │       │                               │                   ││
│  │  │  ┌────▼────────────────────┐         │                   ││
│  │  │  │   EC2 (t3.medium)       │         │                   ││
│  │  │  │   - Nginx Reverse Proxy │         │                   ││
│  │  │  │   - Node.js App Server  │         │                   ││
│  │  │  │   - CloudWatch Agent    │         │                   ││
│  │  │  │   Auto Scaling Group    │         │                   ││
│  │  │  └────────────┬────────────┘         │                   ││
│  │  └───────────────┼──────────────────────┘                   ││
│  │                  │                                           ││
│  │  ┌───────── Private Subnets ────────────┐                   ││
│  │  │               │                       │                   ││
│  │  │  ┌────────────▼───────────┐           │                   ││
│  │  │  │   RDS MySQL 8.0        │           │                   ││
│  │  │  │   - db.t3.medium       │           │                   ││
│  │  │  │   - Multi-AZ           │           │                   ││
│  │  │  │   - Encrypted (AES256) │           │                   ││
│  │  │  │   - Auto Backups (7d)  │           │                   ││
│  │  │  └────────────────────────┘           │                   ││
│  │  └───────────────────────────────────────┘                   ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌────────────────── Monitoring & Recovery ─────────────────────┐│
│  │                                                              ││
│  │  CloudWatch          SNS                 Lambda              ││
│  │  ┌──────────┐   ┌──────────┐   ┌──────────────────┐        ││
│  │  │ 6 Alarms │──▶│ Alert    │──▶│ Auto-Recovery    │        ││
│  │  │ Dashboard│   │ Topic    │   │ Function         │        ││
│  │  │ Logs     │   │ Email    │   │ - EC2 Restart    │        ││
│  │  │ Metrics  │   │ SMS      │   │ - RDS Reboot     │        ││
│  │  └──────────┘   └──────────┘   │ - S3 Backup      │        ││
│  │                                 └──────────────────┘        ││
│  └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌─── S3 ─────────────────────────────────────────────────────┐ │
│  │  blog-platform-backups                                      │ │
│  │  - Versioning Enabled                                       │ │
│  │  - AES256 Encryption                                        │ │
│  │  - Lifecycle: Standard → IA (30d) → Glacier (90d) → Del    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## AWS Services Used

| Service | Purpose | Configuration |
|---------|---------|---------------|
| **EC2** | Web server (Tier 1) | t3.medium, Auto Scaling (1-3), CloudWatch Agent |
| **RDS** | Database (Tier 3) | MySQL 8.0, Multi-AZ, Encrypted, Auto Backups |
| **CloudWatch** | Monitoring | 6 alarms, custom metrics, log groups, dashboard |
| **S3** | Backup storage | Versioned, encrypted, lifecycle policies |
| **SNS** | Alert notifications | Email + SMS + Lambda subscriptions |
| **Lambda** | Auto-recovery | Python 3.12, triggered by SNS on alarm |
| **VPC** | Network isolation | 2 public + 2 private subnets, NAT Gateway |
| **IAM** | Access control | Least-privilege roles for EC2, RDS, Lambda |

## Self-Healing Workflow

```
1. CloudWatch monitors EC2/RDS metrics (CPU, memory, disk, connections)
        │
        ▼
2. Alarm triggers when threshold breached (e.g., CPU > 80%)
        │
        ▼
3. SNS publishes alert to all subscribers
        │
        ├──▶ Email notification to ops team
        ├──▶ SMS alert to on-call engineer  
        └──▶ Lambda auto-recovery function
                │
                ▼
4. Lambda executes recovery workflow:
   a) Create emergency backup to S3
   b) Stop affected service gracefully
   c) Restore from last known good state
   d) Restart service
   e) Run health checks
        │
        ▼
5. Recovery notification sent via SNS
```

## CloudWatch Alarms

| Alarm | Metric | Threshold | Action |
|-------|--------|-----------|--------|
| EC2-HighCPU | CPUUtilization | > 80% (3 periods) | SNS + Lambda |
| EC2-StatusCheck | StatusCheckFailed | ≥ 1 (2 periods) | SNS + EC2 Auto-Recover |
| EC2-HighMemory | MemoryUtilization | > 90% (3 periods) | SNS |
| RDS-HighCPU | CPUUtilization | > 75% (3 periods) | SNS |
| RDS-HighConnections | DatabaseConnections | > 120 (2 periods) | SNS |
| RDS-LowStorage | FreeStorageSpace | < 2 GB (1 period) | SNS |

## Deployment

### Prerequisites
- AWS CLI configured with appropriate credentials
- An EC2 Key Pair created in the target region
- An email address for alert notifications

### Deploy the Stack

```bash
aws cloudformation deploy \
  --template-file cloudformation/main.yaml \
  --stack-name blog-platform-production \
  --parameter-overrides \
    EnvironmentName=production \
    KeyPairName=my-key-pair \
    DBMasterPassword=SecurePass123! \
    AlertEmail=ops@company.com \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

### Verify Deployment

```bash
# Check stack status
aws cloudformation describe-stacks --stack-name blog-platform-production

# Get outputs
aws cloudformation describe-stacks \
  --stack-name blog-platform-production \
  --query 'Stacks[0].Outputs'
```

## Estimated Monthly Cost

| Service | Configuration | Est. Cost |
|---------|--------------|-----------|
| EC2 | t3.medium (1 instance) | ~$30 |
| RDS | db.t3.medium (Multi-AZ) | ~$70 |
| S3 | ~10 GB storage | ~$0.25 |
| CloudWatch | 6 alarms + logs | ~$5 |
| SNS | ~1000 notifications | ~$1 |
| NAT Gateway | 1 instance | ~$32 |
| **Total** | | **~$138/month** |

> Note: Costs vary by region. Use AWS Pricing Calculator for accurate estimates.

## Security Features

- **Network Isolation**: Database in private subnets, no direct internet access
- **Security Groups**: Strict ingress rules — DB only accessible from web server
- **Encryption**: RDS storage encrypted with AES-256, S3 server-side encryption
- **SSL Enforcement**: S3 bucket policy denies non-SSL requests
- **IAM Least Privilege**: Each service has minimal required permissions
- **Multi-AZ**: RDS deployed across multiple Availability Zones

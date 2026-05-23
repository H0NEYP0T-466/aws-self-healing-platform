# 🛠️ AWS Self-Healing Platform

<p align="center">

  <!-- Core -->
  ![GitHub License](https://img.shields.io/github/license/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=brightgreen)
  ![GitHub Stars](https://img.shields.io/github/stars/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=yellow)
  ![GitHub Forks](https://img.shields.io/github/forks/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=blue)
  ![GitHub Issues](https://img.shields.io/github/issues/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=red)
  ![GitHub Pull Requests](https://img.shields.io/github/issues-pr/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=orange)
  ![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen?style=for-the-badge)

  <!-- Activity -->
  ![Last Commit](https://img.shields.io/github/last-commit/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=purple)
  ![Commit Activity](https://img.shields.io/github/commit-activity/m/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=teal)
  ![Repo Size](https://img.shields.io/github/repo-size/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=blueviolet)
  ![Code Size](https://img.shields.io/github/languages/code-size/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=indigo)

  <!-- Languages -->
  ![Top Language](https://img.shields.io/github/languages/top/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=critical)
  ![Languages Count](https://img.shields.io/github/languages/count/H0NEYP0T-466/aws-self-healing-platform?style=for-the-badge&color=success)

  <!-- Community -->
  ![Documentation](https://img.shields.io/badge/Docs-Available-green?style=for-the-badge&logo=readthedocs&logoColor=white)
  ![Open Source Love](https://img.shields.io/badge/Open%20Source-%E2%9D%A4-red?style=for-the-badge)

</p>

A **real-time dashboard and simulation engine** for a self-hosted, multi-tier blogging platform on AWS with automated failure detection, alerting, and self-healing recovery — all built with React 19, TypeScript, and Vite.

---

## 🔗 Quick Links

| Link | Description |
|------|-------------|
| 🏠 [Live Demo](#) | *(Deploy the app to see it in action)* |
| 📖 [Infrastructure Docs](infrastructure/README.md) | Full AWS architecture, CloudFormation templates & deployment guide |
| 📝 [Deployment Steps](steps.md) | Step-by-step AWS console walkthrough |
| 🐛 [Issues](https://github.com/H0NEYP0T-466/aws-self-healing-platform/issues) | Report bugs or request features |
| 🤝 [Contributing](CONTRIBUTING.md) | How to contribute to this project |

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#-usage)
- [Simulating Failures](#-simulating-failures)
- [AWS Deployment](#-aws-deployment)
- [Project Structure](#-project-structure)
- [Dependencies](#-dependencies)
- [Contributing](#-contributing)
- [License](#-license)
- [Security](#-security)
- [Code of Conduct](#-code-of-conduct)

---

## 📖 About the Project

This project demonstrates a **production-grade self-healing architecture** on AWS. It combines a React-based monitoring dashboard with real AWS infrastructure defined as CloudFormation templates. The dashboard simulates a live blogging platform running on EC2 + RDS, and lets you inject failures to watch the automated recovery workflow in action.

The self-healing pipeline works as follows:

```
CloudWatch detects anomaly → SNS publishes alert → Lambda triggers recovery
     → Emergency S3 backup → Service restart → Health check → Recovery notification
```

---

## ✨ Features

- 🖥️ **Real-time EC2 Monitoring** — CPU, memory, network, disk I/O, and status checks
- 🗄️ **RDS Database Monitoring** — Connections, IOPS, latency, storage, and CPU
- 📊 **Interactive Dashboards** — Live charts powered by Recharts
- 🔔 **SNS Alert Center** — Real-time notification feed with severity levels
- 📈 **CloudWatch Logs & Alarms** — Simulated alarm state transitions (OK → ALARM → OK)
- 💾 **S3 Backup Management** — Automated and manual backup workflows
- ⚡ **Failure Injection** — Simulate EC2 crashes, RDS failures, high CPU, disk-full, and network issues
- 🔄 **Auto-Recovery Engine** — 7-step recovery workflow with step-by-step visualization
- 📝 **Integrated Blog** — Full CRUD blogging platform with localStorage persistence
- 🎨 **Glassmorphism UI** — Modern dark theme with CSS animations and responsive sidebar
- ☁️ **CloudFormation IaC** — Complete AWS infrastructure as code (6 nested stacks)

---

## 🛠 Tech Stack

### Languages
![TypeScript](https://img.shields.io/badge/TypeScript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Python](https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![CSS3](https://img.shields.io/badge/CSS3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![YAML](https://img.shields.io/badge/YAML-%23CB171E.svg?style=for-the-badge&logo=yaml&logoColor=white)

### Frameworks & Libraries
![React](https://img.shields.io/badge/React-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-%23FF6384.svg?style=for-the-badge&logoColor=white)

### DevOps / CI / Tools
![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![CloudFormation](https://img.shields.io/badge/CloudFormation-%23FF4F8B.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

### Cloud / Hosting
![Amazon EC2](https://img.shields.io/badge/EC2-%23FF9900.svg?style=for-the-badge&logo=amazon-ec2&logoColor=white)
![Amazon RDS](https://img.shields.io/badge/RDS-%23527FFF.svg?style=for-the-badge&logo=amazon-rds&logoColor=white)
![Amazon S3](https://img.shields.io/badge/S3-%23569A31.svg?style=for-the-badge&logo=amazon-s3&logoColor=white)
![Amazon CloudWatch](https://img.shields.io/badge/CloudWatch-%23FF4F8B.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![Amazon SNS](https://img.shields.io/badge/SNS-%23DD344C.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
![AWS Lambda](https://img.shields.io/badge/Lambda-%23FF9900.svg?style=for-the-badge&logo=aws-lambda&logoColor=white)

---

## 🏗️ Architecture

```
                        AWS Cloud (us-east-1)
┌─────────────────────────────────────────────────────────────────┐
│                     VPC (10.0.0.0/16)                            │
│                                                                  │
│  ┌──────── Public Subnets ────────┐                              │
│  │  EC2 t3.medium + Auto Scaling  │                              │
│  │  Nginx + Node.js + CW Agent    │                              │
│  └───────────────┬────────────────┘                              │
│                  │                                                │
│  ┌──────── Private Subnets ───────┐                              │
│  │  RDS MySQL 8.0 Multi-AZ        │                              │
│  │  Encrypted + Auto Backups      │                              │
│  └────────────────────────────────┘                              │
│                                                                  │
│  ┌──────── Monitoring & Recovery ──────────────────────────────┐ │
│  │  CloudWatch → SNS → Lambda (Auto-Recovery)                  │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────── S3 Backup Bucket ───────────────────────────────────┐ │
│  │  Versioned + AES256 + Lifecycle Policies                    │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

> See [infrastructure/README.md](infrastructure/README.md) for the full architecture diagram, alarm tables, cost estimates, and security features.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or higher
- [npm](https://www.npmjs.com/) v10 or higher
- A modern web browser (Chrome, Firefox, Edge)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/H0NEYP0T-466/aws-self-healing-platform.git
cd aws-self-healing-platform

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build        # Compiles TypeScript and bundles with Vite
npm run preview      # Preview the production build locally
```

---

## ⚡ Usage

### Dashboard Overview

The **Dashboard** (`/dashboard`) is the main control center showing:

- Real-time EC2 and RDS health status cards
- CPU and memory utilization charts
- Active alarm summary
- Service health overview with color-coded status indicators

### Monitoring Pages

| Page | Route | What You See |
|------|-------|-------------|
| EC2 Monitor | `/ec2` | Instance details, CPU/memory/network charts, status checks |
| RDS Monitor | `/rds` | Database metrics, connections, IOPS, latency, storage |
| CloudWatch | `/cloudwatch` | All 6 alarms with state, logs stream, metric charts |
| S3 Backups | `/s3` | Backup list with sizes, types, and manual backup trigger |
| SNS Alerts | `/sns` | Notification feed with severity filtering and read/unread |
| Traffic Analytics | `/traffic` | Request volume, response times, error rates, status codes |

### Blog Platform

The integrated blog (`/`, `/post/:id`, `/editor`) supports:

- Browsing posts with category filtering and search
- Creating and editing blog posts
- Commenting on posts
- All data persisted in localStorage

---

## 💥 Simulating Failures

The **Recovery Page** (`/recovery`) lets you inject 5 types of failures and watch the automated recovery:

| Failure Type | What Happens |
|-------------|-------------|
| `ec2-crash` | Instance stops, status checks fail, traffic drops to zero |
| `rds-failure` | Database enters failed state, connections drop to 0 |
| `high-cpu` | CPU spikes to 88-99%, memory surges, slow queries appear |
| `disk-free` | RDS storage drops below 2 GB threshold |
| `network-issue` | Network I/O drops dramatically, packet loss detected |

**Recovery Workflow (7 steps):**

```
1. Failure Detected     ← CloudWatch alarm fires
2. SNS Notification     ← Alert sent to ops team
3. Create Backup        ← Emergency backup to S3
4. Stop Service         ← Graceful shutdown
5. Restore/Restart      ← Restore from last known good state
6. Health Check         ← Verify endpoints respond 200 OK
7. Recovery Complete    ← All services healthy, alarm resets to OK
```

---

## ☁️ AWS Deployment

To deploy the actual infrastructure on AWS:

1. **Read** [steps.md](steps.md) for the step-by-step console walkthrough
2. **Or deploy via CLI** using the CloudFormation templates in `infrastructure/cloudformation/`:

```bash
aws cloudformation deploy \
  --template-file infrastructure/cloudformation/main.yaml \
  --stack-name blog-platform-production \
  --parameter-overrides \
    EnvironmentName=production \
    KeyPairName=my-key-pair \
    DBMasterPassword=SecurePass123! \
    AlertEmail=ops@company.com \
  --capabilities CAPABILITY_NAMED_IAM \
  --region us-east-1
```

---

## 📂 Project Structure

```
aws-self-healing-platform/
├── infrastructure/              # AWS Infrastructure as Code
│   ├── README.md                # Architecture docs & deployment guide
│   └── cloudformation/          # 6 CloudFormation templates
│       ├── main.yaml            # Master stack (nested stacks orchestrator)
│       ├── vpc.yaml             # VPC, subnets, IGW, NAT, security groups
│       ├── ec2.yaml             # EC2 ASG, launch template, IAM role
│       ├── rds.yaml             # RDS MySQL Multi-AZ, encrypted
│       ├── s3.yaml              # S3 backup bucket with lifecycle policies
│       └── monitoring.yaml      # SNS, CloudWatch alarms, Lambda recovery
├── public/                      # Static assets
├── src/
│   ├── main.tsx                 # React entry point
│   ├── App.tsx                  # Router with 13 routes
│   ├── App.css                  # Global styles
│   ├── index.css                # Design system (CSS variables, glassmorphism)
│   ├── components/
│   │   └── Layout.tsx           # Sidebar layout, nav, notifications
│   ├── pages/
│   │   ├── BlogHome.tsx         # Blog listing with search/filter
│   │   ├── PostDetail.tsx       # Single post view with comments
│   │   ├── PostEditor.tsx       # Create/edit blog posts
│   │   ├── Dashboard.tsx        # Main monitoring dashboard
│   │   ├── EC2Monitor.tsx       # EC2 instance monitoring
│   │   ├── RDSMonitor.tsx       # RDS database monitoring
│   │   ├── CloudWatchPage.tsx   # Alarms, logs, metrics
│   │   ├── S3Backups.tsx        # Backup management
│   │   ├── SNSAlerts.tsx        # Alert notification center
│   │   ├── RecoveryPage.tsx     # Failure injection & recovery
│   │   └── TrafficAnalytics.tsx # Traffic metrics
│   ├── simulation/
│   │   └── engine.ts            # Singleton simulation engine (766 lines)
│   ├── data/
│   │   └── store.ts             # Blog CRUD with localStorage
│   └── types/
│       └── index.ts             # All TypeScript interfaces
├── index.html                   # Entry HTML
├── package.json                 # Dependencies & scripts
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite bundler config
├── eslint.config.js             # ESLint flat config
├── steps.md                     # Step-by-step AWS deployment guide
└── README.md                    # ← You are here
```

---

## 📦 Dependencies

### Runtime Dependencies

<p>
  <a href="https://www.npmjs.com/package/react"><img src="https://img.shields.io/npm/v/react?style=for-the-badge&label=React" alt="React"></a>
  <a href="https://www.npmjs.com/package/react-dom"><img src="https://img.shields.io/npm/v/react-dom?style=for-the-badge&label=React%20DOM" alt="React DOM"></a>
  <a href="https://www.npmjs.com/package/react-router-dom"><img src="https://img.shields.io/npm/v/react-router-dom?style=for-the-badge&label=React%20Router" alt="React Router"></a>
  <a href="https://www.npmjs.com/package/recharts"><img src="https://img.shields.io/npm/v/recharts?style=for-the-badge&label=Recharts" alt="Recharts"></a>
  <a href="https://www.npmjs.com/package/lucide-react"><img src="https://img.shields.io/npm/v/lucide-react?style=for-the-badge&label=Lucide%20React" alt="Lucide React"></a>
  <a href="https://www.npmjs.com/package/date-fns"><img src="https://img.shields.io/npm/v/date-fns?style=for-the-badge&label=date%2Dfns" alt="date-fns"></a>
  <a href="https://www.npmjs.com/package/uuid"><img src="https://img.shields.io/npm/v/uuid?style=for-the-badge&label=UUID" alt="UUID"></a>
</p>

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^19.2.5 | UI framework |
| `react-dom` | ^19.2.5 | DOM rendering |
| `react-router-dom` | ^7.15.1 | Client-side routing (13 routes) |
| `recharts` | ^3.8.1 | Interactive charts & graphs |
| `lucide-react` | ^1.16.0 | Icon library (500+ icons) |
| `date-fns` | ^4.2.1 | Date formatting utilities |
| `uuid` | ^14.0.0 | Unique ID generation |

### Dev / Build / Test Dependencies

<p>
  <a href="https://www.npmjs.com/package/vite"><img src="https://img.shields.io/npm/v/vite?style=for-the-badge&label=Vite" alt="Vite"></a>
  <a href="https://www.npmjs.com/package/typescript"><img src="https://img.shields.io/npm/v/typescript?style=for-the-badge&label=TypeScript" alt="TypeScript"></a>
  <a href="https://www.npmjs.com/package/@vitejs/plugin-react"><img src="https://img.shields.io/npm/v/@vitejs/plugin-react?style=for-the-badge&label=%40vitejs%2Fplugin%2Dreact" alt="@vitejs/plugin-react"></a>
  <a href="https://www.npmjs.com/package/eslint"><img src="https://img.shields.io/npm/v/eslint?style=for-the-badge&label=ESLint" alt="ESLint"></a>
  <a href="https://www.npmjs.com/package/eslint-plugin-react-hooks"><img src="https://img.shields.io/npm/v/eslint-plugin-react-hooks?style=for-the-badge&label=eslint%2Dplugin%2Dreact%2Dhooks" alt="eslint-plugin-react-hooks"></a>
  <a href="https://www.npmjs.com/package/eslint-plugin-react-refresh"><img src="https://img.shields.io/npm/v/eslint-plugin-react-refresh?style=for-the-badge&label=eslint%2Dplugin%2Dreact%2Drefresh" alt="eslint-plugin-react-refresh"></a>
  <a href="https://www.npmjs.com/package/@eslint/js"><img src="https://img.shields.io/npm/v/@eslint/js?style=for-the-badge&label=%40eslint%2Fjs" alt="@eslint/js"></a>
  <a href="https://www.npmjs.com/package/typescript-eslint"><img src="https://img.shields.io/npm/v/typescript-eslint?style=for-the-badge&label=typescript%2Deslint" alt="typescript-eslint"></a>
  <a href="https://www.npmjs.com/package/globals"><img src="https://img.shields.io/npm/v/globals?style=for-the-badge&label=Globals" alt="Globals"></a>
  <a href="https://www.npmjs.com/package/@types/react"><img src="https://img.shields.io/npm/v/@types/react?style=for-the-badge&label=%40types%2Freact" alt="@types/react"></a>
  <a href="https://www.npmjs.com/package/@types/react-dom"><img src="https://img.shields.io/npm/v/@types/react-dom?style=for-the-badge&label=%40types%2Freact%2Ddom" alt="@types/react-dom"></a>
  <a href="https://www.npmjs.com/package/@types/node"><img src="https://img.shields.io/npm/v/@types/node?style=for-the-badge&label=%40types%2Fnode" alt="@types/node"></a>
  <a href="https://www.npmjs.com/package/@types/uuid"><img src="https://img.shields.io/npm/v/@types/uuid?style=for-the-badge&label=%40types%2Fuuid" alt="@types/uuid"></a>
</p>

| Package | Version | Purpose |
|---------|---------|---------|
| `vite` | ^8.0.10 | Build tool & dev server |
| `typescript` | ~6.0.2 | Type-safe JavaScript |
| `@vitejs/plugin-react` | ^6.0.1 | React JSX transform (Oxc-based) |
| `eslint` | ^10.2.1 | Linting |
| `eslint-plugin-react-hooks` | ^7.1.1 | React hooks lint rules |
| `eslint-plugin-react-refresh` | ^0.5.2 | Fast Refresh lint rules |
| `@eslint/js` | ^10.0.1 | ESLint flat config support |
| `typescript-eslint` | ^8.58.2 | TypeScript ESLint integration |
| `globals` | ^17.5.0 | ESLint global definitions |
| `@types/react` | ^19.2.14 | React type definitions |
| `@types/react-dom` | ^19.2.3 | React DOM type definitions |
| `@types/node` | ^24.12.2 | Node.js type definitions |
| `@types/uuid` | ^10.0.0 | UUID type definitions |

---

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🛡 Security

Please review our [Security Policy](SECURITY.md) for information on reporting vulnerabilities and our responsible disclosure process.

---

## 📏 Code of Conduct

We are committed to providing a welcoming and inclusive experience. Please read our [Code of Conduct](CODE_OF_CONDUCT.md).

---

<p align="center">Made with ❤ by <a href="https://github.com/H0NEYP0T-466">H0NEYP0T-466</a></p>

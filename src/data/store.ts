import { v4 as uuidv4 } from 'uuid';
import type { BlogPost, Comment } from '../types';

const POSTS_KEY = 'blog_posts';
const COMMENTS_KEY = 'blog_comments';

// ============================================================
// Seed Data
// ============================================================

const SEED_POSTS: BlogPost[] = [
  {
    id: uuidv4(),
    title: 'Building Self-Healing Infrastructure on AWS',
    content: `## Introduction\n\nModern cloud infrastructure demands resilience. In this post, we explore how to build a self-healing multi-tier architecture on AWS that automatically detects failures and recovers without human intervention.\n\n## Architecture Overview\n\nOur self-healing platform consists of three tiers:\n\n1. **Web Tier (EC2)** — Handles incoming HTTP requests\n2. **Application Tier** — Business logic and API processing\n3. **Data Tier (RDS)** — Persistent data storage with MySQL\n\n## CloudWatch Monitoring\n\nAmazon CloudWatch is the backbone of our monitoring strategy. We configure alarms for:\n\n- **CPU Utilization** > 80% on EC2 instances\n- **Database Connections** > 120 on RDS\n- **Status Check Failures** on EC2\n- **Free Storage Space** < 2GB on RDS\n\n## Auto-Recovery Workflow\n\nWhen CloudWatch detects a failure:\n\n1. SNS sends an alert to the operations team\n2. A Lambda function triggers the recovery workflow\n3. Emergency backup is created in S3\n4. The affected service is restarted\n5. Health checks verify successful recovery\n\n## Conclusion\n\nSelf-healing infrastructure reduces MTTR (Mean Time To Recovery) and ensures high availability for your applications.`,
    excerpt: 'Learn how to build a resilient multi-tier architecture on AWS with automated failure detection and recovery.',
    category: 'AWS',
    tags: ['AWS', 'CloudWatch', 'EC2', 'Self-Healing', 'Infrastructure'],
    coverImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80',
    author: 'Cloud Architect',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 8,
    featured: true,
  },
  {
    id: uuidv4(),
    title: 'Amazon EC2 Auto Scaling: A Complete Guide',
    content: `## What is EC2 Auto Scaling?\n\nAmazon EC2 Auto Scaling helps you maintain application availability and lets you automatically add or remove EC2 instances according to conditions you define.\n\n## Key Components\n\n### Launch Templates\nA launch template specifies instance configuration information — the AMI ID, instance type, key pair, security groups, and other parameters.\n\n### Auto Scaling Groups\nAn Auto Scaling group contains a collection of EC2 instances that are treated as a logical grouping for scaling and management.\n\n### Scaling Policies\n- **Target Tracking** — Maintains a specific metric target\n- **Step Scaling** — Adjusts capacity in steps based on alarm thresholds\n- **Scheduled Scaling** — Scales based on predictable patterns\n\n## Best Practices\n\n1. Use multiple Availability Zones\n2. Configure health checks properly\n3. Set appropriate cooldown periods\n4. Monitor with CloudWatch dashboards`,
    excerpt: 'Master EC2 Auto Scaling to build highly available and cost-effective applications on AWS.',
    category: 'Cloud Computing',
    tags: ['EC2', 'Auto Scaling', 'AWS', 'High Availability'],
    coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80',
    author: 'Cloud Architect',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 6,
    featured: false,
  },
  {
    id: uuidv4(),
    title: 'Monitoring AWS Infrastructure with CloudWatch',
    content: `## CloudWatch Overview\n\nAmazon CloudWatch is a monitoring and observability service that provides data and actionable insights for AWS resources.\n\n## Key Features\n\n### Metrics\nCloudWatch collects monitoring data in the form of metrics. AWS services send metrics to CloudWatch automatically.\n\n### Alarms\nYou can create alarms that watch metrics and send notifications or automatically make changes when a threshold is breached.\n\n### Logs\nCloudWatch Logs lets you monitor, store, and access log files from EC2 instances, CloudTrail, and other sources.\n\n### Dashboards\nCustomizable home pages in the CloudWatch console that you can use to monitor resources in a single view.\n\n## Setting Up Alarms\n\n\`\`\`yaml\nHighCPUAlarm:\n  Type: AWS::CloudWatch::Alarm\n  Properties:\n    AlarmName: EC2-HighCPU\n    MetricName: CPUUtilization\n    Namespace: AWS/EC2\n    Threshold: 80\n    ComparisonOperator: GreaterThanThreshold\n    EvaluationPeriods: 3\n    Period: 300\n    Statistic: Average\n\`\`\`\n\n## Integration with SNS\n\nCloudWatch alarms can trigger SNS notifications to alert your team about infrastructure issues in real-time.`,
    excerpt: 'Deep dive into Amazon CloudWatch for comprehensive AWS infrastructure monitoring and alerting.',
    category: 'AWS',
    tags: ['CloudWatch', 'Monitoring', 'AWS', 'Alerting', 'SNS'],
    coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    author: 'Cloud Architect',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 7,
    featured: true,
  },
  {
    id: uuidv4(),
    title: 'Amazon RDS: Managed Database Best Practices',
    content: `## Why Amazon RDS?\n\nAmazon RDS makes it easy to set up, operate, and scale a relational database in the cloud. It provides cost-efficient, resizable capacity while managing time-consuming database administration tasks.\n\n## Multi-AZ Deployments\n\nMulti-AZ deployments provide enhanced availability and durability for database instances. Amazon RDS automatically provisions and maintains a synchronous standby replica in a different Availability Zone.\n\n## Automated Backups\n\nRDS creates automated backups of your DB instance during the backup window. You can recover your database to any point in time during the backup retention period.\n\n## Performance Insights\n\nAmazon RDS Performance Insights monitors your database load so you can identify and remediate performance problems.\n\n## Security\n\n- VPC for network isolation\n- Security groups for access control\n- Encryption at rest and in transit\n- IAM database authentication`,
    excerpt: 'Learn best practices for running production databases on Amazon RDS with high availability.',
    category: 'AWS',
    tags: ['RDS', 'Database', 'AWS', 'MySQL', 'High Availability'],
    coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&q=80',
    author: 'Cloud Architect',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 5,
    featured: false,
  },
  {
    id: uuidv4(),
    title: 'DevOps on AWS: CI/CD Pipeline Architecture',
    content: `## Building a CI/CD Pipeline on AWS\n\nContinuous Integration and Continuous Deployment (CI/CD) is essential for modern software delivery. AWS provides a complete set of tools to build robust pipelines.\n\n## AWS Developer Tools\n\n### CodeCommit\nFully managed source control service hosting Git repositories.\n\n### CodeBuild\nFully managed build service that compiles source code, runs tests, and produces deployable artifacts.\n\n### CodeDeploy\nAutomates application deployments to EC2 instances, Lambda functions, and ECS services.\n\n### CodePipeline\nOrchestrates the steps required to release software changes continuously.\n\n## Infrastructure as Code\n\nUse CloudFormation or CDK to define your infrastructure:\n\n\`\`\`yaml\nAWSTemplateFormatVersion: '2010-09-09'\nResources:\n  WebServer:\n    Type: AWS::EC2::Instance\n    Properties:\n      InstanceType: t3.medium\n      ImageId: ami-0c55b159cbfafe1f0\n\`\`\``,
    excerpt: 'Build production-grade CI/CD pipelines using AWS developer tools and infrastructure as code.',
    category: 'DevOps',
    tags: ['DevOps', 'CI/CD', 'AWS', 'CloudFormation', 'CodePipeline'],
    coverImage: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&q=80',
    author: 'Cloud Architect',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 6,
    featured: false,
  },
  {
    id: uuidv4(),
    title: 'Securing Your AWS Infrastructure: IAM & VPC Guide',
    content: `## Security First Approach\n\nSecurity is the top priority in cloud computing. AWS provides comprehensive security services and features.\n\n## IAM (Identity and Access Management)\n\n### Principles\n- Least privilege access\n- Use IAM roles instead of access keys\n- Enable MFA for all users\n- Regular access reviews\n\n### Policy Example\n\n\`\`\`json\n{\n  "Version": "2012-10-17",\n  "Statement": [\n    {\n      "Effect": "Allow",\n      "Action": ["s3:GetObject"],\n      "Resource": "arn:aws:s3:::blog-backups/*"\n    }\n  ]\n}\n\`\`\`\n\n## VPC Security\n\n### Security Groups\nVirtual firewalls that control inbound and outbound traffic.\n\n### NACLs\nNetwork Access Control Lists provide an additional layer of security at the subnet level.\n\n### Private Subnets\nPlace databases and application servers in private subnets with no direct internet access.`,
    excerpt: 'Comprehensive guide to securing your AWS infrastructure using IAM, VPC, and security best practices.',
    category: 'Security',
    tags: ['Security', 'IAM', 'VPC', 'AWS', 'Best Practices'],
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&q=80',
    author: 'Cloud Architect',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    readingTime: 9,
    featured: false,
  },
];

const SEED_COMMENTS: Comment[] = [
  {
    id: uuidv4(),
    postId: SEED_POSTS[0].id,
    author: 'DevOps Engineer',
    content: 'Great article! We implemented a similar self-healing setup in our production environment and it reduced our downtime by 90%.',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    postId: SEED_POSTS[0].id,
    author: 'AWS Student',
    content: 'This is exactly what I needed for my cloud computing project. The CloudWatch alarm configuration is really helpful.',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: uuidv4(),
    postId: SEED_POSTS[2].id,
    author: 'SRE Team Lead',
    content: 'CloudWatch with SNS integration has been a game-changer for our alerting pipeline. Nice overview!',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ============================================================
// Store Operations
// ============================================================

function getFromStorage<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T) {
  localStorage.setItem(key, JSON.stringify(data));
}

function seedIfEmpty() {
  const posts = getFromStorage<BlogPost[]>(POSTS_KEY, []);
  if (posts.length === 0) {
    saveToStorage(POSTS_KEY, SEED_POSTS);
    saveToStorage(COMMENTS_KEY, SEED_COMMENTS);
  }
}

// Initialize
seedIfEmpty();

// ---- Posts ----

export function getAllPosts(): BlogPost[] {
  return getFromStorage<BlogPost[]>(POSTS_KEY, []);
}

export function getPostById(id: string): BlogPost | undefined {
  return getAllPosts().find((p) => p.id === id);
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((p) => p.featured);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function searchPosts(query: string): BlogPost[] {
  const q = query.toLowerCase();
  return getAllPosts().filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.excerpt.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
  );
}

export function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'readingTime'>): BlogPost {
  const newPost: BlogPost = {
    ...post,
    id: uuidv4(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime: Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)),
  };
  const posts = getAllPosts();
  posts.unshift(newPost);
  saveToStorage(POSTS_KEY, posts);
  return newPost;
}

export function updatePost(id: string, updates: Partial<BlogPost>): BlogPost | undefined {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  posts[index] = {
    ...posts[index],
    ...updates,
    updatedAt: new Date().toISOString(),
    readingTime: updates.content
      ? Math.max(1, Math.ceil(updates.content.split(/\s+/).length / 200))
      : posts[index].readingTime,
  };
  saveToStorage(POSTS_KEY, posts);
  return posts[index];
}

export function deletePost(id: string): boolean {
  const posts = getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  saveToStorage(POSTS_KEY, filtered);
  // Also delete comments for this post
  const comments = getAllComments().filter((c) => c.postId !== id);
  saveToStorage(COMMENTS_KEY, comments);
  return true;
}

// ---- Comments ----

export function getAllComments(): Comment[] {
  return getFromStorage<Comment[]>(COMMENTS_KEY, []);
}

export function getCommentsByPost(postId: string): Comment[] {
  return getAllComments().filter((c) => c.postId === postId);
}

export function addComment(postId: string, author: string, content: string): Comment {
  const comment: Comment = {
    id: uuidv4(),
    postId,
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  const comments = getAllComments();
  comments.push(comment);
  saveToStorage(COMMENTS_KEY, comments);
  return comment;
}

export function deleteComment(id: string): boolean {
  const comments = getAllComments();
  const filtered = comments.filter((c) => c.id !== id);
  if (filtered.length === comments.length) return false;
  saveToStorage(COMMENTS_KEY, filtered);
  return true;
}

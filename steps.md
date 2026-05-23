# AWS Deployment Steps: Self-Healing Multi-Tier Blogging Platform

This document provides a simple, step-by-step guide to deploying your **Self-Healing Multi-Tier Blogging Platform** on real AWS infrastructure. It is designed to match the architecture simulated in your application, utilizing **Amazon EC2**, **Amazon RDS**, **Amazon CloudWatch**, **Amazon S3**, and **Amazon SNS**.

---

## 🏗️ Architecture Overview

Before starting, understand how the tiers connect:
*   **Web Tier (EC2)**: Runs the React frontend and backend API. Publicly accessible.
*   **Data Tier (RDS)**: Hosts a managed MySQL database. Private, accessible only by EC2.
*   **Backup Storage (S3)**: Stores database snapshots and application file backups.
*   **Monitoring (CloudWatch)**: Monitors server CPU/health and database connections.
*   **Alerting (SNS)**: Sends alerts (Email/SMS) and triggers the healing workflows.
*   **Self-Healing (Lambda)**: Automatically recovers instances or databases when alarms fire.

---

## 📦 Step 1: Create an Amazon S3 Bucket (Backup Storage)
First, we set up S3 so we have a place to save backups before configuring the servers.

1.  Open the **AWS Management Console** and search for **S3**.
2.  Click **Create bucket**.
3.  **Bucket name**: Enter a unique name, e.g., `blog-platform-backups-[your-name]`.
4.  **Region**: Select `us-east-1` (US East - N. Virginia).
5.  **Object Ownership**: Keep **ACLs disabled (recommended)**.
6.  **Block Public Access**: Keep **Block *all* public access** checked (this is a private backup bucket).
7.  **Bucket Versioning**: Choose **Enable** (helps keep historical backups safe).
8.  Scroll to the bottom and click **Create bucket**.

---

## 🗄️ Step 2: Create an Amazon RDS MySQL Database (Data Tier)
Next, we set up the relational database to store our blog posts and comments.

1.  Search for **RDS** in the AWS console.
2.  Click **Create database**.
3.  Choose **Standard create** and select **MySQL** as the engine.
4.  **Templates**: Choose **Free Tier** (or *Dev/Test* if you want Multi-AZ enabled).
5.  **Settings**:
    *   **DB instance identifier**: `blog-db-primary`
    *   **Master username**: `admin`
    *   **Master password**: Choose a secure password (e.g., `SuperSecureBlogDB123!`).
6.  **Instance configuration**: Select `db.t3.micro` (Free Tier eligible).
7.  **Connectivity**:
    *   **Public access**: Select **No** (the database must remain private).
    *   **VPC Security Group**: Select **Create new** and name it `blog-rds-sg`.
8.  Scroll to the bottom and click **Create database**. *(It will take about 5–10 minutes to spin up).*

---

## 🔔 Step 3: Create an Amazon SNS Alert Topic (Alerts & Notifications)
We need a communication channel that can send emails to engineers and trigger recovery code.

1.  Search for **Simple Notification Service (SNS)** in the console.
2.  In the left sidebar, click **Topics** -> **Create topic**.
3.  **Type**: Select **Standard**.
4.  **Name**: `BlogPlatform-Alerts`
5.  **Display name**: `BlogAlerts`
6.  Click **Create topic**.
7.  Now, create an email subscription:
    *   Inside your new topic, click **Create subscription**.
    *   **Protocol**: Select **Email**.
    *   **Endpoint**: Enter your personal email address.
    *   Click **Create subscription**.
    *   *Check your inbox and click the **Confirm Subscription** link in the email AWS sends you.*

---

## 🖥️ Step 4: Launch the Amazon EC2 Instance (Web & App Tier)
Now, we create the server that runs the blog website.

1.  Search for **EC2** in the console.
2.  Click **Launch instance**.
3.  **Name**: `Blog-Server`
4.  **Application and OS Image (AMI)**: Select **Amazon Linux 2023** (Free Tier eligible).
5.  **Instance type**: Choose `t3.micro` or `t3.medium`.
6.  **Key pair**: Click **Create new key pair**, name it `blog-key`, download the `.pem` file, and keep it safe!
7.  **Network settings**:
    *   Ensure **Auto-assign public IP** is **Enabled**.
    *   Check **Allow SSH traffic** (from your IP only).
    *   Check **Allow HTTP traffic from the internet** (to let users access the blog).
8.  **Configure Storage**: Keep the default `8 GiB` or increase to `20 GiB` gp3.
9.  Click **Launch instance**.

---

## 🛡️ Step 5: Configure Network Access & Security Groups
We must allow our EC2 instance to talk to the RDS database.

1.  In the EC2 Dashboard, under **Network & Security**, click **Security Groups**.
2.  Find the `blog-rds-sg` security group (created for your database in Step 2).
3.  Click **Actions** -> **Edit inbound rules**.
4.  Add a rule:
    *   **Type**: `MYSQL/Aurora` (Port 3306)
    *   **Source**: Choose `Custom` and select the security group of your **EC2 instance** (e.g., `launch-wizard-1`).
    *   *This configuration secures your database by ensuring only your web server can connect to it!*
5.  Click **Save rules**.

---

## 🚀 Step 6: Deploy the Web Application Code to EC2
Your EC2 UserData script automatically installs Nginx and Node.js. Nginx is configured to forward standard web traffic on **Port 80** to your app running on **Port 3000** (`proxy_pass http://localhost:3000`).

To push your web application code onto the instance and start serving the dashboard, choose **one of the two options** below:

### Option A: Clone & Run on Port 3000 via PM2 (Standard Application Server)
This option keeps your app running on Port 3000 dynamically, aligning perfectly with Nginx's reverse proxy:

1.  **SSH into your EC2 Instance** using your terminal:
    ```bash
    ssh -i "blog-key.pem" ec2-user@[YOUR-EC2-PUBLIC-IP]
    ```
2.  **Install Git on the instance**:
    ```bash
    sudo dnf install git -y   # Or sudo yum install git -y
    ```
3.  **Clone the code repository** to your server:
    ```bash
    git clone https://github.com/[YOUR-USERNAME]/[YOUR-REPOSITORY-NAME].git
    cd [YOUR-REPOSITORY-NAME]
    ```
4.  **Install project dependencies**:
    ```bash
    npm install
    ```
5.  **Build the production frontend bundle**:
    ```bash
    npm run build
    ```
6.  **Run the App on Port 3000 in the background using PM2** (ensures it stays running continuously):
    ```bash
    sudo npm install -g pm2
    # Start the Vite production server preview on port 3000, managed by PM2
    pm2 start "npm run preview -- --port 3000 --host 0.0.0.0" --name "blog-app"
    ```

---

### Option B: Local Build and Push via SCP (Direct Static Serving)
If you only need to serve the built static dashboard React files, you can bypass running Node.js on port 3000 entirely and configure Nginx to serve your compiled files directly:

1.  **Build your application locally** in your command line:
    ```bash
    npm run build
    ```
    *This generates a compiled `dist/` directory in your local folder.*
2.  **Securely upload (SCP) the built folder** to your EC2 Instance:
    ```bash
    scp -i "blog-key.pem" -r dist/* ec2-user@[YOUR-EC2-PUBLIC-IP]:/home/ec2-user/blog-site
    ```
3.  **Configure Nginx to serve the site directly**:
    SSH into the server and replace the proxy block in `/etc/nginx/conf.d/blog.conf` with direct static hosting:
    ```nginx
    server {
        listen 80;
        server_name _;
        root /home/ec2-user/blog-site;
        index index.html;
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
    ```
4.  **Restart Nginx to apply changes**:
    ```bash
    sudo systemctl restart nginx
    ```

---

## 📈 Step 7: Configure CloudWatch Alarms & Monitoring
We will configure alarms to detect when our server crashes or database is overloaded.

### EC2 Status Check Alarm (Triggers on Crash)
1.  Search for **CloudWatch** in the AWS console.
2.  In the left sidebar, click **Alarms** -> **All alarms** -> **Create alarm**.
3.  Click **Select metric**.
4.  Search for **EC2** -> **Per-Instance Metrics**. Select your `Blog-Server` and the metric `StatusCheckFailed`.
5.  Click **Select metric**.
6.  **Conditions**:
    *   **Threshold type**: Static
    *   **Whenever StatusCheckFailed is...**: `GreaterThanOrEqualTo` `1`.
    *   **Evaluation periods**: `2`.
7.  Click **Next**.
8.  **Notification Action**:
    *   Trigger: **In alarm**.
    *   Send notification to: **Select an existing SNS topic** -> Choose `BlogPlatform-Alerts`.
9.  **EC2 action**:
    *   Check **Recover this instance**. *(This is the built-in AWS self-healing mechanism that automatically moves your server to new hardware if the underlying physical host fails!)*
10. Click **Next**, name the alarm `EC2-StatusCheck-Failed`, and click **Create alarm**.

---

## ⚡ Step 8: Create the Auto-Healing AWS Lambda Function (Custom Recovery)
For custom recovery workflows (like taking an emergency RDS database backup before restarting services), we use an AWS Lambda function triggered by our SNS topic.

1.  Search for **Lambda** in the console.
2.  Click **Create function**.
3.  Choose **Author from scratch**.
4.  **Function name**: `auto-recovery-handler`
5.  **Runtime**: `Node.js 20.x` or `Python 3.12`.
6.  Click **Create function**.
7.  **Add Trigger**:
    *   Click **+ Add trigger** in the designer.
    *   Select **SNS**.
    *   Under **SNS Topic**, select `BlogPlatform-Alerts`.
    *   Click **Add**.
8.  **Code implementation**:
    In the code editor, paste your recovery script. For example, a Python script that restarts an EC2 instance using Boto3:
    ```python
    import boto3

    ec2 = boto3.client('ec2', region_name='us-east-1')
    INSTANCE_ID = 'YOUR_EC2_INSTANCE_ID'

    def lambda_handler(event, context):
        print("Alarm received via SNS. Initiating auto-recovery...")
        
        # Stop and restart instance to clear crash state
        print(f"Rebooting instance: {INSTANCE_ID}")
        ec2.reboot_instances(InstanceIds=[INSTANCE_ID])
        
        return {
            'statusCode': 200,
            'body': 'Auto-recovery reboot command sent successfully!'
        }
    ```
9.  Click **Deploy**.
10. *Note: Ensure your Lambda function's **IAM Role** has permission to reboot EC2 instances and create RDS snapshots.*

---

## 🧪 Step 9: Verify and Test the Self-Healing System

How do you know it works? We simulate a failure on the server!

1.  **Check normal state**: Access your blog URL via the EC2 Public IP address. Verify everything works.
2.  **SSH into the EC2 instance** using your terminal:
    ```bash
    ssh -i "blog-key.pem" ec2-user@[YOUR-EC2-PUBLIC-IP]
    ```
3.  **Simulate high CPU spike**: Run a stress-test command on your EC2 instance:
    ```bash
    # Install stress tool
    sudo amazon-linux-extras install stress -y  # Or sudo dnf install stress -y
    # Run stress on all CPUs
    stress --cpu 4 --timeout 300
    ```
4.  **Watch the healing system**:
    *   Go to **CloudWatch Alarms**; your high CPU alarm will transition to the red **ALARM** state.
    *   You will receive an **SNS Email Alert** saying `ALARM: EC2-HighCPU-BlogServer`.
    *   Your **Lambda function** will be triggered automatically, log the incident, and handle any configured custom actions (e.g., scale out or auto-reboot).
    *   Once the stress test ends or the server auto-recovers, the alarm will transition back to the green **OK** state!

Congratulations! You have set up a real, fully automated, resilient multi-tier self-healing blogging platform on AWS! 🚀

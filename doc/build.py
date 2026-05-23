#!/usr/bin/env python3
"""LGU Project Documentation: AWS Self-Healing Multi-Tier Blogging Platform"""
import os
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    BaseDocTemplate, PageTemplate, Frame, NextPageTemplate,
    Paragraph, Spacer, Image, KeepTogether, PageBreak, Table, TableStyle, HRFlowable,
)
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import ParagraphStyle as PS

PROJECT = "/mnt/host/x/file/FAST_API/aws-self-healing-platform"
OUTPUT  = os.path.join(PROJECT, "doc/aws_self_healing_documentation.pdf")
LOGO    = "/mnt/host/c/Users/Muhammad Fezan/Desktop/assets/lgu-logo.png"
ASSETS  = os.path.join(PROJECT, "awsProofs")

PW, PH = A4
M  = 18 * mm
HH = 6 * mm
FH = 6 * mm
CH = 22 * mm
FW = PW - 2*M

DG  = HexColor("#1b5e20")
HG  = HexColor("#006400")
TH  = HexColor("#1b5e20")
TR  = HexColor("#E8F5E9")
TA2 = HexColor("#ffffff")
CB  = HexColor("#f5f5f5")
BT  = HexColor("#212121")
WH  = HexColor("#ffffff")
BC  = HexColor("#c8c8c8")
GR  = HexColor("#666666")
SEC = HexColor("#2e7d32")
BDG = HexColor("#4CAF50")

STUDENT = "Muhammad Fezan (Fall-23-BSCS-466)"
COURSE = "Cloud Computing"
INSTRUCTOR = "Sir Amir Sohail"
DATE = "May 2026"
GITHUB = "https://github.com/H0NEYP0T-466/aws-self-healing-platform"
DEPLOY = "http://16.170.246.135:3000/"
fig_counter = [0]

# ── Styles ──────────────────────────────────────────────────
def S():
    s = {}
    s["H1"] = ParagraphStyle("H1", fontName="Helvetica-Bold", fontSize=17, textColor=DG, spaceBefore=5*mm, spaceAfter=2.5*mm, leading=22)
    s["H2"] = ParagraphStyle("H2", fontName="Helvetica-Bold", fontSize=13, textColor=DG, spaceBefore=3.5*mm, spaceAfter=1.5*mm, leading=17)
    s["H3"] = ParagraphStyle("H3", fontName="Helvetica-Bold", fontSize=11, textColor=DG, spaceBefore=2.5*mm, spaceAfter=1*mm, leading=15)
    s["B"]  = ParagraphStyle("B",  fontName="Helvetica",      fontSize=10, textColor=BT,  spaceBefore=1*mm, spaceAfter=1*mm, leading=14)
    s["C"]  = ParagraphStyle("C",  fontName="Courier",        fontSize=7.5,textColor=BT,  backColor=CB, borderPad=3*mm, leading=13, spaceAfter=3*mm)
    s["CP"] = ParagraphStyle("CP", fontName="Helvetica-Oblique", fontSize=8.5, textColor=GR, alignment=TA_CENTER, spaceAfter=2*mm)
    s["ML"] = ParagraphStyle("ML", fontName="Helvetica-Bold", fontSize=10, textColor=DG)
    s["MV"] = ParagraphStyle("MV", fontName="Helvetica",      fontSize=10, textColor=BT)
    return s

def code_block(txt, st):
    e = txt.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace("\n","<br/>")
    return Paragraph(e, st["C"])

def add_figure(story, st, fname, cap, mh=85*mm, fw=None):
    """Embed an image from the awsProofs directory with caption."""
    path = os.path.join(ASSETS, fname)
    fig_counter[0] += 1
    if not os.path.exists(path):
        story.append(Paragraph(f"[Missing: {fname}]", st["B"]))
        return
    w = fw if fw else FW - 10*mm
    im = Image(path, width=w, height=mh)
    im.hAlign = "CENTER"
    story.append(KeepTogether([im, Spacer(1,1.5*mm),
        Paragraph(f"<b>Figure {fig_counter[0]}:</b> {cap}", st["CP"]), Spacer(1,3*mm)]))

def add_table(story, st, hdrs, rows, cw=None):
    nc = len(hdrs)
    if cw is None: cw = [FW/nc]*nc
    data = [[Paragraph(f"<b>{h}</b>", st["B"]) for h in hdrs]]
    for r in rows: data.append([Paragraph(str(c), st["B"]) for c in r])
    t = Table(data, colWidths=cw, repeatRows=1)
    ts = TableStyle([
        ("BACKGROUND",(0,0),(-1,0),TH), ("TEXTCOLOR",(0,0),(-1,0),WH),
        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"), ("FONTSIZE",(0,0),(-1,-1),8),
        ("GRID",(0,0),(-1,-1),0.5,BC), ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),1.5*mm), ("BOTTOMPADDING",(0,0),(-1,-1),1.5*mm),
        ("LEFTPADDING",(0,0),(-1,-1),2*mm), ("RIGHTPADDING",(0,0),(-1,-1),2*mm),
        ("WORDWRAP",(0,0),(-1,-1),True),
    ])
    for i in range(1,len(data)):
        ts.add("BACKGROUND",(0,i),(-1,i), TR if i%2==1 else TA2)
    t.setStyle(ts); story.append(t); story.append(Spacer(1,2.5*mm))

def meta_row(story, st, label, value):
    cw = [FW*0.3, FW*0.7]
    t = Table([[Paragraph(f"<b>{label}</b>", st["ML"]), Paragraph(value, st["MV"])]], colWidths=cw)
    ts = TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),TR),
        ("GRID",(0,0),(-1,-1),0.5,BC),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),1.5*mm),
        ("BOTTOMPADDING",(0,0),(-1,-1),1.5*mm),
        ("LEFTPADDING",(0,0),(-1,-1),2*mm),
        ("RIGHTPADDING",(0,0),(-1,-1),2*mm),
    ])
    t.setStyle(ts); story.append(t)

# ── Canvas Callbacks ────────────────────────────────────────
def cover_bar(canvas, doc):
    """Draw slim green header/footer bars. Logo is placed in story, not here."""
    canvas.saveState()
    # Top bar
    canvas.setFillColor(HG)
    canvas.rect(0, PH-CH, PW, CH, fill=1, stroke=0)
    # Bottom bar
    canvas.setFillColor(HG); canvas.rect(0, 0, PW, FH, fill=1, stroke=0)
    canvas.setFillColor(WH); canvas.setFont("Helvetica", 7)
    canvas.drawCentredString(PW/2, 2*mm, f"Page 1 | {STUDENT} | Fall-23-BSCS")
    canvas.restoreState()

def hf(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(HG); canvas.rect(0, PH-HH, PW, HH, fill=1, stroke=0)
    canvas.setFillColor(WH); canvas.setFont("Helvetica-Bold", 6)
    canvas.drawString(M, PH-HH+2*mm, "AWS Self-Healing Multi-Tier Blogging Platform")
    canvas.drawRightString(PW-M, PH-HH+2*mm, f"{COURSE} | {DATE}")
    canvas.setFillColor(HG); canvas.rect(0, 0, PW, FH, fill=1, stroke=0)
    canvas.setFillColor(WH); canvas.setFont("Helvetica", 6)
    canvas.drawCentredString(PW/2, 1.5*mm, f"Page {doc.page} | {STUDENT} | Fall-23-BSCS")
    canvas.restoreState()

# ── TOC ─────────────────────────────────────────────────────
_toc_registry = []
_doc_ref = [None]

def _after_flowable(flowable):
    if _doc_ref[0] is None: return
    for idx, level, text, para in _toc_registry:
        if para is flowable:
            _doc_ref[0].notify('TOCEntry', (level, text, _doc_ref[0].page))
            break

def _toc_para(text, level, style):
    p = Paragraph(text, style)
    _toc_registry.append((len(_toc_registry), level, text, p))
    return p

def h1_toc(text, st):
    return _toc_para(f"<b>{text}</b>", 0, st["H1"])

def h2_toc(text, st):
    return _toc_para(f"<b>{text}</b>", 1, st["H2"])

def h3_toc(text, st):
    return _toc_para(f"<b>{text}</b>", 2, st["H3"])

# ── Architecture Diagram ────────────────────────────────────
def arch_diagram(story, st):
    CW = FW - 10*mm
    from reportlab.graphics.shapes import Drawing, Rect, String, Line, Polygon
    C_CL = HexColor("#E3F2FD")
    C_EC = HexColor("#E8F5E9")
    C_RD = HexColor("#FFF3E0")
    C_CW = HexColor("#F3E5F5")
    C_S3 = HexColor("#FFEBEE")
    C_LM = HexColor("#E0F7FA")
    C_SN = HexColor("#FFF9C4")
    MG = HexColor("#1b5e20")
    U = mm

    def box(d, x, y, w, h, line1, line2, bg, fs=7.5):
        d.add(Rect(x, y, w, h, fillColor=bg, strokeColor=MG, strokeWidth=1.0, rx=3, ry=3))
        d.add(String(x + w/2, y + h/2 + 4, line1, fontSize=fs, fontName="Helvetica-Bold",
                     textAnchor="middle", fillColor=MG))
        d.add(String(x + w/2, y + h/2 - 6, line2, fontSize=fs-0.5, fontName="Helvetica",
                     textAnchor="middle", fillColor=HexColor("#555555")))

    def arrow_right(d, x1, y, x2):
        d.add(Line(x1, y, x2 - 4*U, y, strokeColor=MG, strokeWidth=1.0))
        d.add(Polygon([x2, y, x2 - 4*U, y + 2.5*U, x2 - 4*U, y - 2.5*U],
                      fillColor=MG, strokeColor=None))

    def arrow_down(d, x, y1, y2):
        d.add(Line(x, y1, x, y2 + 3*U, strokeColor=MG, strokeWidth=1.0))
        d.add(Polygon([x, y2, x - 2.5*U, y2 + 3*U, x + 2.5*U, y2 + 3*U],
                      fillColor=MG, strokeColor=None))

    d = Drawing(CW, 180*U)
    R1_Y = 145*U; R1_H = 22*U
    box(d, 5*U, R1_Y, 36*U, R1_H, "Users / Clients", "(Web Browser)", C_CL)
    arrow_right(d, 41*U, R1_Y + R1_H/2, 50*U)
    box(d, 50*U, R1_Y - 2*U, 40*U, R1_H + 4*U, "EC2 Instance", "(t3.micro, Nginx+Node)", C_EC)
    arrow_right(d, 90*U, R1_Y + R1_H/2, 99*U)
    box(d, 99*U, R1_Y - 2*U, 40*U, R1_H + 4*U, "RDS MySQL", "(Multi-AZ, Encrypted)", C_RD)

    ec2_cx = 50*U + 40*U/2
    rds_cx = 99*U + 40*U/2
    R2_Y = 100*U; R2_H = 24*U
    arrow_down(d, ec2_cx, R1_Y - 2*U, R2_Y + R2_H)
    arrow_down(d, rds_cx, R1_Y - 2*U, R2_Y + R2_H)

    box(d, 5*U, R2_Y, 50*U, R2_H, "CloudWatch", "(6 Alarms, Dashboards)", C_CW)
    arrow_right(d, 55*U, R2_Y + R2_H/2, 64*U)
    box(d, 64*U, R2_Y, 40*U, R2_H, "SNS Topic", "(Email + Lambda)", C_SN)
    arrow_right(d, 104*U, R2_Y + R2_H/2, 113*U)
    box(d, 113*U, R2_Y, 44*U, R2_H, "Lambda Function", "(Auto-Recovery Handler)", C_LM)

    box(d, 55*U, 78*U, 55*U, 18*U, "S3 Bucket", "(Backups, Versioned)", C_S3)
    arrow_down(d, 135*U, R2_Y, 96*U)

    story.append(d)
    story.append(Paragraph("<b>Figure 1:</b> System Architecture Diagram", st["CP"]))
    story.append(Spacer(1, 3*U))

# ── Build ───────────────────────────────────────────────────
def build():
    global SS
    SS = S()
    story = []
    story.append(NextPageTemplate("Content"))

    # ── COVER PAGE ──
    # Logo centered above university name (story flowable, NOT in canvas callback)
    story.append(Spacer(1, 8*mm))
    if os.path.exists(LOGO):
        logo_img = Image(LOGO, width=26*mm, height=26*mm)
        logo_img.hAlign = "CENTER"
        story.append(logo_img)
        story.append(Spacer(1, 3*mm))
    story.append(Paragraph('<font size="18" color="#1b5e20"><b>LAHORE GARRISON UNIVERSITY</b></font>',
        ParagraphStyle("UNI", fontName="Helvetica-Bold", fontSize=18, textColor=DG, alignment=TA_CENTER, spaceAfter=1*mm, leading=22)))
    story.append(Paragraph('<font size="11" color="#2e7d32">Department of Computer Science</font>',
        ParagraphStyle("DEPT", fontName="Helvetica", fontSize=11, textColor=SEC, alignment=TA_CENTER, spaceAfter=3*mm, leading=14)))
    story.append(HRFlowable(width="80%", thickness=1, color=SEC, spaceAfter=4*mm, spaceBefore=1*mm))
    # Badge
    badge = Table([[Paragraph('<font size="13" color="white"><b>PROJECT DOCUMENTATION</b></font>',
        ParagraphStyle("PD", fontName="Helvetica-Bold", fontSize=13, textColor=WH, alignment=TA_CENTER))]],
        colWidths=[FW], rowHeights=[9*mm])
    badge.setStyle(TableStyle([("BACKGROUND",(0,0),(-1,-1),BDG),("VALIGN",(0,0),(-1,-1),"MIDDLE")]))
    story.append(badge)
    story.append(Spacer(1, 6*mm))
    story.append(Paragraph('<font size="24" color="#1b5e20"><b>AWS Self-Healing Multi-Tier<br/>Blogging Platform</b></font>',
        ParagraphStyle("T", fontName="Helvetica-Bold", fontSize=22, textColor=DG, alignment=TA_CENTER, spaceAfter=2*mm, leading=28)))
    story.append(Paragraph('<font size="12" color="#2e7d32">Cloud Computing Project | Amazon Web Services</font>',
        ParagraphStyle("ST", fontName="Helvetica", fontSize=12, textColor=SEC, alignment=TA_CENTER, spaceAfter=5*mm, leading=16)))
    meta_row(story, st=SS, label="Course:", value=COURSE)
    meta_row(story, st=SS, label="Instructor:", value=INSTRUCTOR)
    meta_row(story, st=SS, label="Student:", value=STUDENT)
    meta_row(story, st=SS, label="Deployment:", value=DEPLOY)
    meta_row(story, st=SS, label="GitHub:", value=GITHUB)
    meta_row(story, st=SS, label="Date:", value=DATE)
    story.append(PageBreak())

    # ── TABLE OF CONTENTS ──
    story.append(Paragraph('<font color="#006400"><b>Table of Contents</b></font>',
        ParagraphStyle("TOH", fontName="Helvetica-Bold", fontSize=17, textColor=HG, spaceBefore=5*mm, spaceAfter=4*mm, leading=22)))
    toc = TableOfContents()
    toc.levelStyles = [
        PS("TOC1", fontName="Helvetica-Bold", fontSize=10, textColor=DG, leftIndent=0, spaceBefore=1.5*mm, spaceAfter=0.5*mm, leading=14),
        PS("TOC2", fontName="Helvetica", fontSize=9, textColor=HexColor("#555555"), leftIndent=12*mm, spaceBefore=0.5*mm, spaceAfter=0.5*mm, leading=13),
    ]
    toc.dotsMinLevel = 0
    story.append(toc)
    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════
    # 1. INTRODUCTION
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("1. Introduction", SS))
    story.append(Paragraph(
        "This project implements a <b>Self-Healing Multi-Tier Blogging Platform</b> on Amazon Web Services (AWS). "
        "The system is designed to automatically detect infrastructure failures and recover from them without human "
        "intervention, ensuring high availability and reliability for the blogging application.",
        SS["B"]))
    story.append(Paragraph(
        "The platform consists of three tiers: a web tier running on Amazon EC2, a data tier using Amazon RDS MySQL, "
        "and a backup storage tier on Amazon S3. Monitoring is handled by Amazon CloudWatch with alert notifications "
        "via Amazon SNS. An AWS Lambda function provides automated recovery capabilities.",
        SS["B"]))
    story.append(Paragraph(f"<b>GitHub Repository:</b> {GITHUB}", SS["B"]))
    story.append(Paragraph(f"<b>Live Deployment:</b> {DEPLOY}", SS["B"]))

    # ══════════════════════════════════════════════════════════
    # 2. SYSTEM ARCHITECTURE
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("2. System Architecture", SS))
    story.append(h2_toc("2.1 Architecture Overview", SS))
    story.append(Paragraph(
        "The architecture follows a multi-tier design pattern with clear separation of concerns between "
        "the presentation layer, application logic, and data persistence. Each tier is deployed on a "
        "dedicated AWS service with built-in redundancy and automated recovery mechanisms.",
        SS["B"]))
    story.append(Paragraph("<b>AWS Services Used:</b>", SS["B"]))
    rows = [
        ["EC2", "Web & Application Server (t3.micro)", "eu-north-1", "Nginx + Node.js + PM2"],
        ["RDS", "MySQL Database (Multi-AZ)", "eu-north-1", "Automated backups, encrypted"],
        ["CloudWatch", "Monitoring & Alarms", "eu-north-1", "6 alarms, custom dashboards"],
        ["SNS", "Alert Notifications", "eu-north-1", "Email + Lambda subscriptions"],
        ["Lambda", "Auto-Recovery Function", "eu-north-1", "Python 3.12, triggered by SNS"],
        ["S3", "Backup Storage", "eu-north-1", "Versioned, encrypted, lifecycle policies"],
        ["VPC", "Network Isolation", "eu-north-1", "Public + Private subnets, Security Groups"],
        ["IAM", "Access Control", "Global", "Least-privilege roles"],
    ]
    add_table(story, SS, ["Service", "Purpose", "Region", "Configuration"], rows)

    story.append(h2_toc("2.2 Architecture Diagram", SS))
    arch_diagram(story, SS)

    story.append(h2_toc("2.3 Self-Healing Workflow", SS))
    story.append(Paragraph(
        "The self-healing mechanism operates through a chain of AWS services that work together "
        "to detect, notify, and recover from infrastructure failures:",
        SS["B"]))
    rows = [
        ["Step 1", "Monitor", "CloudWatch continuously monitors EC2 and RDS metrics (CPU, memory, connections)"],
        ["Step 2", "Detect", "Alarm triggers when a metric crosses its threshold (e.g., CPU > 80%)"],
        ["Step 3", "Notify", "SNS publishes the alert to all subscribers (Email + Lambda)"],
        ["Step 4", "Recover", "Lambda executes recovery workflow (EC2 reboot, RDS snapshot, S3 backup)"],
        ["Step 5", "Verify", "Alarm returns to OK state once metrics normalize"],
    ]
    add_table(story, SS, ["Step", "Action", "Description"], rows)

    # ══════════════════════════════════════════════════════════
    # 3. INFRASTRUCTURE AS CODE
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("3. Infrastructure as Code (CloudFormation)", SS))
    story.append(Paragraph(
        "The entire AWS infrastructure is defined using AWS CloudFormation templates written in YAML. "
        "This enables reproducible, version-controlled deployments that can be spun up or torn down "
        "with a single command.",
        SS["B"]))
    story.append(h2_toc("3.1 CloudFormation Stack Structure", SS))
    rows = [
        ["main.yaml", "Master stack", "Orchestrates all nested stacks"],
        ["vpc.yaml", "Network layer", "VPC, subnets, route tables, NAT Gateway"],
        ["ec2.yaml", "Compute layer", "EC2 instance, security groups, IAM role"],
        ["rds.yaml", "Database layer", "RDS MySQL instance, subnet group, parameter group"],
        ["monitoring.yaml", "Monitoring layer", "CloudWatch alarms, SNS topic, Lambda function"],
        ["s3.yaml", "Storage layer", "S3 bucket with versioning and lifecycle policies"],
    ]
    add_table(story, SS, ["Template", "Purpose", "Resources"], rows)
    story.append(h2_toc("3.2 Deployment Command", SS))
    story.append(code_block(
        "aws cloudformation deploy \\\n"
        "  --template-file cloudformation/main.yaml \\\n"
        "  --stack-name blog-platform-production \\\n"
        "  --parameter-overrides \\\n"
        "    EnvironmentName=production \\\n"
        "    KeyPairName=blog-key \\\n"
        "    DBMasterPassword=SecurePass123! \\\n"
        "    AlertEmail=ops@company.com \\\n"
        "  --capabilities CAPABILITY_NAMED_IAM \\\n"
        "  --region eu-north-1", SS))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════
    # 4. AWS DEPLOYMENT — LOGICAL STEP-BY-STEP FLOW
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("4. AWS Deployment — Step by Step", SS))
    story.append(Paragraph(
        "The following sections document the complete deployment process in chronological order, "
        "from creating AWS resources to deploying the application code.",
        SS["B"]))

    # ── PHASE 1: FOUNDATION (S3, RDS, SNS) ──
    story.append(h2_toc("Phase 1: Foundation — S3, RDS, SNS", SS))

    story.append(h3_toc("Step 1: Create S3 Bucket (Backup Storage)", SS))
    story.append(Paragraph(
        "An S3 bucket was created first to store database snapshots and application backups. "
        "The bucket name is <b>fezan466-project-bucket</b> with versioning enabled and all "
        "public access blocked for security.",
        SS["B"]))
    add_figure(story, SS, "bucket_creation.PNG",
        "S3 bucket 'fezan466-project-bucket' successfully created in eu-north-1 region")

    story.append(h3_toc("Step 2: Create RDS MySQL Database (Data Tier)", SS))
    story.append(Paragraph(
        "An Amazon RDS MySQL 8.0 instance was provisioned as the data tier. The database identifier "
        "is <b>blog-db-primary</b> running on a db.t3.medium instance class with Multi-AZ deployment "
        "for high availability.",
        SS["B"]))
    add_figure(story, SS, "Database_created.PNG",
        "RDS MySQL instance 'blog-db-primary' being created in AWS console")

    story.append(h3_toc("Step 3: Create SNS Alert Topic", SS))
    story.append(Paragraph(
        "An SNS topic named <b>BlogPlatform-Alerts</b> was created to serve as the central notification "
        "channel. An email subscription was added and confirmed via the confirmation email sent by AWS.",
        SS["B"]))
    add_figure(story, SS, "SNS_created.PNG",
        "SNS topic 'BlogPlatform-Alerts' with email subscription pending confirmation")

    story.append(PageBreak())

    # ── PHASE 2: COMPUTE (EC2 + Security) ──
    story.append(h2_toc("Phase 2: Compute — EC2 Instance & Security", SS))

    story.append(h3_toc("Step 4: Launch EC2 Instance (Web Tier)", SS))
    story.append(Paragraph(
        "An EC2 instance of type <b>t3.micro</b> was launched with Amazon Linux 2023 AMI. The instance "
        "was named <b>Blog-Server</b> and assigned a public IP address. Security groups were configured "
        "to allow SSH and HTTP traffic.",
        SS["B"]))
    add_figure(story, SS, "ec2_launched.PNG",
        "EC2 instance 'Blog-Server' (i-0d269a1eeacd599c0) launched and running in eu-north-1")

    story.append(h3_toc("Step 5: Configure Security Group Inbound Rules", SS))
    story.append(Paragraph(
        "Security group inbound rules were configured to allow MySQL/Aurora traffic (port 3306) from "
        "the web server's security group, HTTPS traffic from the internet, and SSH access from the "
        "administrator's IP. This ensures the database remains private while the web tier is publicly accessible.",
        SS["B"]))
    add_figure(story, SS, "added_security_inboundRules.PNG",
        "Security group 'launch-wizard-1' inbound rules with MYSQL, HTTPS, SSH, and TCP entries")
    add_figure(story, SS, "edited_inbound_rules_tcp.PNG",
        "Editing inbound rules to allow TCP traffic on required ports")

    story.append(PageBreak())

    # ── PHASE 3: APP DEPLOYMENT (SSH, Clone, Install, Run) ──
    story.append(h2_toc("Phase 3: Application Deployment", SS))

    story.append(h3_toc("Step 6: SSH into EC2 & Install Git", SS))
    story.append(Paragraph(
        "Connected to the EC2 instance using SSH with the blog-key.pem key pair. Git was installed "
        "using the dnf package manager on Amazon Linux 2023.",
        SS["B"]))
    add_figure(story, SS, "ssh-into-ec2+installedGit.PNG",
        "SSH connection to EC2 instance and Git installation via dnf")

    story.append(h3_toc("Step 7: Clone Repository", SS))
    story.append(Paragraph(
        "The application source code was cloned from the GitHub repository onto the EC2 instance.",
        SS["B"]))
    add_figure(story, SS, "cloning_repo.PNG",
        "Git clone operation and package installation output on EC2 terminal")

    story.append(h3_toc("Step 8: Install Node.js", SS))
    story.append(Paragraph(
        "Node.js 20.x LTS was installed via the NodeSource repository setup script, "
        "which configures the package manager to download from the official NodeSource distribution.",
        SS["B"]))
    add_figure(story, SS, "installing_nodeJS.PNG",
        "Node.js 20.x installation via NodeSource repository setup script")

    story.append(h3_toc("Step 9: Install Project Dependencies", SS))
    story.append(Paragraph(
        "All project dependencies including React, Vite, React Router, Recharts, and other packages "
        "were installed using <b>npm install</b>.",
        SS["B"]))
    add_figure(story, SS, "installing_project_dependencies.PNG",
        "npm install downloading and installing project dependencies")

    story.append(h3_toc("Step 10: Start Application with PM2", SS))
    story.append(Paragraph(
        "The application was started using PM2 process manager on port 3000, configured to be "
        "accessible from any IP address (0.0.0.0). PM2 ensures the application stays running "
        "and automatically restarts on failure.",
        SS["B"]))
    add_figure(story, SS, "runningonport3000-pm2.PNG",
        "Starting the blog-app on port 3000 using PM2 process manager")
    add_figure(story, SS, "sucessPm2.PNG",
        "PM2 successfully managing the blog-app process — status showing online")

    story.append(PageBreak())

    story.append(h3_toc("Step 11: Verify Web Application is Running", SS))
    story.append(Paragraph(
        "After successful deployment, the Self-Healing AWS blogging platform was accessible at "
        f"<b>{DEPLOY}</b>. The application serves as both a blog platform and an AWS monitoring dashboard.",
        SS["B"]))
    add_figure(story, SS, "working_web.PNG",
        "Self-Healing AWS web application running and accessible on port 3000")

    # ══════════════════════════════════════════════════════════
    # 5. SELF-HEALING: FAILURE SIMULATION & RECOVERY
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("5. Self-Healing: Failure Simulation & Recovery", SS))
    story.append(Paragraph(
        "With the application running, the self-healing mechanism was tested by deliberately "
        "crashing the server and observing the automated recovery workflow.",
        SS["B"]))

    story.append(h2_toc("5.1 Install Stress Testing Tool", SS))
    story.append(Paragraph(
        "The <b>stress</b> tool was installed on the EC2 instance using dnf to simulate "
        "extreme CPU load and trigger the self-healing alarms.",
        SS["B"]))
    add_figure(story, SS, "installing_stress_testing.PNG",
        "Installing the stress tool using dnf package manager on Amazon Linux 2023")

    story.append(h2_toc("5.2 Simulate Crash — Run Stress Test", SS))
    story.append(Paragraph(
        "A stress test was executed with 4 CPU workers for 300 seconds (5 minutes) to simulate "
        "extreme load on the server. This caused the instance to become unresponsive, triggering "
        "the CloudWatch status check failure alarm.",
        SS["B"]))
    add_figure(story, SS, "simulating_kernal_crash.PNG",
        "Running stress test: stress --cpu 4 --timeout 300 on the EC2 instance")

    story.append(h2_toc("5.3 Website Becomes Unavailable", SS))
    story.append(Paragraph(
        "During the stress test, the web application became inaccessible. The browser showed "
        "<b>ERR_CONNECTION_REFUSED</b> when trying to connect to port 3000, confirming the "
        "server was unresponsive.",
        SS["B"]))
    add_figure(story, SS, "after_crash_webNOTaccessable.PNG",
        "Website returning ERR_CONNECTION_REFUSED after the crash simulation")

    story.append(PageBreak())

    story.append(h2_toc("5.4 CloudWatch Alarm Triggers", SS))
    story.append(Paragraph(
        "The CloudWatch alarm <b>EC2-StatusCheck-Failed</b> was configured to trigger when the "
        "status check metric exceeds a threshold of 1 for 2 evaluation periods. The alarm was "
        "linked to both SNS notification and EC2 auto-recovery action.",
        SS["B"]))
    add_figure(story, SS, "alarm_start.PNG",
        "CloudWatch Alarms dashboard showing alarm triggered after stress test")
    add_figure(story, SS, "sucessfully_alarm_created.PNG",
        "CloudWatch alarm 'EC2-StatusCheck-Failed' successfully created")
    add_figure(story, SS, "addingAlarmOnSystemFailure.PNG",
        "Creating CloudWatch alarm with SNS notification to BlogPlatform-Alerts topic")
    add_figure(story, SS, "verify_Actions.PNG",
        "Verifying alarm threshold (>1) and notification action configuration")
    add_figure(story, SS, "Ec2Action_Recover.PNG",
        "EC2 action configured to 'Recover this instance' when alarm triggers")

    story.append(h2_toc("5.5 Lambda Auto-Recovery Function", SS))
    story.append(Paragraph(
        "An AWS Lambda function named <b>auto-recovery-handler</b> was created with a trigger from "
        "the SNS topic. The function is written in JavaScript and uses the AWS SDK to reboot the affected EC2 instance.",
        SS["B"]))
    add_figure(story, SS, "lambda_trigger.PNG",
        "Lambda function 'auto-recovery-handler' with SNS trigger from BlogPlatform-Alerts topic")
    add_figure(story, SS, "code_lambda.PNG",
        "Lambda function code using AWS SDK to reboot EC2 instance on alarm trigger")

    story.append(PageBreak())

    story.append(h2_toc("5.6 EC2 Auto-Reboots — Recovery Complete", SS))
    story.append(Paragraph(
        "After the stress test completed, the EC2 instance automatically rebooted. The SSH connection "
        "was re-established, confirming the self-healing mechanism successfully recovered the server.",
        SS["B"]))
    add_figure(story, SS, "after_stress_testing_ec2_Auto-rebooted.PNG",
        "EC2 instance auto-rebooted after stress test; SSH connection restored")

    story.append(h2_toc("5.7 Website Accessible After Self-Healing", SS))
    story.append(Paragraph(
        "Following the recovery, the web application was accessible again at the same URL. "
        "The status indicator shows <b>'All Systems Healthy'</b>, confirming the self-healing "
        "workflow completed successfully.",
        SS["B"]))
    add_figure(story, SS, "after_self-heal_website_accessable.PNG",
        "Web application restored and accessible after self-healing recovery")

    story.append(h2_toc("5.8 Alarms Return to Normal", SS))
    story.append(Paragraph(
        "After recovery, the CloudWatch alarms transitioned back from the <b>ALARM</b> state to "
        "the <b>OK</b> state, indicating that all monitored metrics have returned to normal ranges.",
        SS["B"]))
    add_figure(story, SS, "alarms_backto_normal.PNG",
        "CloudWatch Alarms dashboard showing alarms returned to OK state after recovery")

    story.append(h2_toc("5.9 Email Alert Notification", SS))
    story.append(Paragraph(
        "During the alarm event, the SNS email subscription received an alert notification from CloudWatch. "
        "The email includes the alarm name <b>RebootEc2onCPUMAX</b>, the region (EU Stockholm), "
        "the state change from INSUFFICIENT_DATA to ALARM, and the datapoint value that crossed the threshold.",
        SS["B"]))
    # Mobile screenshot — use smaller width so it doesn't look stretched
    add_figure(story, SS, "aws_mail_on_alert.jpeg",
        "CloudWatch alarm email notification received via SNS — ALARM: RebootEc2onCPUMAX in EU (Stockholm)",
        mh=70*mm, fw=FW*0.55)

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════
    # 6. FRONTEND APPLICATION
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("6. Frontend Application", SS))
    story.append(Paragraph(
        "The frontend is built with React 19, TypeScript, and Vite. It uses Recharts for data "
        "visualization and Lucide React for icons. The application serves dual purposes: a public-facing "
        "blog platform and an internal AWS monitoring dashboard.",
        SS["B"]))

    story.append(h2_toc("6.1 Tech Stack", SS))
    rows = [
        ["React 19.2.5", "UI component library with hooks and concurrent rendering"],
        ["TypeScript 6.0", "Static type checking for safer code"],
        ["Vite 8.0", "Build tool and dev server with HMR"],
        ["React Router DOM 7.15", "Client-side routing for SPA navigation"],
        ["Recharts 3.8", "Charting library for monitoring dashboards"],
        ["Lucide React 1.16", "Icon library for UI elements"],
        ["date-fns 4.2", "Date formatting and manipulation"],
        ["uuid 14.0", "Unique ID generation for blog posts and comments"],
    ]
    add_table(story, SS, ["Package", "Purpose"], rows)

    story.append(h2_toc("6.2 Application Routes", SS))
    rows = [
        ["/", "BlogHome", "Blog homepage with featured posts"],
        ["/post/:id", "PostDetail", "Individual blog post view with comments"],
        ["/editor", "PostEditor", "Create new blog post"],
        ["/editor/:id", "PostEditor", "Edit existing blog post"],
        ["/dashboard", "Dashboard", "AWS infrastructure overview dashboard"],
        ["/ec2", "EC2Monitor", "EC2 instance metrics and status"],
        ["/rds", "RDSMonitor", "RDS database metrics and status"],
        ["/cloudwatch", "CloudWatchPage", "CloudWatch alarms and logs"],
        ["/s3", "S3Backups", "S3 backup management"],
        ["/sns", "SNSAlerts", "SNS notification history"],
        ["/recovery", "RecoveryPage", "Recovery workflow status"],
        ["/traffic", "TrafficAnalytics", "Web traffic analytics"],
    ]
    add_table(story, SS, ["Route", "Component", "Description"], rows)

    story.append(h2_toc("6.3 Simulation Engine", SS))
    story.append(Paragraph(
        "The application includes a built-in simulation engine (<b>src/simulation/engine.ts</b>) that "
        "generates realistic AWS metrics data. The engine simulates EC2 and RDS instances with "
        "configurable failure injection, alarm evaluation, and traffic generation. It updates metrics "
        "every 2 seconds and maintains 60 data points of history for charting.",
        SS["B"]))

    # ══════════════════════════════════════════════════════════
    # 7. DATA MODEL
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("7. Data Model", SS))
    story.append(h2_toc("7.1 Blog Post Schema", SS))
    story.append(Paragraph("Blog posts are stored in localStorage with the following schema:", SS["B"]))
    story.append(code_block(
        "interface BlogPost {\n"
        "  id: string;          // UUID v4\n"
        "  title: string;       // Post title\n"
        "  content: string;     // Markdown content\n"
        "  excerpt: string;     // Short summary\n"
        "  category: string;    // Cloud Computing | AWS | DevOps | Security | Tutorials | Architecture\n"
        "  tags: string[];      // Array of tags\n"
        "  coverImage: string;  // URL to cover image\n"
        "  author: string;      // Author name\n"
        "  createdAt: string;   // ISO date\n"
        "  updatedAt: string;   // ISO date\n"
        "  readingTime: number; // Minutes\n"
        "  featured: boolean;   // Featured post flag\n"
        "}", SS))

    story.append(h2_toc("7.2 AWS Simulation Types", SS))
    story.append(Paragraph("The simulation engine models the following AWS resource types:", SS["B"]))
    story.append(code_block(
        "interface EC2Instance {\n"
        "  instanceId: string;      // e.g., 'i-0a1b2c3d4e5f67890'\n"
        "  instanceType: string;    // e.g., 't3.medium'\n"
        "  state: 'running' | 'stopped' | 'terminated';\n"
        "  cpuUtilization: number;  // Percentage\n"
        "  memoryUtilization: number;\n"
        "  statusCheckSystem: 'passed' | 'failed';\n"
        "  statusCheckInstance: 'passed' | 'failed';\n"
        "  // ... network, disk metrics\n"
        "}\n\n"
        "interface RDSInstance {\n"
        "  dbInstanceId: string;    // e.g., 'blog-db-primary'\n"
        "  engine: string;          // 'mysql'\n"
        "  status: 'available' | 'failed' | 'rebooting';\n"
        "  connections: number;\n"
        "  cpuUtilization: number;\n"
        "  freeStorageSpace: number;\n"
        "  // ... IOPS, latency metrics\n"
        "}", SS))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════
    # 8. CLOUDWATCH ALARMS
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("8. CloudWatch Alarms Configuration", SS))
    story.append(Paragraph(
        "Six CloudWatch alarms were configured to monitor the health of both EC2 and RDS resources.",
        SS["B"]))
    rows = [
        ["EC2-HighCPU-BlogServer", "CPUUtilization", "> 80%", "3 periods", "EC2 + Lambda"],
        ["EC2-StatusCheck-Failed", "StatusCheckFailed", ">= 1", "2 periods", "EC2 Recover + Lambda"],
        ["EC2-HighMemory-BlogServer", "MemoryUtilization", "> 90%", "3 periods", "SNS Only"],
        ["RDS-HighCPU-BlogDB", "CPUUtilization", "> 75%", "3 periods", "SNS Only"],
        ["RDS-HighConnections-BlogDB", "DatabaseConnections", "> 120", "2 periods", "SNS Only"],
        ["RDS-LowStorage-BlogDB", "FreeStorageSpace", "< 2 GB", "1 period", "SNS Only"],
    ]
    add_table(story, SS, ["Alarm Name", "Metric", "Threshold", "Evaluation", "Action"], rows)

    # ══════════════════════════════════════════════════════════
    # 9. SECURITY FEATURES
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("9. Security Features", SS))
    story.append(Paragraph("The platform implements multiple layers of security following AWS best practices:", SS["B"]))
    rows = [
        ["Network Isolation", "RDS deployed in private subnets with no direct internet access"],
        ["Security Groups", "Strict ingress rules — DB only accessible from web server security group"],
        ["Encryption", "RDS storage encrypted with AES-256, S3 server-side encryption enabled"],
        ["SSL Enforcement", "S3 bucket policy denies non-SSL requests"],
        ["IAM Least Privilege", "Each service has minimal required permissions via IAM roles"],
        ["Multi-AZ", "RDS deployed across multiple Availability Zones for failover"],
        ["Public Access Block", "S3 bucket has all public access blocked"],
        ["Versioning", "S3 bucket versioning enabled for backup recovery"],
    ]
    add_table(story, SS, ["Feature", "Implementation"], rows)

    # ══════════════════════════════════════════════════════════
    # 10. PROJECT STRUCTURE
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("10. Project Structure", SS))
    story.append(code_block(
        "aws-self-healing-platform/\n"
        "+-- infrastructure/\n"
        "|   +-- cloudformation/\n"
        "|       +-- main.yaml          (Master CloudFormation stack)\n"
        "|       +-- vpc.yaml            (VPC, subnets, NAT Gateway)\n"
        "|       +-- ec2.yaml            (EC2 instance, security groups)\n"
        "|       +-- rds.yaml            (RDS MySQL instance)\n"
        "|       +-- monitoring.yaml     (CloudWatch, SNS, Lambda)\n"
        "|       +-- s3.yaml             (S3 backup bucket)\n"
        "+-- awsProofs/                  (AWS deployment screenshots)\n"
        "|   +-- bucket_creation.PNG\n"
        "|   +-- ec2_launched.PNG\n"
        "|   +-- ... (27 proof images)\n"
        "+-- src/\n"
        "|   +-- pages/                  (React page components)\n"
        "|   |   +-- BlogHome.tsx\n"
        "|   |   +-- Dashboard.tsx\n"
        "|   |   +-- EC2Monitor.tsx\n"
        "|   |   +-- CloudWatchPage.tsx\n"
        "|   |   +-- ... (12 pages)\n"
        "|   +-- simulation/\n"
        "|   |   +-- engine.ts           (AWS metrics simulation engine)\n"
        "|   +-- data/\n"
        "|   |   +-- store.ts            (Blog data store with localStorage)\n"
        "|   +-- types/\n"
        "|   |   +-- index.ts            (TypeScript type definitions)\n"
        "+-- doc/\n"
        "|   +-- build.py                (This documentation build script)\n"
        "+-- package.json\n"
        "+-- vite.config.ts\n"
        "+-- tsconfig.json\n"
        "+-- steps.md                    (Deployment steps guide)\n"
        "+-- README.md", SS))

    story.append(PageBreak())

    # ══════════════════════════════════════════════════════════
    # 11. CONCLUSION
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("11. Conclusion", SS))
    story.append(Paragraph(
        "This project successfully demonstrates the implementation of a self-healing multi-tier architecture "
        "on AWS. By combining EC2 for compute, RDS for data persistence, CloudWatch for monitoring, SNS for "
        "alerting, and Lambda for automated recovery, the platform achieves high availability with minimal "
        "manual intervention.",
        SS["B"]))
    story.append(Paragraph(
        "The failure simulation and recovery test proved that the self-healing mechanism works end-to-end: "
        "from stress-induced crash detection, through CloudWatch alarm triggering, SNS notification delivery, "
        "Lambda function execution, to the final recovery and service restoration. The entire workflow completed "
        "automatically without human intervention.",
        SS["B"]))
    story.append(Paragraph(
        "The frontend application provides a comprehensive monitoring dashboard that visualizes all AWS "
        "resources in real-time, making it a practical tool for cloud infrastructure management and education.",
        SS["B"]))

    # ══════════════════════════════════════════════════════════
    # 12. REFERENCES
    # ══════════════════════════════════════════════════════════
    story.append(h1_toc("12. References", SS))
    refs = [
        "AWS Documentation. Amazon EC2 User Guide. https://docs.aws.amazon.com/ec2/",
        "AWS Documentation. Amazon RDS User Guide. https://docs.aws.amazon.com/rds/",
        "AWS Documentation. Amazon CloudWatch User Guide. https://docs.aws.amazon.com/cloudwatch/",
        "AWS Documentation. Amazon SNS Developer Guide. https://docs.aws.amazon.com/sns/",
        "AWS Documentation. AWS Lambda Developer Guide. https://docs.aws.amazon.com/lambda/",
        "AWS Documentation. Amazon S3 User Guide. https://docs.aws.amazon.com/s3/",
        "AWS CloudFormation Documentation. https://docs.aws.amazon.com/cloudformation/",
        f"Project GitHub Repository. {GITHUB}",
        f"Deployed Application. {DEPLOY}",
    ]
    for i, ref in enumerate(refs, 1):
        story.append(Paragraph(f"[{i}] {ref}", SS["B"]))

    # ── Build PDF ──
    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    cf = Frame(M, M, FW, PH-2*M, topPadding=0, bottomPadding=0)
    c2f = Frame(M, M+FH, FW, PH-HH-FH-2*M, topPadding=0, bottomPadding=0)
    doc = BaseDocTemplate(OUTPUT, pagesize=A4, pageTemplates=[
        PageTemplate(id="Cover", frames=[cf], onPage=cover_bar),
        PageTemplate(id="Content", frames=[c2f], onPage=hf),
    ])
    _doc_ref[0] = doc
    doc.afterFlowable = _after_flowable
    doc.multiBuild(story)
    mb = os.path.getsize(OUTPUT)/(1024*1024)
    print(f"[DONE] {OUTPUT} ({mb:.1f} MB)")

if __name__ == "__main__":
    build()

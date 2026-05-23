# 🛡 Security Policy

## Reporting Security Vulnerabilities

We take security seriously. If you discover a security vulnerability in this project, please report it responsibly.

### How to Report

**Please do NOT open a public GitHub issue for security vulnerabilities.**

Instead, choose one of the following:

1. **GitHub Issues** (for non-sensitive security discussions): [github.com/H0NEYP0T-466/aws-self-healing-platform/issues](https://github.com/H0NEYP0T-466/aws-self-healing-platform/issues)
2. **Direct Contact**: Open a private security advisory on the GitHub repository

### What to Include

- Description of the vulnerability
- Steps to reproduce (if applicable)
- Potential impact assessment
- Suggested fix (if you have one)

### Response Timeline

- **Acknowledgment**: Within 48 hours of receiving the report
- **Investigation**: We will investigate and provide an initial assessment within 7 days
- **Fix**: Critical issues will be prioritized and patched as quickly as possible

---

## Security Best Practices for Contributors

### 🔑 Secrets & Credentials

- **NEVER** commit API keys, passwords, tokens, or credentials to the repository
- Use environment variables for all sensitive configuration
- AWS credentials should be configured via AWS CLI or IAM roles, never hardcoded
- The `.gitignore` file should be updated to exclude any new sensitive files

### ☁️ AWS Security

- Follow the principle of **least privilege** for all IAM roles and policies
- RDS instances should always be in **private subnets** with no public access
- Enable **encryption at rest** for RDS and S3
- Use **security groups** to restrict traffic between tiers
- Never commit `.pem` key files to the repository

### 🛡 Application Security

- Validate all user inputs before processing
- Sanitize data rendered in the UI to prevent XSS
- Use parameterized queries for any database operations
- Implement rate limiting on API endpoints
- Ensure error messages don't leak sensitive information

### 📦 Dependencies

- Keep dependencies updated to patch known vulnerabilities
- Review dependency licenses before adding new packages
- Run `npm audit` regularly and address reported vulnerabilities

---

## Known Security Considerations

- The `awsProofs/` directory contains screenshots from actual AWS deployments. This directory is excluded via `.gitignore`. Ensure no credentials or sensitive data appear in screenshots before committing.
- The CloudFormation templates use a `DBMasterPassword` parameter. In production, use AWS Secrets Manager instead of passing passwords as parameters.
- The Lambda function in `monitoring.yaml` uses inline Python code. For production deployments, consider using Lambda layers or container images for better maintainability.

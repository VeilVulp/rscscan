# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: veilvulp@outlook.com

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Responsible Disclosure

We follow a coordinated disclosure policy:

1. Report the vulnerability privately
2. Allow reasonable time for a fix (typically 90 days)
3. Public disclosure after fix is released

## Security Best Practices

When using this tool:

- Only test on authorized systems
- Use in isolated environments
- Keep dependencies updated (including i18next and React)
- Follow the principle of least privilege
- Never share sensitive credentials
- Be aware of data exfiltration in multi-language environments

## Third-Party Security

### Dependencies
We regularly audit our dependencies including:
- React 19.2.1
- Electron 28
- i18next 25.x
- react-i18next 16.x
- Axios 1.13
- country-flag-icons 2.x

### Automated Scanning
We use automated tools to scan for:
- Known vulnerabilities (npm audit)
- Outdated dependencies
- Security misconfigurations
- Malicious packages

## Educational Purpose

This tool is designed for educational purposes and authorized security testing only. Misuse of this tool for malicious purposes is strictly prohibited and may be illegal.

## Security Updates

Security updates are released as soon as possible after discovery and verification. Users are encouraged to:
- Watch this repository for security announcements
- Keep the application updated to the latest version
- Subscribe to security advisories
- Review the CHANGELOG.md for security-related updates

---

**Last Updated:** December 2025

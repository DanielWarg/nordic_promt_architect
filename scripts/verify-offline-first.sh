#!/usr/bin/env bash
set -euo pipefail

# Verify that the extension follows offline-first requirements
# No network calls, no external dependencies on cloud services

echo "🔍 Verifying offline-first compliance..."

fail=0

# Check for HTTP/HTTPS imports
echo "Checking for HTTP/HTTPS imports..."
if grep -rIn --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist \
   -E "(import|require).*['\"](https?|http|fetch|axios|node-fetch|got|request)" src/; then
  echo "❌ ERROR: Network-related imports found!"
  fail=1
fi

# Check for fetch() calls
echo "Checking for fetch() calls..."
if grep -rIn --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist \
   -E "fetch\s*\(" src/; then
  echo "❌ ERROR: fetch() calls detected!"
  fail=1
fi

# Check for XMLHttpRequest
echo "Checking for XMLHttpRequest..."
if grep -rIn --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist \
   -E "XMLHttpRequest" src/; then
  echo "❌ ERROR: XMLHttpRequest usage detected!"
  fail=1
fi

# Check for cloud service URLs
echo "Checking for hardcoded cloud service URLs..."
if grep -rIn --include="*.ts" --exclude-dir=node_modules --exclude-dir=dist \
   -E "(api\.(openai|anthropic|google|aws)\.com|https?://[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})" src/; then
  echo "⚠️  WARNING: Possible cloud service URL found (may be in comments)"
  # Don't fail on this, just warn
fi

if [ $fail -eq 0 ]; then
  echo "✅ Offline-first compliance verified - no network calls detected"
  exit 0
else
  echo "❌ Offline-first compliance FAILED"
  echo ""
  echo "v1 must NOT make network calls. This violates the core 'Zero Magic, Total Control' philosophy."
  exit 1
fi


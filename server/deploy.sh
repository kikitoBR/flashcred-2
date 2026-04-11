#!/bin/bash
set -e

echo "=== FlashCred VPS Deploy Script ==="

# 1. Setup Xvfb and x11vnc as persistent systemd services
echo "[1/6] Configuring Xvfb and x11vnc display server..."
apt-get update && apt-get install -y x11vnc

cat > /etc/systemd/system/xvfb.service <<EOF
[Unit]
Description=Virtual Framebuffer Display Server
After=network.target

[Service]
ExecStart=/usr/bin/Xvfb :99 -screen 0 1366x768x24 -ac +extension GLX +render -noreset
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

cat > /etc/systemd/system/x11vnc.service <<EOF
[Unit]
Description=VNC Server for Xvfb
After=xvfb.service

[Service]
ExecStart=/usr/bin/x11vnc -display :99 -nopw -listen localhost -forever -shared
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable xvfb x11vnc
systemctl restart xvfb x11vnc
sleep 2
echo "Xvfb status: $(systemctl is-active xvfb)"
echo "x11vnc status: $(systemctl is-active x11vnc)"

# 2. Pull latest code
echo "[2/6] Pulling latest code..."
cd /var/www/flashcred
git reset --hard
git pull origin main

# 3. Install dependencies
echo "[3/6] Installing dependencies..."
cd /var/www/flashcred/server
npm install

# 4. Build (compile TypeScript to JavaScript)
echo "[4/6] Building project..."
rm -rf dist
npx tsc
echo "Build complete. Files in dist/:"
ls dist/ | head -5

# 5. Create logs directory
echo "[5/6] Setting up log directory..."
mkdir -p logs

# 6. Restart PM2 with ecosystem config
echo "[6/6] Starting server via PM2..."
pm2 delete all 2>/dev/null || true
pm2 start ecosystem.config.js
sleep 5
pm2 status

echo ""
echo "=== Deploy Complete ==="
echo "Check: curl http://localhost:3005/api/health"

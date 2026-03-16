# Ngrok Quick Start Guide

## ✅ Configuration Complete!

I've already configured your project for ngrok access:
- ✅ Vite config updated (allows network access)
- ✅ Backend CORS updated (accepts all ngrok URLs automatically)

---

## Quick Start (4 Steps)

### Step 1: Install ngrok (if not installed)

```bash
brew install ngrok
```

### Step 2: Start Your Servers

**Terminal 1 - Backend:**
```bash
cd Pylott-Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Pylott-Web-App
npm run dev
```

### Step 3: Start ngrok Tunnels

**Terminal 3 - Backend ngrok:**
```bash
ngrok http 5001
```

Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

**Terminal 4 - Frontend ngrok:**
```bash
ngrok http 3000
```

Copy the HTTPS URL (e.g., `https://def456.ngrok-free.app`)

### Step 4: Update Frontend .env

```bash
# Edit Pylott-Web-App/.env
VITE_API_BASE_URL="https://abc123.ngrok-free.app/api/v1"
```

Replace `abc123.ngrok-free.app` with your actual backend ngrok URL from Terminal 3.

**Restart frontend:**
```bash
# In Terminal 2, press Ctrl+C
npm run dev
```

---

## Access Your App

**From any device (any network):**
```
https://def456.ngrok-free.app
```

Replace with your actual frontend ngrok URL from Terminal 4.

---

## Alternative: Use Setup Script

I've created a helper script for you:

```bash
cd Pylott-Web-App
./setup-ngrok.sh
```

This script will:
- Check if ngrok is installed
- Show you step-by-step instructions
- Start ngrok for you

---

## Troubleshooting

### Issue: "ngrok not found"

**Solution:**
```bash
brew install ngrok
```

### Issue: Frontend can't connect to backend

**Check:**
1. Backend ngrok is running (Terminal 3)
2. Frontend .env has correct backend ngrok URL
3. Frontend was restarted after changing .env

### Issue: CORS error

**Don't worry!** CORS is already configured to accept all ngrok URLs automatically.

If you still see CORS errors:
1. Make sure backend is running
2. Check backend ngrok URL is correct in .env
3. Restart both backend and frontend

---

## What's Been Configured

### 1. Vite Config (Pylott-Web-App/vite.config.ts)

```typescript
server: {
  port: 3000,
  host: true, // ✅ Allows network access
}
```

### 2. Backend CORS (Pylott-Backend/src/app.ts)

```typescript
cors({
  origin: (origin, callback) => {
    // ✅ Automatically accepts all ngrok URLs
    if (origin.match(/^https:\/\/[a-z0-9-]+\.ngrok(-free)?\.app/)) {
      callback(null, true);
    }
    // ... other origins
  }
})
```

---

## Tips

**Tip 1: ngrok URLs change every restart**
- Free ngrok URLs are random
- You'll need to update .env each time you restart ngrok
- For permanent URLs, upgrade to ngrok paid ($8/month)

**Tip 2: Share with others**
- Send the frontend ngrok URL to anyone
- They can access your local app from anywhere
- Great for demos and testing

**Tip 3: Security**
- Don't share ngrok URLs publicly
- Close ngrok when done (Ctrl+C)
- Use test data, not production database

**Tip 4: Better performance**
- Sign up for free ngrok account: https://dashboard.ngrok.com/signup
- Get auth token and run: `ngrok config add-authtoken YOUR_TOKEN`
- Faster speeds and more connections

---

## Example Complete Setup

**Terminal 1:**
```bash
cd Pylott-Backend
npm run dev
# ✅ Backend running on http://localhost:5001
```

**Terminal 2:**
```bash
cd Pylott-Web-App
npm run dev
# ✅ Frontend running on http://localhost:3000
```

**Terminal 3:**
```bash
ngrok http 5001
# ✅ Forwarding https://abc123.ngrok-free.app -> http://localhost:5001
```

**Terminal 4:**
```bash
ngrok http 3000
# ✅ Forwarding https://def456.ngrok-free.app -> http://localhost:3000
```

**Update .env:**
```env
VITE_API_BASE_URL="https://abc123.ngrok-free.app/api/v1"
```

**Restart frontend (Terminal 2):**
```bash
# Ctrl+C
npm run dev
```

**Access from phone:**
```
https://def456.ngrok-free.app
```

Done! 🎉

---

## Need Help?

Check the full guide: `LOCAL_NETWORK_ACCESS_GUIDE.md`

Or run the setup script:
```bash
./setup-ngrok.sh
```

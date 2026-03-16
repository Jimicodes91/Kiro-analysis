# How to Access Your App via ngrok

## Visual Guide: Finding Your ngrok URL

When you run `ngrok http 3000`, you'll see output like this in your terminal:

```
ngrok                                                                           

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123-def456.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**👆 The URL you need is on the "Forwarding" line:**
```
https://abc123-def456.ngrok-free.app
```

---

## Step-by-Step: How to Access

### Step 1: Start Backend ngrok

**Run this command:**
```bash
ngrok http 5001
```

**Look for this line:**
```
Forwarding    https://xyz789.ngrok-free.app -> http://localhost:5001
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              THIS IS YOUR BACKEND URL
```

**Copy the URL:** `https://xyz789.ngrok-free.app`

---

### Step 2: Start Frontend ngrok

**Run this command (in a new terminal):**
```bash
ngrok http 3000
```

**Look for this line:**
```
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
              THIS IS YOUR FRONTEND URL (use this on your phone!)
```

**Copy the URL:** `https://abc123.ngrok-free.app`

---

### Step 3: Update .env File

**Edit:** `Pylott-Web-App/.env`

**Change this line:**
```env
VITE_API_BASE_URL="http://localhost:5001/api/v1"
```

**To this (using your backend ngrok URL from Step 1):**
```env
VITE_API_BASE_URL="https://xyz789.ngrok-free.app/api/v1"
```

**Save the file.**

---

### Step 4: Restart Frontend

**In the terminal where frontend is running:**
```bash
# Press Ctrl+C to stop
# Then start again:
npm run dev
```

---

### Step 5: Access from Your Phone

**Open browser on your phone and go to:**
```
https://abc123.ngrok-free.app
```

**Replace `abc123.ngrok-free.app` with YOUR actual frontend ngrok URL from Step 2.**

**That's it!** Your phone will now access your local development server.

---

## Visual Example

**Your Terminal 3 (Backend ngrok) will show:**
```
┌───────────────────────────────────────────────────┐
│ Forwarding                                        │
│ https://xyz789.ngrok-free.app → localhost:5001   │
│         ↑                                         │
│    COPY THIS URL                                  │
└───────────────────────────────────────────────────┘
```

**Your Terminal 4 (Frontend ngrok) will show:**
```
┌───────────────────────────────────────────────────┐
│ Forwarding                                        │
│ https://abc123.ngrok-free.app → localhost:3000   │
│         ↑                                         │
│    USE THIS ON YOUR PHONE                         │
└───────────────────────────────────────────────────┘
```

---

## Quick Checklist

Before accessing from your phone:

- [ ] Backend is running (Terminal 1: `npm run dev` in Pylott-Backend)
- [ ] Frontend is running (Terminal 2: `npm run dev` in Pylott-Web-App)
- [ ] Backend ngrok is running (Terminal 3: `ngrok http 5001`)
- [ ] Frontend ngrok is running (Terminal 4: `ngrok http 3000`)
- [ ] You copied the backend ngrok URL from Terminal 3
- [ ] You updated `.env` with backend ngrok URL
- [ ] You restarted frontend (Ctrl+C then `npm run dev`)
- [ ] You copied the frontend ngrok URL from Terminal 4
- [ ] You opened the frontend ngrok URL on your phone

---

## What You'll See on Your Phone

**First time accessing ngrok URL:**
- You might see an ngrok warning page
- Click "Visit Site" button
- Then you'll see your Pylott app

**After that:**
- Your app loads normally
- You can login, create tasks, etc.
- Everything works just like on your computer

---

## Example with Real URLs

**Terminal 3 output:**
```
Forwarding: https://7a2b-123-456.ngrok-free.app -> http://localhost:5001
```

**Terminal 4 output:**
```
Forwarding: https://9c4d-789-012.ngrok-free.app -> http://localhost:3000
```

**Update .env:**
```env
VITE_API_BASE_URL="https://7a2b-123-456.ngrok-free.app/api/v1"
```

**Access on phone:**
```
https://9c4d-789-012.ngrok-free.app
```

---

## Troubleshooting: Can't Find the URL

### If you closed the ngrok terminal

**Solution:** The URL is gone. Start ngrok again:
```bash
ngrok http 3000
```

You'll get a NEW URL (ngrok free tier generates random URLs each time).

### If terminal is too small

**Solution:** Make terminal window bigger or scroll up to see the "Forwarding" line.

### If you see multiple URLs

**ngrok might show both HTTP and HTTPS:**
```
Forwarding    http://abc123.ngrok-free.app -> http://localhost:3000
Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000
```

**Always use the HTTPS URL** (the one starting with `https://`)

---

## Alternative: ngrok Web Interface

**ngrok also provides a web interface:**

1. When ngrok is running, open browser on your computer
2. Go to: `http://localhost:4040`
3. You'll see a dashboard with:
   - Your ngrok URLs
   - Request history
   - Traffic stats

**This is helpful for:**
- Seeing all your active tunnels
- Debugging API calls
- Monitoring traffic

---

## Summary

**To access your app from phone on different network:**

1. Run `ngrok http 3000` in terminal
2. Look for line that says "Forwarding"
3. Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)
4. Open that URL on your phone
5. Done!

**The URL is displayed in the terminal where you ran ngrok.**


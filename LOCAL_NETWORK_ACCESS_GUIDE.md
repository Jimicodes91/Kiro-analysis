# Access Local Development Server from Phone/Other Devices

## Quick Answer

Yes! You can access your local frontend (localhost:3000) from your phone or another device on the same network.

**Steps:**
1. Find your computer's local IP address
2. Update Vite configuration to allow network access
3. Update backend CORS to allow your IP
4. Access from phone using: `http://YOUR_IP:3000`

---

## Step-by-Step Guide

### Step 1: Find Your Computer's IP Address

**On macOS (your system):**
```bash
# Option 1: Using ifconfig
ifconfig | grep "inet " | grep -v 127.0.0.1

# Option 2: Using system preferences
# System Preferences → Network → Your connection → IP address

# Option 3: Quick command
ipconfig getifaddr en0  # For WiFi
# OR
ipconfig getifaddr en1  # For Ethernet
```

**Example output:**
```
192.168.1.100  # This is your local IP
```

---

### Step 2: Update Vite Configuration

**File:** `Pylott-Web-App/vite.config.ts`

**Current configuration:**
```typescript
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3000 
  },
  resolve: { 
    alias: { "@": path.resolve(__dirname, "./src") } 
  },
});
```

**Updated configuration (add host):**
```typescript
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3000,
    host: true,  // ✅ Add this line - allows network access
    // OR use: host: '0.0.0.0'  // Same effect
  },
  resolve: { 
    alias: { "@": path.resolve(__dirname, "./src") } 
  },
});
```

---

### Step 3: Update Backend CORS Configuration

**File:** `Pylott-Backend/src/app.ts`

**Current CORS:**
```typescript
cors({
  origin: [
    'https://www.pylott.io',
    'https://pylott.io',
    'https://staging.pylott.io',
    'http://localhost:3000',  // Only localhost
    'https://pylot-tkrh.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Api-key', 'Api-Reference-Id', 'x-api-key'],
})
```

**Updated CORS (add your IP):**
```typescript
cors({
  origin: [
    'https://www.pylott.io',
    'https://pylott.io',
    'https://staging.pylott.io',
    'http://localhost:3000',
    'http://192.168.1.100:3000',  // ✅ Add your IP here
    'https://pylot-tkrh.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Api-key', 'Api-Reference-Id', 'x-api-key'],
})
```

**OR allow all local network (less secure but easier for development):**
```typescript
cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://www.pylott.io',
      'https://pylott.io',
      'https://staging.pylott.io',
      'https://pylot-tkrh.vercel.app'
    ];
    
    // Allow localhost and local network IPs
    if (!origin || 
        origin.startsWith('http://localhost') || 
        origin.startsWith('http://127.0.0.1') ||
        origin.match(/^http:\/\/192\.168\.\d{1,3}\.\d{1,3}/) ||
        origin.match(/^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}/) ||
        allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Api-key', 'Api-Reference-Id', 'x-api-key'],
})
```

---

### Step 4: Restart Development Servers

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

**You should see:**
```
  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.1.100:3000/  # ✅ This is the network URL
```

---

### Step 5: Access from Phone

**On your phone (must be on same WiFi network):**

1. Open browser (Safari, Chrome, etc.)
2. Go to: `http://192.168.1.100:3000`
3. Replace `192.168.1.100` with your actual IP address

**Example URLs:**
- Frontend: `http://192.168.1.100:3000`
- Backend: `http://192.168.1.100:5001` (if needed)

---

## Troubleshooting

### Issue 1: Can't Connect from Phone

**Check 1: Same Network**
```bash
# Make sure phone and computer are on same WiFi network
# Phone WiFi settings → Check network name
# Computer WiFi settings → Check network name
```

**Check 2: Firewall**
```bash
# macOS: System Preferences → Security & Privacy → Firewall
# Make sure firewall allows Node.js connections
# OR temporarily disable firewall for testing
```

**Check 3: Port Forwarding**
```bash
# Some routers block local network access
# Try accessing from another computer first
```

---

### Issue 2: CORS Error

**Symptom:** Phone shows blank page, console shows CORS error

**Solution:** Make sure you updated backend CORS configuration (Step 3)

**Verify backend is allowing your IP:**
```bash
# Check backend logs when accessing from phone
# Should see: "CORS allowed for origin: http://192.168.1.100:3000"
```

---

### Issue 3: Backend Connection Failed

**Symptom:** Frontend loads but API calls fail

**Check 1: Backend is running**
```bash
# Make sure backend is running on port 5001
curl http://localhost:5001/health
```

**Check 2: Frontend API URL**
```bash
# Check .env file
cat Pylott-Web-App/.env

# Should have:
VITE_API_BASE_URL="http://localhost:5001/api/v1"
```

**For phone access, you might need:**
```env
# Option 1: Use localhost (works if backend allows CORS)
VITE_API_BASE_URL="http://localhost:5001/api/v1"

# Option 2: Use your IP (more reliable for phone)
VITE_API_BASE_URL="http://192.168.1.100:5001/api/v1"
```

---

### Issue 4: Vite Not Showing Network URL

**Symptom:** Vite only shows `Local: http://localhost:3000`

**Solution:** Make sure you added `host: true` to vite.config.ts

**Verify:**
```typescript
// vite.config.ts
server: { 
  port: 3000,
  host: true,  // ✅ This must be present
}
```

---

## Alternative: Use ngrok (Internet Access)

If you want to access from anywhere (not just local network), use ngrok:

**Step 1: Install ngrok**
```bash
# macOS
brew install ngrok

# OR download from https://ngrok.com/download
```

**Step 2: Start ngrok tunnel**
```bash
# For frontend
ngrok http 3000

# You'll get a URL like: https://abc123.ngrok.io
```

**Step 3: Access from anywhere**
```
# Use the ngrok URL on any device
https://abc123.ngrok.io
```

**Note:** Free ngrok URLs change every time you restart. Paid plans get permanent URLs.

---

## Quick Reference

### Find Your IP Address
```bash
# macOS
ipconfig getifaddr en0

# Expected output: 192.168.1.100
```

### Update Vite Config
```typescript
// vite.config.ts
server: { 
  port: 3000,
  host: true,  // Add this
}
```

### Update Backend CORS
```typescript
// app.ts
origin: [
  'http://localhost:3000',
  'http://192.168.1.100:3000',  // Add your IP
]
```

### Access from Phone
```
http://YOUR_IP:3000
Example: http://192.168.1.100:3000
```

---

## Security Notes

**Development Only:**
- This setup is for development only
- Don't use in production
- Your app is accessible to anyone on your network

**Production:**
- Use proper domain names
- Use HTTPS
- Use proper CORS configuration
- Use environment-specific settings

---

## Testing Checklist

- [ ] Found your computer's IP address
- [ ] Updated vite.config.ts with `host: true`
- [ ] Updated backend CORS with your IP
- [ ] Restarted both servers
- [ ] Vite shows Network URL
- [ ] Phone is on same WiFi network
- [ ] Can access frontend from phone
- [ ] Can login and use app from phone
- [ ] API calls work from phone

---

## Common IP Address Ranges

**Private Network Ranges:**
- `192.168.x.x` - Most common home networks
- `10.x.x.x` - Some home/office networks
- `172.16.x.x` to `172.31.x.x` - Some office networks

**Not Valid for Local Network:**
- `127.0.0.1` - Localhost only (won't work from phone)
- Public IPs - Won't work for local network access

---

## Example Complete Setup

**1. Find IP:**
```bash
$ ipconfig getifaddr en0
192.168.1.100
```

**2. Update vite.config.ts:**
```typescript
export default defineConfig({
  plugins: [react()],
  server: { 
    port: 3000,
    host: true,
  },
  resolve: { 
    alias: { "@": path.resolve(__dirname, "./src") } 
  },
});
```

**3. Update app.ts:**
```typescript
cors({
  origin: [
    'https://www.pylott.io',
    'https://pylott.io',
    'https://staging.pylott.io',
    'http://localhost:3000',
    'http://192.168.1.100:3000',
    'https://pylot-tkrh.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Api-key', 'Api-Reference-Id', 'x-api-key'],
})
```

**4. Start servers:**
```bash
# Terminal 1
cd Pylott-Backend && npm run dev

# Terminal 2
cd Pylott-Web-App && npm run dev
```

**5. Access from phone:**
```
http://192.168.1.100:3000
```

Done! ✅



---

## Access from Different Network (Internet Access)

If your phone is on a **different network** (cellular data, different WiFi, etc.), you need to expose your local server to the internet using a tunneling service.

### Option 1: ngrok (Recommended - Easy & Free)

**What is ngrok?**
- Creates a secure tunnel from internet to your localhost
- Gives you a public URL that anyone can access
- Free tier available (with limitations)

#### Step 1: Install ngrok

**macOS (your system):**
```bash
# Using Homebrew
brew install ngrok

# OR download from https://ngrok.com/download
```

#### Step 2: Sign up for ngrok (Optional but recommended)

```bash
# Go to https://dashboard.ngrok.com/signup
# Get your auth token
# Run this once:
ngrok config add-authtoken YOUR_AUTH_TOKEN
```

#### Step 3: Start ngrok tunnel for frontend

```bash
# In a new terminal window
ngrok http 3000

# You'll see output like:
# Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### Step 4: Start ngrok tunnel for backend

```bash
# In another terminal window
ngrok http 5001

# You'll see output like:
# Forwarding  https://def456.ngrok.io -> http://localhost:5001
```

#### Step 5: Update frontend .env

```env
# Pylott-Web-App/.env
VITE_API_BASE_URL="https://def456.ngrok.io/api/v1"
```

#### Step 6: Update backend CORS

```typescript
// Pylott-Backend/src/app.ts
cors({
  origin: [
    'https://www.pylott.io',
    'https://pylott.io',
    'https://staging.pylott.io',
    'http://localhost:3000',
    'https://abc123.ngrok.io',  // ✅ Add your ngrok frontend URL
    'https://pylot-tkrh.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Api-key', 'Api-Reference-Id', 'x-api-key'],
})
```

#### Step 7: Restart frontend

```bash
# Stop frontend (Ctrl+C)
# Start again
cd Pylott-Web-App
npm run dev
```

#### Step 8: Access from anywhere

**On your phone (any network):**
```
https://abc123.ngrok.io
```

**Share with others:**
- Send the ngrok URL to anyone
- They can access your local app from anywhere
- Works on any device, any network

---

### ngrok Free vs Paid

**Free Tier:**
- ✅ Random URL (changes every restart)
- ✅ HTTPS included
- ✅ 40 connections/minute
- ✅ 1 online ngrok process
- ❌ URL expires when you close ngrok
- ❌ Can't customize URL

**Paid Tier ($8/month):**
- ✅ Custom subdomain (e.g., `myapp.ngrok.io`)
- ✅ Reserved domain (doesn't change)
- ✅ Multiple tunnels
- ✅ More connections
- ✅ IP whitelisting

---

### Option 2: localtunnel (Free Alternative)

**What is localtunnel?**
- Similar to ngrok
- Completely free
- No signup required
- Less stable than ngrok

#### Install localtunnel

```bash
npm install -g localtunnel
```

#### Start tunnel for frontend

```bash
lt --port 3000

# You'll get a URL like:
# https://random-name-123.loca.lt
```

#### Start tunnel for backend

```bash
lt --port 5001

# You'll get a URL like:
# https://another-name-456.loca.lt
```

#### Update .env and CORS (same as ngrok)

---

### Option 3: Cloudflare Tunnel (Free & Permanent)

**What is Cloudflare Tunnel?**
- Free forever
- Can get permanent URL
- More complex setup
- Very reliable

#### Install cloudflared

```bash
# macOS
brew install cloudflare/cloudflare/cloudflared
```

#### Login to Cloudflare

```bash
cloudflared tunnel login
```

#### Create tunnel

```bash
cloudflared tunnel create pylott-dev
```

#### Configure tunnel

Create `~/.cloudflared/config.yml`:
```yaml
tunnel: YOUR_TUNNEL_ID
credentials-file: /Users/YOUR_USERNAME/.cloudflared/YOUR_TUNNEL_ID.json

ingress:
  - hostname: pylott-dev.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

#### Run tunnel

```bash
cloudflared tunnel run pylott-dev
```

---

### Option 4: Tailscale (VPN - Most Secure)

**What is Tailscale?**
- Creates private VPN between your devices
- Most secure option
- Free for personal use
- No public URL (only you can access)

#### Install Tailscale

```bash
# macOS
brew install tailscale

# Start Tailscale
sudo tailscale up
```

#### Install on phone

- Download Tailscale app from App Store
- Login with same account
- Connect to VPN

#### Access your app

```
# Use your computer's Tailscale IP
http://100.x.x.x:3000
```

**Pros:**
- ✅ Most secure (private VPN)
- ✅ No public exposure
- ✅ Fast and reliable
- ✅ Works across any network

**Cons:**
- ❌ Only you can access (not shareable)
- ❌ Requires app on all devices

---

## Comparison: Different Network Access Methods

| Method | Cost | Setup | Security | Shareable | Permanent URL |
|--------|------|-------|----------|-----------|---------------|
| **ngrok (free)** | Free | Easy | Medium | ✅ Yes | ❌ No |
| **ngrok (paid)** | $8/mo | Easy | Medium | ✅ Yes | ✅ Yes |
| **localtunnel** | Free | Easy | Low | ✅ Yes | ❌ No |
| **Cloudflare** | Free | Hard | High | ✅ Yes | ✅ Yes |
| **Tailscale** | Free | Medium | Very High | ❌ No | ✅ Yes |

---

## Recommended Setup for Different Scenarios

### Scenario 1: Quick Testing on Your Phone (Different Network)

**Use:** ngrok (free)

**Why:**
- Fastest setup (2 minutes)
- No signup required
- Works immediately

**Steps:**
```bash
# Install
brew install ngrok

# Start tunnel
ngrok http 3000

# Access from phone
https://abc123.ngrok.io
```

---

### Scenario 2: Share with Team/Client for Feedback

**Use:** ngrok (paid) or Cloudflare Tunnel

**Why:**
- Permanent URL (can share once)
- More reliable
- Professional appearance

**Steps:**
```bash
# ngrok with custom domain
ngrok http 3000 --subdomain=pylott-demo

# Share URL
https://pylott-demo.ngrok.io
```

---

### Scenario 3: Long-term Development Access

**Use:** Cloudflare Tunnel

**Why:**
- Free forever
- Permanent URL
- Very reliable
- Can use custom domain

---

### Scenario 4: Private Access Only (Security Priority)

**Use:** Tailscale

**Why:**
- Most secure
- No public exposure
- Fast and reliable
- Free for personal use

---

## Complete ngrok Setup Example

**Terminal 1: Backend**
```bash
cd Pylott-Backend
npm run dev
# Running on http://localhost:5001
```

**Terminal 2: Frontend**
```bash
cd Pylott-Web-App
npm run dev
# Running on http://localhost:3000
```

**Terminal 3: ngrok for Backend**
```bash
ngrok http 5001
# Forwarding: https://def456.ngrok.io -> http://localhost:5001
```

**Terminal 4: ngrok for Frontend**
```bash
ngrok http 3000
# Forwarding: https://abc123.ngrok.io -> http://localhost:3000
```

**Update .env:**
```env
# Pylott-Web-App/.env
VITE_API_BASE_URL="https://def456.ngrok.io/api/v1"
```

**Update CORS:**
```typescript
// Pylott-Backend/src/app.ts
origin: [
  'http://localhost:3000',
  'https://abc123.ngrok.io',  // Frontend ngrok URL
  // ... other origins
]
```

**Restart frontend:**
```bash
# Ctrl+C in Terminal 2
npm run dev
```

**Access from phone (any network):**
```
https://abc123.ngrok.io
```

Done! ✅

---

## Security Considerations

### ngrok/localtunnel (Public URLs)

**Risks:**
- ⚠️ Anyone with URL can access your app
- ⚠️ Your local database is exposed
- ⚠️ Development secrets might be exposed

**Mitigations:**
1. **Use authentication** - Require login
2. **Use test data** - Don't use production database
3. **Don't share URL publicly** - Only send to trusted people
4. **Use ngrok password protection:**
   ```bash
   ngrok http 3000 --basic-auth="username:password"
   ```
5. **Close tunnel when done** - Don't leave running overnight

### Tailscale (Private VPN)

**Risks:**
- ✅ Very secure (private VPN)
- ✅ Only you can access
- ✅ No public exposure

**Best for:**
- Personal development
- Testing on your own devices
- Security-sensitive projects

---

## Troubleshooting Different Network Access

### Issue 1: ngrok URL Not Working

**Check 1: ngrok is running**
```bash
# Make sure you see "Forwarding" in ngrok terminal
# Should show: https://abc123.ngrok.io -> http://localhost:3000
```

**Check 2: Local server is running**
```bash
# Make sure frontend is running on port 3000
curl http://localhost:3000
```

**Check 3: CORS is configured**
```typescript
// Backend must allow ngrok URL
origin: ['https://abc123.ngrok.io']
```

---

### Issue 2: Backend API Calls Failing

**Symptom:** Frontend loads but API calls fail

**Check 1: Backend ngrok is running**
```bash
# Terminal should show:
# Forwarding: https://def456.ngrok.io -> http://localhost:5001
```

**Check 2: Frontend .env is updated**
```env
# Must use ngrok backend URL
VITE_API_BASE_URL="https://def456.ngrok.io/api/v1"
```

**Check 3: Frontend was restarted**
```bash
# After changing .env, restart frontend
# Ctrl+C then npm run dev
```

---

### Issue 3: ngrok URL Changes Every Time

**Problem:** Free ngrok URLs are random and change on restart

**Solutions:**

**Option 1: Paid ngrok ($8/month)**
```bash
# Get custom subdomain
ngrok http 3000 --subdomain=pylott-dev
# Always: https://pylott-dev.ngrok.io
```

**Option 2: Use Cloudflare Tunnel (free)**
- Permanent URL
- Free forever
- More setup required

**Option 3: Script to auto-update**
```bash
# Create update-ngrok.sh
#!/bin/bash
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[^"]*ngrok.io')
echo "VITE_API_BASE_URL=\"$NGROK_URL/api/v1\"" > .env
npm run dev
```

---

## Quick Command Reference

### Same Network (Local IP)
```bash
# Find IP
ipconfig getifaddr en0

# Access from phone
http://192.168.1.100:3000
```

### Different Network (ngrok)
```bash
# Install
brew install ngrok

# Start tunnel
ngrok http 3000

# Access from phone
https://abc123.ngrok.io
```

### Different Network (localtunnel)
```bash
# Install
npm install -g localtunnel

# Start tunnel
lt --port 3000

# Access from phone
https://random-name.loca.lt
```

### Private VPN (Tailscale)
```bash
# Install
brew install tailscale

# Start
sudo tailscale up

# Access from phone (with Tailscale app)
http://100.x.x.x:3000
```

---

## Summary

**Same WiFi Network:**
- Use local IP address (192.168.x.x)
- Fast and free
- No internet required
- Most secure

**Different Network:**
- Use ngrok (easiest)
- Use Cloudflare Tunnel (free permanent URL)
- Use Tailscale (most secure, private only)

**Recommendation:**
- **Quick testing:** ngrok free
- **Team sharing:** ngrok paid or Cloudflare
- **Personal use:** Tailscale
- **Production:** Deploy to Vercel/staging


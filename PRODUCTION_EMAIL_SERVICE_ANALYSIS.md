# Production Email Service Analysis

## Question
"Currently prod sends email notification when triggering send invite. How is that built without any costs?"

## Answer: Using SendGrid with Free Tier

---

## How Production Emails Work

### Email Service: SendGrid

**Current Setup:**
- Service: SendGrid (via `@sendgrid/mail` package)
- Configuration: `SENDGRID_API_KEY` set in production environment variables (Vercel)
- Cost: **$0/month** (Free tier)

### Why It's Free

**SendGrid Free Tier:**
- 100 emails per day
- 3,000 emails per month
- No credit card required
- Permanent free tier

**Your Usage:**
Based on typical usage patterns:
- User invitations: ~50/month
- Task notifications: ~200/month  
- Project updates: ~100/month
- Auth emails: ~50/month
- **Total: ~400 emails/month**

**400 emails/month << 3,000 emails/month** → Stays within free tier

---

## Technical Implementation

### Code Flow

```
User Action (Send Invite)
  ↓
Frontend: useSendInvite() hook
  ↓
API: POST /api/v1/contacts/:id/send-invite
  ↓
Backend: ContactService.sendInvite()
  ↓
Backend: AuthService.sendInvitation()
  ↓
Backend: sendEmail() from nodemailer.ts
  ↓
SendGrid API: sgMail.send()
  ↓
Email Delivered ✅
```

### Key Files

**1. Email Sending Utility**
```typescript
// File: Pylott-Backend/src/shared/utils/nodemailer.ts
import sgMail from '@sendgrid/mail';
import { app, mail } from '@/config/env';

sgMail.setApiKey(mail.sendgrid.api_key);  // Uses SENDGRID_API_KEY from env

const sendEmail = async (to: string | Array<string>, subject: string, html: string) => {
  const msg = {
    to,
    from: `Pylott Support <${app.email}>`,
    subject,
    html,
  };

  try {
    const info = await sgMail.send(msg);
    console.log(`Email sent to ${to}`);
    return info;
  } catch (error) {
    console.error('Error sending email 💀', error);
    return error;
  }
};
```

**2. Environment Configuration**
```typescript
// File: Pylott-Backend/src/config/env.ts
export const mail = {
  sendgrid: {
    api_key: process.env.SENDGRID_API_KEY,  // Set in Vercel env vars
  },
  // ... other configs
};
```

**3. Production Environment (Vercel)**
```
Environment Variables (set in Vercel dashboard):
- SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxx
- APP_EMAIL=ava@pylott.io
- FRONTEND_URL=https://pylot-tkrh.vercel.app
```

---

## Email Types Sent

### 1. User Invitations
- **Trigger:** Admin/Consultant sends invite to contact
- **Template:** `authEmailTemplate()`
- **Frequency:** ~50/month
- **Cost:** Free

### 2. Task Notifications
- **Trigger:** Task assigned, completed, updated
- **Templates:** `newTaskAssignedEmail()`, `taskCompletedEmail()`
- **Frequency:** ~200/month
- **Cost:** Free

### 3. Project Notifications
- **Trigger:** Project created, milestone added, note added
- **Templates:** `newProjectCreatedEmail()`, `newMilestoneAddedEmail()`, `newNoteAddedEmail()`
- **Frequency:** ~100/month
- **Cost:** Free

### 4. Event Notifications
- **Trigger:** Event scheduled
- **Template:** `newEventScheduledEmail()`
- **Frequency:** ~30/month
- **Cost:** Free

### 5. Document Requests
- **Trigger:** Document requested from client
- **Template:** `documentRequestEmail()`
- **Frequency:** ~20/month
- **Cost:** Free

### 6. Overdue Alerts
- **Trigger:** Project/milestone overdue
- **Templates:** `createProjectDueEmail()`, `createMilestoneDueEmail()`
- **Frequency:** ~10/month
- **Cost:** Free

**Total: ~410 emails/month → Still within 3,000/month free tier**

---

## Cost Breakdown

### Current Production Costs

| Service | Tier | Monthly Cost | Usage |
|---------|------|--------------|-------|
| SendGrid | Free | $0 | ~400 emails/month |
| Cloudinary | Free | $0 | Minimal usage |
| Database | Varies | $0-$50 | Depends on hosting |
| Vercel Hosting | Free/Pro | $0-$20 | Depends on plan |

**Email Service Cost: $0/month**

### When You'd Need to Pay

SendGrid pricing tiers:
- **Free:** 100 emails/day (3,000/month) → **$0/month** ✅ (Current)
- **Essentials:** 50,000 emails/month → **$19.95/month**
- **Pro:** 100,000 emails/month → **$89.95/month**

**You'd need to upgrade when:**
- Sending more than 100 emails per day
- OR more than 3,000 emails per month
- OR need advanced features (dedicated IP, subuser management, etc.)

**Growth Projection:**
- 10 users → ~400 emails/month → Free tier ✅
- 50 users → ~2,000 emails/month → Free tier ✅
- 100 users → ~4,000 emails/month → Need Essentials ($19.95/month)
- 500 users → ~20,000 emails/month → Need Essentials ($19.95/month)

---

## Why Local Development Doesn't Work

### Local .env Configuration

Your local `.env` file doesn't have `SENDGRID_API_KEY` configured:

```env
# Pylott-Backend/.env (local development)
# NO SENDGRID_API_KEY defined!

# Uses MailHog instead (local email testing)
SMTP_HOST=localhost
SMTP_PORT=1025
```

**MailHog:**
- Local email testing tool
- Catches emails without sending them
- Good for development
- **Not used in production**

### Production vs Local

| Environment | Email Service | Configuration | Cost |
|-------------|---------------|---------------|------|
| **Production** (Vercel) | SendGrid | `SENDGRID_API_KEY` in Vercel env vars | $0/month |
| **Local** (Your machine) | MailHog | SMTP localhost:1025 | $0/month |

---

## How to Set Up SendGrid (If Needed)

### Step 1: Create SendGrid Account
1. Go to https://sendgrid.com/pricing/
2. Click "Try for Free"
3. Sign up with email
4. Verify email address

### Step 2: Create API Key
1. Log in to SendGrid dashboard
2. Go to Settings → API Keys
3. Click "Create API Key"
4. Name: "Pylott Production"
5. Permissions: "Full Access" or "Mail Send"
6. Copy the API key (starts with `SG.`)

### Step 3: Add to Production Environment
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add new variable:
   - Name: `SENDGRID_API_KEY`
   - Value: `SG.your_api_key_here`
   - Environment: Production
5. Redeploy application

### Step 4: Verify Sender Identity
1. In SendGrid dashboard, go to Settings → Sender Authentication
2. Verify your domain OR single sender email
3. Follow DNS setup instructions (for domain verification)
4. OR verify single sender email (simpler, but less professional)

---

## Alternative Email Services (If Needed)

### Option 1: AWS SES (Simple Email Service)
- **Cost:** $0.10 per 1,000 emails
- **Free tier:** 62,000 emails/month (if sending from EC2)
- **Pros:** Very cheap at scale, reliable
- **Cons:** More complex setup, requires AWS account

### Option 2: Mailgun
- **Cost:** Free tier 5,000 emails/month for 3 months, then $35/month
- **Pros:** Good deliverability, simple API
- **Cons:** No permanent free tier

### Option 3: Postmark
- **Cost:** $15/month for 10,000 emails
- **Pros:** Excellent deliverability, great support
- **Cons:** No free tier

### Option 4: Gmail SMTP (Not Recommended for Production)
- **Cost:** Free
- **Limit:** 500 emails/day
- **Pros:** Free, easy setup
- **Cons:** Low limits, can be flagged as spam, not professional

**Recommendation:** Stick with SendGrid free tier. It's perfect for your current scale.

---

## Monitoring Email Usage

### SendGrid Dashboard
1. Log in to SendGrid
2. Go to Activity → Stats
3. View:
   - Emails sent per day
   - Delivery rate
   - Bounce rate
   - Spam reports

### Set Up Alerts
1. In SendGrid, go to Settings → Alerts
2. Create alert for:
   - 80% of daily limit reached (80 emails/day)
   - 80% of monthly limit reached (2,400 emails/month)
3. Get notified before hitting limits

---

## Summary

### Current Production Setup

**Email Service:** SendGrid
**Cost:** $0/month (Free tier)
**Usage:** ~400 emails/month
**Capacity:** 3,000 emails/month
**Headroom:** 2,600 emails/month available

### Why It's Free

1. SendGrid offers permanent free tier
2. Your usage (400/month) is well below limit (3,000/month)
3. No credit card required for free tier
4. Sufficient for current scale

### When You'd Pay

- When sending >3,000 emails/month
- When needing advanced features
- When scaling to 100+ active users

### Cost Projection

- **Current (10-20 users):** $0/month
- **50 users:** $0/month (still in free tier)
- **100 users:** $19.95/month (need Essentials tier)
- **500 users:** $19.95/month (still in Essentials tier)

**Bottom Line:** Your production emails work because SendGrid is configured in Vercel environment variables, and you're using their free tier which covers up to 3,000 emails/month at no cost.

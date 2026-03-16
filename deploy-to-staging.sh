#!/bin/bash
# ============================================================
# PYLOTT FRONTEND - STAGING DEPLOYMENT SCRIPT
# ============================================================
# Run from: Pylott-Web-App directory
# Target branch: v1 (staging) — or dev → v1 merge
# Current branch: dev
#
# PREREQUISITES:
#   1. Backend already deployed to staging
#   2. All local changes committed to dev
#   3. Staging env vars set on hosting platform
# ============================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo ""
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  PYLOTT FRONTEND - STAGING DEPLOYMENT${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# ---- STEP 0: Pre-flight checks ----
echo -e "${YELLOW}[STEP 0] Pre-flight checks...${NC}"

CURRENT_BRANCH=$(git branch --show-current)
echo "  Current branch: $CURRENT_BRANCH"

# Check .env file
echo ""
echo -e "${YELLOW}  Checking .env file...${NC}"
if grep -q "localhost" .env 2>/dev/null; then
    echo -e "${RED}  WARNING: .env points to localhost!${NC}"
    echo "  Current value:"
    grep "VITE_API_BASE_URL" .env
    echo ""
    echo -e "${YELLOW}  For staging, this should be:${NC}"
    echo "  VITE_API_BASE_URL=\"https://staging-api.pylott.io/api/v1\""
    echo ""
    echo -e "${YELLOW}  NOTE: Don't change your local .env.${NC}"
    echo -e "${YELLOW}  Set VITE_API_BASE_URL in your hosting platform's env vars instead.${NC}"
    echo -e "${YELLOW}  (Vercel: Settings → Environment Variables → Preview/v1 branch)${NC}"
    echo ""
    read -p "  Is the staging API URL configured in your hosting platform? (y/n): " ENV_CHOICE
    if [ "$ENV_CHOICE" != "y" ]; then
        echo -e "${RED}  Please set it first, then re-run.${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}  .env looks good.${NC}"
fi

echo ""

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}  WARNING: You have uncommitted changes!${NC}"
    echo ""
    git status --short
    echo ""
    read -p "  Do you want to commit them first? (y/n): " COMMIT_CHOICE
    if [ "$COMMIT_CHOICE" = "y" ]; then
        read -p "  Commit message: " COMMIT_MSG
        git add -A
        git commit -m "$COMMIT_MSG"
        echo -e "${GREEN}  Changes committed.${NC}"
    else
        echo -e "${YELLOW}  Proceeding without committing (uncommitted changes will NOT be deployed).${NC}"
        read -p "  Continue? (y/n): " CONTINUE
        if [ "$CONTINUE" != "y" ]; then
            echo "  Aborted."
            exit 1
        fi
    fi
fi
echo ""

# ---- STEP 1: Fetch latest ----
echo -e "${YELLOW}[STEP 1] Fetching latest from origin...${NC}"
git fetch origin
echo -e "${GREEN}  Done.${NC}"
echo ""

# ---- STEP 2: Check if v1 branch exists locally ----
echo -e "${YELLOW}[STEP 2] Preparing v1 branch...${NC}"
if git show-ref --verify --quiet refs/heads/v1 2>/dev/null; then
    echo "  v1 branch exists locally."
    git checkout v1
    git pull origin v1 || echo "  (v1 may not exist on origin yet, continuing...)"
else
    # Check if v1 exists on origin
    if git show-ref --verify --quiet refs/remotes/origin/v1 2>/dev/null; then
        echo "  Checking out v1 from origin..."
        git checkout -b v1 origin/v1
    else
        echo "  Creating v1 branch from $CURRENT_BRANCH..."
        git checkout -b v1
    fi
fi
echo ""

# ---- STEP 3: Merge dev into v1 ----
echo -e "${YELLOW}[STEP 3] Merging $CURRENT_BRANCH into v1...${NC}"
git merge "$CURRENT_BRANCH" --no-edit
echo -e "${GREEN}  Merge complete.${NC}"
echo ""

# ---- STEP 4: Verify build ----
echo -e "${YELLOW}[STEP 4] Running build check...${NC}"
read -p "  Run 'npm run build' to verify? (y/n): " BUILD_CHOICE
if [ "$BUILD_CHOICE" = "y" ]; then
    echo "  Installing dependencies..."
    npm install
    echo "  Building..."
    npm run build
    echo -e "${GREEN}  Build successful!${NC}"
else
    echo -e "${YELLOW}  Skipping build check.${NC}"
fi
echo ""

# ---- STEP 5: Push to v1 ----
echo -e "${YELLOW}[STEP 5] Pushing v1 to origin (triggers staging deploy)...${NC}"
read -p "  Ready to push? (y/n): " PUSH_CHOICE
if [ "$PUSH_CHOICE" != "y" ]; then
    echo "  Aborted. You're still on v1 branch."
    echo "  To push manually later: git push origin v1"
    exit 0
fi

git push origin v1
echo -e "${GREEN}  Pushed to origin/v1 successfully!${NC}"
echo ""

# ---- STEP 6: Switch back ----
echo -e "${YELLOW}[STEP 6] Switching back to $CURRENT_BRANCH...${NC}"
git checkout "$CURRENT_BRANCH"
echo -e "${GREEN}  Back on $CURRENT_BRANCH.${NC}"
echo ""

# ---- STEP 7: Post-deploy checklist ----
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  FRONTEND DEPLOYMENT COMPLETE${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${YELLOW}  HOSTING PLATFORM ENV VARS (verify these are set for v1/staging):${NC}"
echo ""
echo "  VITE_API_BASE_URL=https://staging-api.pylott.io/api/v1"
echo ""
echo -e "${YELLOW}  POST-DEPLOY SMOKE TEST:${NC}"
echo ""
echo "  [ ] https://staging.pylott.io loads"
echo "  [ ] Login works (email + password)"
echo "  [ ] Dashboard loads (no 500 error)"
echo "  [ ] Sidebar order: Home → Projects → Admin → Tasks → Contact → Billing"
echo "  [ ] Create internal task from Admin → Task tab"
echo "  [ ] Cancel/back buttons navigate correctly"
echo "  [ ] Create external task from project detail"
echo "  [ ] Milestones render with SVG arrows"
echo "  [ ] Notifications page loads (/notifications)"
echo "  [ ] Responsive layout on smaller screens"
echo "  [ ] Switch organization works"
echo "  [ ] Client role can view task details"
echo ""
echo -e "${GREEN}  All done! Test staging.pylott.io now.${NC}"

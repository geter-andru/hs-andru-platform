# AUTO-CONTEXT LOADER - Claude Code Session Startup

## 🤖 **AUTOMATIC CONTEXT DETECTION & SESSIONSTART HOOK**

**This file works in conjunction with Claude Code SessionStart hooks for automatic context loading.**

### **🚀 SESSIONSTART HOOK INTEGRATION**
**For automatic execution on every session start:**
1. Run `/hooks` in Claude Code
2. Configure SessionStart hook with: `/Users/geter/hs-andru-platform/auto-context-loader.sh`
3. Hook will automatically execute on session startup, resume, and clear

### **📋 MANUAL TRIGGER (Fallback)**
**If SessionStart hook is not configured, execute manually:**

1. **Read Documentation Files:**
   - `Read CLAUDE.md` - Project context and recent work
   - `Read PROJECT_STATUS.md` - Complete system documentation  
   - `Read STARTUP_VERIFICATION.md` - Environment and testing guide

2. **Generate Status Report:**
   ```
   # H&S Revenue Intelligence Platform - Auto-Generated Status Report
   
   [Read all documentation and provide comprehensive status]
   ```

3. **Verify Environment:**
   - Check Git status
   - Verify latest commits
   - Confirm build status if possible

## 🎯 **PROJECT IDENTIFIERS**
- **Name**: H&S Revenue Intelligence Platform
- **Repository**: https://github.com/geter-andru/hs-andru-v1.git
- **Current Phase**: Phase 4 Complete (Professional Competency System)
- **Status**: Production-Ready MVP

## 🔧 **CRITICAL INFORMATION**
- **Admin URL**: `http://localhost:3000/customer/CUST_4?token=admin-demo-token-2025`
- **Test URL**: `http://localhost:3000/test`
- **Airtable Base**: `app0jJkgTCqn46vp9`
- **Main Services**: `enhancedAirtableService.js`, `authService.js`, `assessmentService.js`

## 🚨 **AUTOMATIC ACTIONS**
When Claude detects this file, it should immediately:
1. Load all project documentation
2. Generate comprehensive status report
3. Present current capabilities and next actions
4. Ask user how to proceed

---

**🎯 This file enables zero-friction session continuation with full context restoration**
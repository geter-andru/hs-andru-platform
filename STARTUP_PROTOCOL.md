# Claude Code Startup Protocol - Automatic Context Loading

## 🎯 **AUTOMATIC SESSION INITIALIZATION SYSTEM**

This document provides instructions for setting up automatic context loading when Claude Code starts a new session using SessionStart hooks.

## 🔧 **CLAUDE CODE HOOK CONFIGURATION**

### **Step 1: Configure SessionStart Hook**

Run the following command in Claude Code to set up the SessionStart hook:

```
/hooks
```

Then select **SessionStart** and configure it to run the auto-context loader script.

### **Step 2: Hook Configuration JSON**

Add this configuration to your Claude Code hooks:

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matchers": ["startup", "resume", "clear"],
        "hooks": [
          {
            "type": "command",
            "command": "/Users/geter/hs-andru-platform/auto-context-loader.sh",
            "workingDirectory": "/Users/geter/hs-andru-platform"
          }
        ]
      }
    ]
  }
}
```

## 📋 **AUTOMATIC EXECUTION SEQUENCE**

When Claude Code starts a new session, the following will happen automatically:

### **1. Script Execution** (auto-context-loader.sh)
- ✅ **Project Directory Verification**: Ensures we're in the correct project
- ✅ **Git Status Check**: Shows uncommitted changes and recent commits  
- ✅ **Process Detection**: Identifies running development servers
- ✅ **Build Status**: Verifies dependencies and project health
- ✅ **File Verification**: Confirms critical documentation exists

### **2. Context Summary Generation**
- ✅ **Project Identification**: H&S Revenue Intelligence Platform
- ✅ **Current Status**: Latest achievements and development focus
- ✅ **Priority Tasks**: Immediate next steps and pending work
- ✅ **Development Roadmap**: Priority 1-4 tasks clearly identified

### **3. Automatic Documentation Loading Triggers**
The script outputs specific instructions for Claude to automatically:
- **Read CLAUDE.md** - Complete project context
- **Read PRE_RESTART_PROTOCOL_SESSION_SUMMARY.md** - Latest session summary
- **Read NEXTJS_ASSESSMENT_REBUILD_CODEX.md** - Assessment migration plan
- **Check TodoWrite tasks** - Current development priorities

## 🚀 **EXPECTED STARTUP BEHAVIOR**

### **Before Setup (Manual Process):**
```
User: "Load project context"
Claude: [Reads files manually, generates status]
```

### **After Setup (Automatic Process):**
```
Claude Code Session Starts → SessionStart Hook → auto-context-loader.sh → 
Automatic Context Loading → Ready with full project context
```

## 📝 **HOOK EXECUTION FLOW**

### **SessionStart Hook Triggers:**
- **startup**: When initially starting Claude Code
- **resume**: When using `--resume`, `--continue`, or `/resume`  
- **clear**: When using `/clear` command

### **Script Output includes:**
- **Git repository status** and recent commits
- **Running processes** (npm start, development servers)
- **Build and dependency status**
- **Project file verification**
- **Formatted context summary** for automatic Claude consumption

## 🔄 **CONTEXT LOADING PROTOCOL**

### **Phase 1: Environment Detection** (5 seconds)
- Verify project directory location
- Check git status and recent changes
- Detect running development processes
- Assess build and dependency health

### **Phase 2: Context Summary Generation** (3 seconds)
- Generate formatted project summary
- Identify current development focus
- List priority tasks and next steps
- Provide documentation loading instructions

### **Phase 3: Automatic Documentation Trigger** (2 seconds)
- Output specific file reading instructions
- Trigger TodoWrite task loading
- Provide immediate next steps
- Present ready-to-continue status

## 💡 **CUSTOMIZATION OPTIONS**

### **Script Customization:**
Edit `/Users/geter/hs-andru-platform/auto-context-loader.sh` to:
- Add project-specific checks
- Include additional file verifications
- Modify context summary format
- Add custom environment detection

### **Hook Matcher Customization:**
```json
"matchers": ["startup"]        // Only on fresh startup
"matchers": ["resume"]         // Only when resuming
"matchers": ["startup", "resume"] // Both startup and resume
```

### **Additional Context Loading:**
The script can be extended to:
- Load environment variables
- Check external service status
- Verify database connections
- Generate dynamic project summaries

## ⚡ **PERFORMANCE OPTIMIZATION**

### **Fast Execution:**
- Script completes in ~10 seconds total
- Minimal system resource usage
- Cached git operations
- Efficient file system checks

### **Smart Context Loading:**
- Only essential information loaded
- Formatted for Claude comprehension
- Structured for immediate action
- Priority-focused development context

## 🔍 **TROUBLESHOOTING**

### **Common Issues:**

**Hook Not Executing:**
```bash
# Check hook configuration
ls -la /Users/geter/hs-andru-platform/auto-context-loader.sh
# Should show executable permissions (-rwxr-xr-x)
```

**Script Fails:**
```bash
# Test script manually
cd /Users/geter/hs-andru-platform
./auto-context-loader.sh
```

**Wrong Directory:**
```bash
# Verify working directory in hook configuration
"workingDirectory": "/Users/geter/hs-andru-platform"
```

### **Verification Commands:**

**Test Hook Configuration:**
```
/hooks
# Check if SessionStart hook is properly configured
```

**Test Script Execution:**
```bash
cd /Users/geter/hs-andru-platform && ./auto-context-loader.sh
# Should output complete context summary
```

## 📊 **SUCCESS INDICATORS**

### **✅ Successful Setup:**
- SessionStart hook configured in Claude Code
- auto-context-loader.sh script executable
- Script outputs formatted context summary
- Claude automatically loads project context on session start

### **✅ Expected Session Start Experience:**
1. **Instant Context**: Full project context loaded automatically
2. **Current Status**: Latest achievements and progress clearly presented  
3. **Next Steps**: Immediate priorities and TodoWrite tasks identified
4. **Ready State**: Claude prepared for immediate development continuation

## 🎯 **STRATEGIC BENEFIT**

### **Before Auto-Context Loading:**
- Manual "load context" requests required
- 2-3 minutes to get oriented each session
- Risk of missing important context
- Inconsistent development continuation

### **After Auto-Context Loading:**  
- **Zero manual intervention** required
- **Immediate development readiness** on session start
- **Complete context preservation** across sessions
- **Seamless workflow continuation** every time

---

## 🚀 **ACTIVATION CHECKLIST**

- [ ] **Script Created**: auto-context-loader.sh with executable permissions
- [ ] **Hook Configured**: SessionStart hook pointing to script
- [ ] **Path Verified**: Correct project directory in hook configuration
- [ ] **Execution Tested**: Script runs successfully and outputs context
- [ ] **Claude Code Restart**: Restart to activate new hook configuration

**Result**: Every new Claude Code session will automatically load complete project context without manual intervention! 🎉
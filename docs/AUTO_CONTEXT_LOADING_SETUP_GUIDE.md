# Auto-Context Loading Setup Guide

## 🎯 **COMPLETE SETUP INSTRUCTIONS**

This guide provides step-by-step instructions for setting up automatic context loading in Claude Code, eliminating the need to manually request context at the start of each session.

## 📋 **OVERVIEW**

### **Problem Solved:**
- **Before**: "Load project context" required at start of every session
- **After**: Full project context automatically loaded on session start

### **Solution Components:**
1. **SessionStart Hook**: Claude Code's built-in session initialization system
2. **Auto-Context Script**: Bash script that gathers and formats project context  
3. **Context Documentation**: Enhanced documentation files for seamless loading

## 🔧 **STEP-BY-STEP SETUP**

### **Step 1: Verify Files Are Created**
Confirm these files exist in your project:
```bash
✅ /Users/geter/hs-andru-platform/auto-context-loader.sh (executable)
✅ /Users/geter/hs-andru-platform/STARTUP_PROTOCOL.md  
✅ /Users/geter/hs-andru-platform/AUTO_CONTEXT_LOADER.md (updated)
```

### **Step 2: Configure Claude Code SessionStart Hook**

1. **Open Claude Code** in your project directory
2. **Run the hooks command:**
   ```
   /hooks
   ```
3. **Select SessionStart** from the available options
4. **Configure the hook** with these settings:
   - **Command**: `/Users/geter/hs-andru-platform/auto-context-loader.sh`
   - **Working Directory**: `/Users/geter/hs-andru-platform`
   - **Matchers**: `["startup", "resume", "clear"]`

### **Step 3: Verify Hook Configuration**

Your Claude Code hooks configuration should include:
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

### **Step 4: Test the Configuration**

**Manual Script Test:**
```bash
cd /Users/geter/hs-andru-platform
./auto-context-loader.sh
```

**Expected Output:**
- ✅ Project directory verification
- ✅ Git status and recent commits  
- ✅ Running process detection
- ✅ Build status verification
- ✅ File existence checks
- ✅ Formatted context summary for Claude

### **Step 5: Restart Claude Code**
Close and restart Claude Code to activate the new SessionStart hook configuration.

## ✨ **EXPECTED BEHAVIOR AFTER SETUP**

### **Session Startup Sequence:**
1. **Claude Code starts** → SessionStart hook triggered
2. **Script executes** → Context gathered automatically  
3. **Claude receives** → Formatted project summary
4. **Immediate readiness** → Full context loaded, ready to continue work

### **Automatic Context Loading Includes:**
- **Project Status**: Current development phase and achievements
- **Git Information**: Recent commits and working directory status
- **Process Status**: Running development servers and build tools
- **Priority Tasks**: TodoWrite tasks and immediate next steps  
- **Documentation References**: Key files to read for complete context
- **Development Focus**: Current priorities and roadmap

## 🔄 **HOOK EXECUTION DETAILS**

### **SessionStart Hook Triggers:**
- **startup**: When initially starting Claude Code (fresh session)
- **resume**: When using `--resume`, `--continue`, or `/resume` commands
- **clear**: When using `/clear` command to reset context

### **Script Execution Time:**
- **Fast execution**: ~10 seconds total
- **Efficient checks**: Minimal system resource usage
- **Formatted output**: Optimized for Claude comprehension

### **Context Loading Priority:**
1. **Environment verification** (git, processes, files)
2. **Status summary** (achievements, focus, priorities)  
3. **Documentation triggers** (specific files to read)
4. **Next steps** (immediate actions and todolist)

## 📊 **VERIFICATION CHECKLIST**

### **✅ Setup Complete When:**
- [ ] **auto-context-loader.sh** exists and is executable
- [ ] **SessionStart hook** configured in Claude Code
- [ ] **Hook points** to correct script path
- [ ] **Working directory** set to project root
- [ ] **Manual test** produces expected context output
- [ ] **Claude Code restarted** to activate configuration

### **✅ Successful Operation When:**
- [ ] **New sessions** automatically show project context
- [ ] **Resume sessions** load current development status
- [ ] **Clear sessions** reset with fresh context loading
- [ ] **No manual intervention** required for context
- [ ] **Immediate productivity** on session start

## 🚨 **TROUBLESHOOTING**

### **Common Issues & Solutions:**

#### **Hook Not Executing:**
```bash
# Check script permissions
ls -la /Users/geter/hs-andru-platform/auto-context-loader.sh
# Should show: -rwxr-xr-x (executable)

# If not executable:
chmod +x /Users/geter/hs-andru-platform/auto-context-loader.sh
```

#### **Script Path Issues:**
- Verify absolute path is correct in hook configuration
- Ensure working directory matches project location
- Check for typos in file paths

#### **Script Execution Errors:**
```bash
# Test manually to debug issues
cd /Users/geter/hs-andru-platform
bash -x ./auto-context-loader.sh
```

#### **Hook Configuration Problems:**
- Re-run `/hooks` command in Claude Code
- Delete and recreate SessionStart hook if needed
- Verify JSON syntax in hook configuration

### **Debug Commands:**

**Verify Hook Status:**
```
/hooks
# Check if SessionStart hook is listed and configured
```

**Test Script Output:**
```bash
cd /Users/geter/hs-andru-platform && ./auto-context-loader.sh
```

**Check File Permissions:**
```bash
ls -la auto-context-loader.sh STARTUP_PROTOCOL.md AUTO_CONTEXT_LOADER.md
```

## 📈 **BENEFITS & IMPACT**

### **Productivity Improvements:**
- **Zero friction session starts**: No manual context loading required
- **Instant development readiness**: Full project context immediately available
- **Consistent experience**: Same context loading every session
- **Time savings**: 2-3 minutes saved per session start

### **Context Quality Improvements:**
- **Complete status awareness**: Git, processes, build status included
- **Priority-focused**: Current priorities and next steps highlighted  
- **Documentation integration**: Key files referenced for deeper context
- **Development continuity**: Seamless workflow across sessions

### **Risk Mitigation:**
- **No context loss**: Important project details never forgotten
- **Consistent information**: Same context loaded every time
- **Error prevention**: Build and environment issues detected early
- **Documentation sync**: Always references latest project documentation

## 🎯 **CUSTOMIZATION OPTIONS**

### **Script Modifications:**
Edit `auto-context-loader.sh` to:
- **Add project-specific checks** (database connections, services)
- **Include additional file verification** (config files, assets)
- **Modify context summary format** (different information priority)
- **Add environment-specific details** (staging, production status)

### **Hook Configuration Variations:**
```json
// Only on fresh startup
"matchers": ["startup"]

// Only when resuming work  
"matchers": ["resume"]

// All session initialization events
"matchers": ["startup", "resume", "clear"]
```

### **Additional Context Sources:**
The script can be extended to include:
- **External service status** (APIs, databases, third-party services)
- **Environment variable verification** (API keys, configuration)
- **Project-specific health checks** (tests, builds, deployments)
- **Dynamic status reports** (recent issues, pull requests, deployments)

---

## 🚀 **SUCCESS CONFIRMATION**

### **✅ Setup Successful When:**
After completing setup, **start a new Claude Code session**. You should see:

1. **Automatic script execution** (hook triggers automatically)
2. **Project context summary** displayed immediately  
3. **No manual intervention** needed
4. **Full development context** available from session start
5. **Ready to continue work** without additional setup

### **Expected Session Start Output:**
```
🚀 AUTO-CONTEXT LOADER ACTIVATED
=================================
✅ Located in project directory: /Users/geter/hs-andru-platform
📋 LOADING PROJECT CONTEXT...
[Complete project status, git info, processes, priorities, next steps]
🎯 CONTEXT LOADING COMPLETE
**Auto-Context Loading Protocol executed successfully! 🎉**
✨ Ready for development continuation!
```

**Result**: Every Claude Code session will begin with complete project context automatically loaded! 🎉

---

## 📞 **SUPPORT & MAINTENANCE**

### **Updating the Script:**
- Modify `auto-context-loader.sh` as project needs evolve
- Add new file checks, process detection, or context elements
- Script changes take effect immediately (no hook reconfiguration needed)

### **Hook Management:**  
- Use `/hooks` command to view, modify, or delete configured hooks
- SessionStart hooks persist across Claude Code updates
- Can be disabled temporarily without deletion

### **Documentation Maintenance:**
- Keep `CLAUDE.md` updated with latest project status
- Update priority tasks and development focus
- Script automatically references latest documentation

**This setup provides zero-friction automatic context loading for seamless Claude Code development sessions!** 🚀
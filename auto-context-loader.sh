#!/bin/bash

# Auto-Context Loader Script for Claude Code SessionStart Hook
# This script automatically loads project context when Claude Code starts a new session

echo "🚀 AUTO-CONTEXT LOADER ACTIVATED"
echo "================================="

# Project identification
PROJECT_NAME="H&S Revenue Intelligence Platform"
PROJECT_ROOT="/Users/geter/hs-andru-platform"

# Check if we're in the right directory
if [ "$PWD" != "$PROJECT_ROOT" ]; then
    echo "⚠️  Not in project directory. Current: $PWD"
    echo "📁 Expected: $PROJECT_ROOT"
    cd "$PROJECT_ROOT" 2>/dev/null || {
        echo "❌ Failed to navigate to project directory"
        exit 1
    }
fi

echo "✅ Located in project directory: $PWD"
echo ""

# Generate context summary for Claude
echo "📋 LOADING PROJECT CONTEXT..."
echo "=============================="

# Check git status
echo "🔍 Git Status:"
git status --porcelain 2>/dev/null | head -5 || echo "   No git repository or changes"

# Get latest commits
echo ""
echo "📝 Recent Commits:"
git log --oneline -3 2>/dev/null || echo "   No git history available"

# Check for running processes
echo ""
echo "🖥️  Running Processes:"
pgrep -f "npm start\|node\|npm run dev" | head -3 | while read pid; do
    ps -p $pid -o pid,cmd --no-headers 2>/dev/null | head -1
done || echo "   No relevant processes running"

# Check build status
echo ""
echo "🔨 Build Status:"
if [ -f "package.json" ]; then
    echo "   Package.json found - Node.js project detected"
    if [ -d "node_modules" ]; then
        echo "   ✅ Dependencies installed"
    else
        echo "   ⚠️  Dependencies may need installation"
    fi
else
    echo "   No package.json found"
fi

# Check for important files
echo ""
echo "📄 Key Files Status:"
for file in "CLAUDE.md" "PROJECT_STATUS.md" "AUTO_CONTEXT_LOADER.md" "package.json"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file"
    else
        echo "   ❌ $file (missing)"
    fi
done

echo ""
echo "🎯 CONTEXT LOADING COMPLETE"
echo "============================="

# Output additional context for Claude Code
cat << 'EOF'

## 🤖 AUTOMATIC CONTEXT LOAD SUMMARY

**Project**: H&S Revenue Intelligence Platform  
**Repository**: https://github.com/geter-andru/hs-andru-platform  
**Status**: Local MCP servers converted, ready for Next.js assessment migration

### 📋 IMMEDIATE CONTEXT ITEMS TO LOAD:
1. **Read CLAUDE.md** - Complete project context and recent achievements
2. **Read docs/PRE_RESTART_PROTOCOL_SESSION_SUMMARY.md** - Latest session summary  
3. **Read docs/NEXTJS_ASSESSMENT_REBUILD_CODEX.md** - Next.js assessment migration plan
4. **Check TodoWrite tasks** - Pending development priorities

### 🚀 CURRENT DEVELOPMENT FOCUS:
- **Priority 1**: Next.js Assessment Migration (andru-ai.com)
- **Priority 2**: Google Workspace MCP servers  
- **Priority 3**: Advanced agent development (LinkedIn, ContentStrategy)
- **Priority 4**: Platform migration planning (platform.andru-ai.com)

### 🔧 RECENT MAJOR ACHIEVEMENTS:
- ✅ **3 MCP servers converted** to local instances (GitHub, Supabase, LinkedIn)
- ✅ **Performance optimized** with instant startup times
- ✅ **Assessment strategy documented** with comprehensive Next.js rebuild plan
- ✅ **Configuration updated** for all local server execution

### ⚡ IMMEDIATE NEXT STEPS:
1. Verify local MCP servers are functional after restart
2. Begin Next.js assessment application development  
3. Test GitHub, Supabase, LinkedIn MCP server operations
4. Continue with priority development roadmap

**Auto-Context Loading Protocol executed successfully! 🎉**

EOF

echo ""
echo "✨ Ready for development continuation!"
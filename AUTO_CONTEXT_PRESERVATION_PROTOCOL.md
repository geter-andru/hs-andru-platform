# AUTO CONTEXT PRESERVATION PROTOCOL
## Automated Context Management for Claude Code Sessions

### 🎯 **HYBRID TRIGGER SYSTEM**
**Primary Trigger**: User says "EXECUTE CONTEXT PRESERVATION PROTOCOL"

**Periodic Checkpoints (Option 2)**: 
- Every 30-45 minutes: "Should I run a context checkpoint?"
- Continuous CLAUDE.md maintenance between checkpoints
- Regular TodoWrite updates and status captures
- Quick preservation to prevent work loss

**Session Length Awareness (Option 3)**:
- For 1+ hour sessions: Increased frequency (20-30 minutes)
- Enhanced documentation mode with proactive handoff preparation
- Critical moment detection before major architectural changes
- Automatic preservation during complex multi-step tasks

### 📋 **AUTO-EXECUTION CHECKLIST**

#### **Phase 1: Immediate Status Capture (30 seconds)**
1. **Current Task Assessment**
   ```
   - [ ] Identify active task in progress
   - [ ] Note completion percentage of current task
   - [ ] Capture any error states or blockers
   - [ ] Record next immediate action needed
   ```

2. **System State Documentation**
   ```
   - [ ] Check git status for uncommitted changes
   - [ ] Note any running processes (npm start, servers, etc.)
   - [ ] Record current branch and commit hash
   - [ ] Capture any pending file operations
   ```

3. **Context Handoff Preparation**
   ```
   - [ ] Summarize work completed in current session
   - [ ] List pending tasks from TodoWrite tool
   - [ ] Note any critical decisions or discoveries
   - [ ] Record user's last explicit instruction
   ```

#### **Phase 2: Documentation Update (60 seconds)**
1. **Update CLAUDE.md**
   ```
   - [ ] Add latest milestone/achievement section
   - [ ] Update current status and capabilities
   - [ ] Record any new technical implementations
   - [ ] Update testing URLs and access information
   ```

2. **Create Session Handoff Summary**
   ```
   - [ ] Document session accomplishments
   - [ ] List active work in progress
   - [ ] Record immediate next steps
   - [ ] Note any blockers or issues discovered
   ```

3. **Preserve Critical Context**
   ```
   - [ ] Save user preferences and decisions
   - [ ] Record technical architecture changes
   - [ ] Document new patterns or conventions established
   - [ ] Preserve debugging context if applicable
   ```

#### **Phase 3: Safe Transition (30 seconds)**
1. **Code Safety Check**
   ```
   - [ ] Ensure no syntax errors in modified files
   - [ ] Verify critical files are saved
   - [ ] Check that builds are not broken
   - [ ] Confirm no data loss risk
   ```

2. **Handoff Message Preparation**
   ```
   - [ ] Prepare continuation instructions
   - [ ] Summarize context for next session
   - [ ] List immediate action items
   - [ ] Provide testing/verification steps
   ```

### 🤖 **AUTOMATED EXECUTION SCRIPT**

#### **Template for Context Preservation**
```markdown
# CONTEXT PRESERVATION CHECKPOINT - [TIMESTAMP]

## 🎯 CURRENT TASK STATUS
- **Active Task**: [Specific task in progress]
- **Completion**: [X% complete]
- **Next Action**: [Immediate next step]
- **Blockers**: [Any issues or dependencies]

## 🔧 SYSTEM STATE
- **Git Status**: [Clean/Modified files/Branch]
- **Running Processes**: [npm start, servers, etc.]
- **Build Status**: [Compiling/Error state]
- **Current Directory**: [Working location]

## ✅ SESSION ACCOMPLISHMENTS
[List major achievements this session]

## 📋 IMMEDIATE PRIORITIES
[From TodoWrite tool - active/pending tasks]

## 🚀 CONTINUATION INSTRUCTIONS
1. [First action to take]
2. [Second action to take] 
3. [Third action to take]

## 💡 CONTEXT NOTES
- **User Intent**: [Last explicit user request]
- **Technical Decisions**: [Any architecture/design decisions made]
- **Testing Status**: [What needs verification]
- **Dependencies**: [External factors to consider]
```

### 🔄 **POST-PRESERVATION ACTIONS**

#### **Immediate Execution**
1. **Save preservation document** to project root
2. **Update CLAUDE.md** with latest status
3. **Commit critical changes** if safe to do so
4. **Generate handoff summary** for user

#### **User Communication**
```
🤖 AUTO-CONTEXT PRESERVATION TRIGGERED (2% remaining)

Current session preserved. Key status:
- Task: [Current task]
- Progress: [Status]
- Next: [Immediate action]

All context saved to preservation checkpoint.
Ready to continue seamlessly in new session.
```

### 🕐 **SESSION MONITORING IMPLEMENTATION**

#### **Periodic Checkpoint System (30-45 minute intervals)**
```javascript
// Context Preservation Service
class ContextPreservationService {
  constructor() {
    this.sessionStartTime = Date.now();
    this.lastCheckpoint = Date.now();
    this.checkpointInterval = 30 * 60 * 1000; // 30 minutes
    this.longSessionThreshold = 60 * 60 * 1000; // 1 hour
    this.enabled = true;
  }

  // Periodic checkpoint prompts
  schedulePeriodicCheckpoints() {
    setInterval(() => {
      if (this.shouldPromptCheckpoint()) {
        this.promptUserForCheckpoint();
      }
    }, this.checkpointInterval);
  }

  shouldPromptCheckpoint() {
    const sessionLength = Date.now() - this.sessionStartTime;
    const timeSinceLastCheckpoint = Date.now() - this.lastCheckpoint;
    
    // For sessions over 1 hour, increase frequency to 20-30 minutes
    const dynamicInterval = sessionLength > this.longSessionThreshold 
      ? 25 * 60 * 1000  // 25 minutes for long sessions
      : this.checkpointInterval; // 30 minutes for normal sessions
    
    return timeSinceLastCheckpoint >= dynamicInterval;
  }

  promptUserForCheckpoint() {
    console.log("🔄 Should I run a context checkpoint?");
    this.lastCheckpoint = Date.now();
  }
}
```

#### **Session Length Awareness Implementation**
```javascript
// Enhanced monitoring for 1+ hour sessions
class SessionLengthMonitor {
  constructor() {
    this.sessionStart = Date.now();
    this.hourlyThresholds = [1, 2, 3, 4]; // Hours
    this.triggeredThresholds = new Set();
  }

  checkSessionLength() {
    const sessionHours = (Date.now() - this.sessionStart) / (1000 * 60 * 60);
    
    this.hourlyThresholds.forEach(threshold => {
      if (sessionHours >= threshold && !this.triggeredThresholds.has(threshold)) {
        this.triggeredThresholds.add(threshold);
        this.handleLongSession(threshold);
      }
    });
  }

  handleLongSession(hours) {
    switch(hours) {
      case 1:
        console.log("🕐 1-hour session detected. Increasing checkpoint frequency to 20-30 minutes.");
        break;
      case 2:
        console.log("🕐 2-hour session detected. Enhanced documentation mode active.");
        break;
      case 3:
        console.log("🕐 3-hour session detected. Critical moment detection enabled.");
        break;
      case 4:
        console.log("🕐 4-hour session detected. Automatic preservation during complex tasks.");
        break;
    }
  }
}
```

### 🎛️ **USER CONTROL MECHANISMS**

#### **Manual Checkpoint Commands**
- **Primary Command**: "EXECUTE CONTEXT PRESERVATION PROTOCOL"
- **Quick Command**: "Save checkpoint"
- **Emergency Command**: "Emergency preservation"
- **Status Command**: "Context status"

#### **User Preference Controls**
```javascript
// User-configurable preservation settings
const userPreferences = {
  enablePeriodicPrompts: true,
  checkpointInterval: 30, // minutes
  longSessionMode: true,
  autoPreservationThreshold: 2, // percentage
  notificationStyle: 'prompt', // 'prompt' | 'silent' | 'verbose'
  preservationDepth: 'comprehensive' // 'minimal' | 'standard' | 'comprehensive'
};

// Checkpoint frequency adjustment
function adjustCheckpointFrequency(sessionLength) {
  if (sessionLength > 60) { // 1+ hour sessions
    return Math.max(20, 45 - (sessionLength / 60) * 5); // Decrease by 5 min per hour
  }
  return 30; // Default 30 minutes
}
```

#### **Smart Preservation Triggers**
```javascript
// Intelligent trigger detection
class SmartPreservationTriggers {
  static detectCriticalMoments() {
    return [
      'Before major architectural changes',
      'After completing significant milestones', 
      'Before starting complex multi-step tasks',
      'When switching between major features',
      'After resolving critical bugs',
      'Before git operations (merge, rebase)',
      'When context usage approaches 10%, 5%, 3%'
    ];
  }

  static shouldAutoPreserve(context) {
    return {
      majorArchitecturalChange: context.includes('architecture') || context.includes('refactor'),
      milestoneCompletion: context.includes('complete') || context.includes('finished'),
      complexTaskStart: context.includes('implement') || context.includes('build'),
      featureSwitch: context.includes('switch') || context.includes('move to'),
      criticalBugFix: context.includes('fix') || context.includes('resolve'),
      gitOperation: context.includes('git') || context.includes('merge'),
      contextLow: this.getContextUsage() <= 10
    };
  }
}
```

#### **Preservation Quality Controls**
```javascript
// Quality assurance for context preservation
class PreservationQualityControl {
  static validatePreservation(preservationData) {
    const requiredElements = [
      'currentTask',
      'completionPercentage', 
      'gitStatus',
      'runningProcesses',
      'sessionAccomplishments',
      'immediatePriorities',
      'continuationInstructions',
      'contextNotes'
    ];

    return requiredElements.every(element => 
      preservationData[element] && preservationData[element] !== ''
    );
  }

  static scorePrservationCompleteness(data) {
    const completenessScore = Object.keys(data).length / 8 * 100;
    return {
      score: completenessScore,
      quality: completenessScore >= 90 ? 'excellent' : 
               completenessScore >= 75 ? 'good' : 
               completenessScore >= 60 ? 'acceptable' : 'needs_improvement'
    };
  }
}
```

### 📊 **MONITORING GUIDELINES**

#### **Context Usage Tracking**
- Monitor context percentage during long tasks
- Trigger warnings at 10%, 5%, and 3% remaining
- Auto-execute protocol at 2% without user intervention
- Prioritize critical information preservation

#### **Recovery Verification**
- Ensure all TodoWrite tasks are captured
- Verify current work state is documented
- Confirm user intent is preserved
- Validate technical context is maintained

### ⚡ **EFFICIENCY OPTIMIZATIONS**

#### **Rapid Execution Mode**
- Pre-template standard responses
- Use abbreviated status checks for speed
- Focus on critical context only
- Minimize user interruption

#### **Smart Context Pruning**
- Prioritize recent work over historical context
- Keep user instructions and active tasks
- Preserve technical architecture decisions
- Maintain testing and access information

### 🎯 **SUCCESS CRITERIA**

#### **Protocol Completion Indicators**
- [ ] All active tasks documented in TodoWrite or preservation doc
- [ ] Current work state captured with next steps
- [ ] Technical context preserved (git status, running processes)
- [ ] User intent and last instructions recorded
- [ ] CLAUDE.md updated with latest achievements
- [ ] Handoff summary prepared for seamless continuation

#### **Quality Assurance**
- Context preservation completes within 2 minutes
- No critical information lost
- Next session can continue immediately
- User experience minimally disrupted

---

## 🚀 **ACTIVATION PROTOCOL**

**This protocol executes automatically when context ≤ 2%**

1. **Auto-detect** context threshold reached
2. **Pause** current activity immediately
3. **Execute** preservation checklist rapidly
4. **Update** documentation and status
5. **Prepare** handoff for continuation
6. **Notify** user of preservation completion

**Goal: Zero context loss, seamless continuation, minimal disruption**
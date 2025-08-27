# Next.js Assessment Rebuild - Complete Development Codex

## **PROJECT CODEX: ANDRU-ASSESSMENT-NEXTJS**

### **🎯 PROJECT MISSION**
Transform the 3,500-line standalone HTML Revenue Assessment Tool into a high-performance Next.js 14 application deployed at `andru-ai.com` with real-time Airtable integration for technical founder qualification and platform personalization.

### **📋 TECHNICAL SPECIFICATIONS**

#### **Core Requirements**
- **Framework**: Next.js 14.2+ with App Router
- **Deployment**: Vercel with `andru-ai.com` domain
- **Database**: Airtable "Assessment Results" table integration
- **Performance Target**: 90+ Lighthouse score, sub-200ms load time
- **Mobile**: Responsive design with touch optimization
- **Analytics**: Comprehensive user journey tracking

#### **Migration Scope**
- **Questions**: 14-question assessment system
- **Scoring**: 60% buyer understanding, 40% tech translation algorithm
- **UI/UX**: Modern React components with Tailwind CSS
- **Features**: Exit-intent optimization, social sharing, cohort tracking
- **Data Flow**: Real-time submission to Airtable → Platform personalization trigger

---

## **🏗️ PROJECT ARCHITECTURE**

### **Directory Structure**
```
andru-assessment/
├── app/
│   ├── layout.tsx                 # Root layout with analytics
│   ├── page.tsx                   # Landing page with assessment CTA
│   ├── assessment/
│   │   ├── layout.tsx             # Assessment-specific layout
│   │   ├── page.tsx               # Assessment container component
│   │   ├── question/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Dynamic question routing
│   │   ├── progress/
│   │   │   └── page.tsx           # Progress tracking page
│   │   └── results/
│   │       └── page.tsx           # Results with platform redirect
│   ├── api/
│   │   ├── assessment/
│   │   │   ├── submit/route.ts    # Airtable submission endpoint
│   │   │   ├── progress/route.ts  # Progress tracking API
│   │   │   └── validate/route.ts  # Response validation
│   │   ├── analytics/
│   │   │   ├── track/route.ts     # Event tracking
│   │   │   └── cohort/route.ts    # Cohort analytics
│   │   └── auth/
│   │       └── platform/route.ts # Platform auth bridge
│   ├── globals.css                # Tailwind + custom styles
│   └── not-found.tsx              # 404 handling
├── components/
│   ├── ui/                        # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Progress.tsx
│   │   ├── Modal.tsx
│   │   └── Input.tsx
│   ├── assessment/                # Assessment-specific components
│   │   ├── QuestionCard.tsx
│   │   ├── ScoreDisplay.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── ResultsSummary.tsx
│   │   └── SocialShare.tsx
│   ├── layout/                    # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── analytics/                 # Analytics components
│       ├── ExitIntentModal.tsx
│       ├── CohortTracker.tsx
│       └── EventTracker.tsx
├── lib/
│   ├── assessment/                # Assessment logic
│   │   ├── questions.ts           # Question definitions
│   │   ├── scoring.ts             # Scoring algorithms
│   │   ├── validation.ts          # Response validation
│   │   └── personalization.ts    # Personalization logic
│   ├── airtable/                  # Airtable integration
│   │   ├── client.ts              # Airtable client setup
│   │   ├── schemas.ts             # Table schemas
│   │   └── operations.ts          # CRUD operations
│   ├── analytics/                 # Analytics utilities
│   │   ├── tracking.ts            # Event tracking
│   │   ├── cohorts.ts             # Cohort management
│   │   └── conversion.ts          # Conversion tracking
│   └── utils/                     # Utility functions
│       ├── constants.ts           # App constants
│       ├── helpers.ts             # Helper functions
│       └── types.ts               # TypeScript types
├── hooks/                         # Custom React hooks
│   ├── useAssessment.ts           # Assessment state management
│   ├── useAnalytics.ts            # Analytics tracking
│   ├── useExitIntent.ts           # Exit intent detection
│   └── useLocalStorage.ts         # Local storage management
├── styles/                        # Additional styles
│   ├── components.css             # Component-specific styles
│   └── animations.css             # Animation definitions
├── public/
│   ├── images/                    # Static images
│   ├── icons/                     # Icon assets
│   └── favicon.ico                # Favicon
├── tests/                         # Test files
│   ├── __mocks__/                 # Test mocks
│   ├── components/                # Component tests
│   ├── lib/                       # Library tests
│   └── integration/               # Integration tests
├── .env.local                     # Environment variables
├── next.config.js                 # Next.js configuration
├── tailwind.config.js             # Tailwind configuration
├── package.json                   # Dependencies
└── README.md                      # Project documentation
```

---

## **🧩 COMPONENT SPECIFICATIONS**

### **Core Assessment Components**

#### **1. QuestionCard.tsx**
```typescript
interface QuestionCardProps {
  question: AssessmentQuestion;
  currentResponse?: number;
  onResponse: (questionId: string, value: number) => void;
  showProgress?: boolean;
  isLast?: boolean;
}

// Features:
// - Animated transitions between questions
// - Touch-friendly response options
// - Progress indicator integration
// - Validation feedback
// - Auto-save functionality
```

#### **2. ProgressBar.tsx**
```typescript
interface ProgressBarProps {
  currentQuestion: number;
  totalQuestions: number;
  completionPercentage: number;
  showTimeEstimate?: boolean;
}

// Features:
// - Smooth progress animations
// - Time estimation display
// - Milestone markers (25%, 50%, 75%)
// - Accessibility compliance
```

#### **3. ScoreDisplay.tsx**
```typescript
interface ScoreDisplayProps {
  buyerUnderstandingScore: number;
  techTranslationScore: number;
  overallScore: number;
  qualification: 'Qualified' | 'Promising' | 'Nurture' | 'Unqualified';
  showBreakdown?: boolean;
}

// Features:
// - Animated score reveals
// - Visual score representations
// - Qualification status styling
// - Score breakdown modal
```

#### **4. ResultsSummary.tsx**
```typescript
interface ResultsSummaryProps {
  assessmentResults: AssessmentResult;
  personalizationProfile: PersonalizationProfile;
  platformRedirectUrl: string;
  showSocialShare?: boolean;
}

// Features:
// - Personalized recommendations
// - Platform onboarding preview
// - Social sharing options
// - Email capture integration
```

#### **5. ExitIntentModal.tsx**
```typescript
interface ExitIntentModalProps {
  currentProgress: number;
  onContinue: () => void;
  onExit: () => void;
  showIncentive?: boolean;
}

// Features:
// - Exit intent detection
// - Progress preservation messaging
// - Incentive offers (early access, etc.)
// - A/B testing integration
```

### **Data Management Components**

#### **6. AssessmentProvider.tsx**
```typescript
interface AssessmentContextType {
  currentQuestion: number;
  responses: Record<string, number>;
  progress: number;
  isComplete: boolean;
  saveResponse: (questionId: string, value: number) => Promise<void>;
  nextQuestion: () => void;
  previousQuestion: () => void;
  submitAssessment: () => Promise<AssessmentResult>;
}

// Features:
// - Context-based state management
// - Automatic progress saving
// - Real-time validation
// - Error handling and retry logic
```

#### **7. AnalyticsProvider.tsx**
```typescript
interface AnalyticsContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void;
  trackProgress: (questionId: string, timeSpent: number) => void;
  trackExitIntent: (triggerPoint: string) => void;
  identifyUser: (traits: UserTraits) => void;
}

// Features:
// - Event batching and queuing
// - Privacy-compliant tracking
// - Performance monitoring
// - Error tracking
```

---

## **⚙️ API ROUTES SPECIFICATIONS**

### **Assessment Submission API**

#### **POST /api/assessment/submit**
```typescript
interface SubmitAssessmentRequest {
  responses: Record<string, number>;
  userInfo: {
    email: string;
    name?: string;
    company?: string;
  };
  analytics: {
    timeSpent: number;
    hesitationPoints: string[];
    exitIntentTriggers: number;
    deviceInfo: DeviceInfo;
  };
}

interface SubmitAssessmentResponse {
  success: boolean;
  assessmentId: string;
  scores: {
    buyerUnderstanding: number;
    techTranslation: number;
    overall: number;
  };
  qualification: string;
  personalizationProfile: PersonalizationProfile;
  platformRedirectUrl: string;
}

// Implementation Features:
// - Real-time Airtable submission
// - Score calculation
// - Personalization profile generation
// - Platform account pre-creation
// - Error handling and retries
```

#### **POST /api/assessment/progress**
```typescript
interface SaveProgressRequest {
  sessionId: string;
  currentQuestion: number;
  responses: Record<string, number>;
  timestamp: string;
}

// Implementation Features:
// - Progress persistence
// - Session management
// - Automatic cleanup
// - Recovery capabilities
```

#### **POST /api/analytics/track**
```typescript
interface TrackEventRequest {
  event: string;
  properties: Record<string, any>;
  sessionId: string;
  timestamp: string;
}

// Implementation Features:
// - Event batching
// - Privacy compliance
// - Performance optimization
// - Real-time analytics
```

---

## **📊 AIRTABLE INTEGRATION SPECIFICATIONS**

### **Assessment Results Table Schema**
```typescript
interface AssessmentResultRecord {
  // Auto-generated fields
  'Assessment ID': string;           // ASS_{0000}
  'Created Time': string;
  
  // User identification
  'Email': string;
  'Name'?: string;
  'Company'?: string;
  'User ID'?: string;                // Link to Customer Assets
  
  // Assessment scores
  'Raw Responses': string;           // JSON
  'Buyer Understanding Score': number;
  'Tech Translation Score': number;
  'Overall Score': number;
  'Qualification Status': 'Qualified' | 'Promising' | 'Nurture' | 'Unqualified';
  
  // Personalization data
  'Primary Challenge': string;
  'Technical Background': string;
  'Company Stage': string;
  'Revenue Range': string;
  'Team Size': string;
  
  // Behavioral analytics
  'Time Spent': number;
  'Question Hesitation Points': string; // JSON
  'Exit Intent Triggers': number;
  'Social Share Attempted': boolean;
  'Completion Rate': number;
  
  // Traffic & device
  'Traffic Source': string;
  'Device Type': 'Desktop' | 'Mobile' | 'Tablet';
  'Browser': string;
  'Location': string;
  
  // Conversion tracking
  'Platform Signup': boolean;
  'Platform Signup Date'?: string;
  'Cohort ID': string;
  
  // Personalization output
  'Recommended Tools': string[];
  'Milestone Suggestion': string;
  'Personalization Profile': string;  // JSON
}
```

### **Airtable Client Implementation**
```typescript
// lib/airtable/client.ts
export class AirtableClient {
  async createAssessmentResult(data: AssessmentResultRecord): Promise<string>
  async updateAssessmentResult(id: string, data: Partial<AssessmentResultRecord>): Promise<boolean>
  async getAssessmentResult(id: string): Promise<AssessmentResultRecord | null>
  async trackConversion(assessmentId: string, platformSignup: boolean): Promise<boolean>
  async getCohortAnalytics(cohortId: string): Promise<CohortAnalytics>
}
```

---

## **🎨 UI/UX DESIGN SPECIFICATIONS**

### **Design System**
```typescript
// Tailwind Configuration
const designSystem = {
  colors: {
    primary: {
      50: '#f0f9ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    secondary: {
      50: '#f8fafc',
      500: '#64748b',
      900: '#0f172a'
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444'
  },
  
  typography: {
    fonts: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'monospace']
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    }
  },
  
  spacing: {
    xs: '0.5rem',
    sm: '1rem', 
    md: '1.5rem',
    lg: '2rem',
    xl: '3rem'
  },
  
  borderRadius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem'
  }
};
```

### **Component Styling Standards**
```typescript
// Button Component Variants
const buttonVariants = {
  primary: 'bg-primary-500 hover:bg-primary-600 text-white',
  secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900',
  ghost: 'hover:bg-secondary-100 text-secondary-700',
  danger: 'bg-error text-white hover:bg-red-600'
};

// Card Component Standards  
const cardStyles = {
  base: 'bg-white border border-secondary-200 rounded-lg shadow-sm',
  hover: 'hover:shadow-md transition-shadow duration-200',
  padding: 'p-6'
};

// Animation Standards
const animations = {
  fadeIn: 'animate-in fade-in duration-300',
  slideUp: 'animate-in slide-in-from-bottom-4 duration-300',
  scaleIn: 'animate-in zoom-in-95 duration-200'
};
```

### **Mobile Optimization**
```typescript
// Responsive Design Breakpoints
const breakpoints = {
  sm: '640px',    // Mobile
  md: '768px',    // Tablet
  lg: '1024px',   // Desktop
  xl: '1280px'    // Large Desktop
};

// Touch-Friendly Interactions
const touchOptimizations = {
  minimumTapTarget: '44px',
  swipeThreshold: '50px',
  scrollBehavior: 'smooth',
  focusVisible: 'ring-2 ring-primary-500 ring-offset-2'
};
```

---

## **🚀 PERFORMANCE OPTIMIZATION**

### **Next.js Optimizations**
```typescript
// next.config.js
const nextConfig = {
  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', '@headlessui/react']
  },
  
  // Image optimization
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
  },
  
  // Bundle optimization
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'react/jsx-runtime.js': 'preact/compat/jsx-runtime',
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat'
      };
    }
    return config;
  },
  
  // Compression
  compress: true,
  
  // Headers for performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          }
        ]
      }
    ];
  }
};
```

### **Loading & Caching Strategy**
```typescript
// Progressive Loading
const loadingStrategy = {
  // Question preloading
  preloadNext: 2, // Preload next 2 questions
  
  // Image lazy loading
  lazyImages: true,
  
  // Component code splitting
  dynamicImports: [
    'ResultsSummary',
    'SocialShare', 
    'ExitIntentModal'
  ],
  
  // Service Worker caching
  cacheStrategy: {
    questions: 'cache-first',
    api: 'network-first',
    static: 'cache-first'
  }
};
```

### **Bundle Size Optimization**
```typescript
// Package optimization targets
const bundleTargets = {
  initialJS: '<100kb',
  totalJS: '<300kb',
  css: '<50kb',
  images: '<500kb total',
  fonts: '<100kb'
};

// Tree shaking configuration
const treeShaking = {
  lodash: 'lodash-es', // Use ES modules version
  date: 'date-fns',    // Import only used functions
  icons: 'lucide-react' // Import only used icons
};
```

---

## **🧪 TESTING STRATEGY**

### **Test Coverage Requirements**
```typescript
// Coverage targets
const testingTargets = {
  statements: 90,
  branches: 85,
  functions: 90,
  lines: 90
};

// Test categories
const testCategories = {
  unit: [
    'Assessment scoring logic',
    'Question validation',
    'Personalization algorithms',
    'Utility functions'
  ],
  
  integration: [
    'Airtable API integration',
    'Assessment flow end-to-end',
    'Analytics tracking',
    'Platform redirect'
  ],
  
  e2e: [
    'Complete assessment journey',
    'Mobile responsive behavior',
    'Exit intent handling',
    'Social sharing flow'
  ],
  
  performance: [
    'Lighthouse scores',
    'Core Web Vitals',
    'Bundle size limits',
    'API response times'
  ]
};
```

### **Testing Infrastructure**
```typescript
// jest.config.js
const jestConfig = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1'
  },
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    'lib/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 85,
      functions: 90,
      lines: 90
    }
  }
};

// Playwright E2E configuration
const playwrightConfig = {
  testDir: './tests/e2e',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'Desktop Chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
    { name: 'Desktop Safari', use: { ...devices['Desktop Safari'] } }
  ]
};
```

---

## **📱 DEPLOYMENT CONFIGURATION**

### **Vercel Deployment Setup**
```typescript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/assessment/(.*)",
      "dest": "/assessment/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "AIRTABLE_API_KEY": "@airtable-api-key",
    "AIRTABLE_BASE_ID": "@airtable-base-id",
    "NEXT_PUBLIC_ANALYTICS_ID": "@analytics-id"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options", 
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### **Environment Configuration**
```bash
# .env.local
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_ASSESSMENT_TABLE=Assessment%20Results

NEXT_PUBLIC_SITE_URL=https://andru-ai.com
NEXT_PUBLIC_PLATFORM_URL=https://platform.andru-ai.com

NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
NEXT_PUBLIC_GTM_ID=your_gtm_id

# Development
NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
```

### **Domain Configuration**
```typescript
// Domain setup for andru-ai.com
const domainConfig = {
  primary: 'andru-ai.com',
  aliases: ['www.andru-ai.com'],
  redirects: [
    {
      source: '/assessment',
      destination: '/assessment/start',
      permanent: false
    },
    {
      source: '/start',
      destination: '/assessment/start', 
      permanent: false
    }
  ],
  
  // SSL and security
  security: {
    ssl: true,
    hsts: true,
    forceHttps: true
  }
};
```

---

## **📈 ANALYTICS & MONITORING**

### **Event Tracking Schema**
```typescript
interface AnalyticsEvents {
  // Assessment flow events
  assessment_started: {
    source: string;
    device: string;
    timestamp: number;
  };
  
  question_answered: {
    questionId: string;
    questionNumber: number;
    response: number;
    timeSpent: number;
    hesitated: boolean;
  };
  
  question_skipped: {
    questionId: string;
    questionNumber: number;
    reason: 'timeout' | 'user_action';
  };
  
  exit_intent_triggered: {
    questionNumber: number;
    totalProgress: number;
    triggerType: 'mouse' | 'scroll' | 'time';
  };
  
  assessment_completed: {
    totalTime: number;
    completionRate: number;
    scores: ScoreBreakdown;
    qualification: string;
  };
  
  platform_redirect: {
    assessmentId: string;
    qualification: string;
    redirectUrl: string;
  };
  
  social_share_attempted: {
    platform: 'linkedin' | 'twitter';
    assessmentId: string;
    completed: boolean;
  };
}
```

### **Performance Monitoring**
```typescript
// Performance metrics tracking
const performanceMonitoring = {
  coreWebVitals: {
    LCP: '<2.5s',      // Largest Contentful Paint
    FID: '<100ms',     // First Input Delay  
    CLS: '<0.1',       // Cumulative Layout Shift
    FCP: '<1.8s',      // First Contentful Paint
    TTFB: '<600ms'     // Time to First Byte
  },
  
  customMetrics: {
    questionLoadTime: '<500ms',
    assessmentSubmitTime: '<1s',
    airtableResponseTime: '<2s',
    totalAssessmentTime: 'track average'
  },
  
  errorTracking: {
    jsErrors: 'capture all',
    apiErrors: 'capture with context',
    userFeedback: 'optional collection'
  }
};
```

---

## **🔐 SECURITY SPECIFICATIONS**

### **Data Protection**
```typescript
// Security measures
const securityConfig = {
  // Input validation
  validation: {
    email: 'strict RFC 5322 compliance',
    responses: 'type checking and range validation',
    sanitization: 'XSS prevention on all inputs'
  },
  
  // API security
  apiSecurity: {
    rateLimit: '100 requests per minute per IP',
    cors: 'restrict to andru-ai.com domain',
    headers: 'security headers on all responses'
  },
  
  // Data handling
  dataProtection: {
    encryption: 'TLS 1.3 in transit',
    storage: 'Airtable with access controls',
    retention: 'indefinite for qualified leads',
    anonymization: 'remove PII after 90 days for unqualified'
  },
  
  // Privacy compliance
  privacy: {
    gdpr: 'consent collection and data portability',
    ccpa: 'opt-out mechanisms',
    cookies: 'essential cookies only'
  }
};
```

### **Content Security Policy**
```typescript
// CSP configuration
const contentSecurityPolicy = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // For Next.js
    'https://www.googletagmanager.com',
    'https://vercel.live'
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // For Tailwind
    'https://fonts.googleapis.com'
  ],
  'font-src': [
    "'self'", 
    'https://fonts.gstatic.com'
  ],
  'img-src': [
    "'self'",
    'data:',
    'https://vercel.com'
  ],
  'connect-src': [
    "'self'",
    'https://api.airtable.com',
    'https://vitals.vercel-analytics.com'
  ]
};
```

---

## **🚚 DEPLOYMENT PIPELINE**

### **CI/CD Workflow**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'npm'
      
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check  
      - run: npm run test
      - run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
  
  deploy-preview:
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          
  deploy-production:
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest  
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### **Quality Gates**
```typescript
// Quality assurance requirements
const qualityGates = {
  preCommit: [
    'ESLint passes with 0 errors',
    'TypeScript compilation successful',
    'Prettier formatting applied',
    'Unit tests pass with 90%+ coverage'
  ],
  
  preMerge: [
    'All tests pass including E2E',
    'Bundle size within limits',
    'Lighthouse performance score >90',
    'No security vulnerabilities'
  ],
  
  preProduction: [
    'Full regression test suite passes',
    'Performance benchmarks met',
    'Accessibility audit passes',
    'Cross-browser compatibility verified'
  ]
};
```

---

## **📅 DEVELOPMENT TIMELINE**

### **Phase 1: Foundation (Days 1-3)**
```
Day 1:
- Next.js project setup with App Router
- Tailwind CSS configuration  
- Basic component structure
- TypeScript configuration

Day 2:
- Assessment question migration
- Scoring algorithm implementation
- Basic UI components (Button, Card, Input)
- Initial routing setup

Day 3:
- Question display components
- Progress tracking logic
- Local storage integration
- Basic responsive design
```

### **Phase 2: Core Features (Days 4-6)**
```
Day 4:
- Assessment flow implementation
- Question validation logic
- Progress saving functionality
- Navigation controls

Day 5:
- Airtable integration setup
- API routes implementation
- Score calculation logic
- Results display components

Day 6:
- Analytics tracking implementation
- Exit intent detection
- Social sharing components
- Error handling and validation
```

### **Phase 3: Advanced Features (Days 7-9)**
```
Day 7:
- Performance optimization
- Bundle size optimization
- Caching implementation
- Loading states and animations

Day 8:
- Mobile optimization
- Touch interactions
- Responsive design refinement
- Accessibility improvements

Day 9:
- Analytics integration
- Cohort tracking
- Conversion optimization
- Platform redirect logic
```

### **Phase 4: Testing & Deployment (Days 10-12)**
```
Day 10:
- Unit test implementation
- Integration test setup
- Performance testing
- Security audit

Day 11:
- E2E test implementation
- Cross-browser testing
- Mobile device testing
- Bug fixes and optimization

Day 12:
- Production deployment
- Domain configuration
- Analytics verification
- Go-live preparation
```

### **Phase 5: Launch & Monitoring (Days 13-14)**
```
Day 13:
- Production launch
- Real user monitoring setup
- Performance monitoring
- Error tracking verification

Day 14:
- Launch optimization
- Analytics review
- User feedback collection
- Documentation finalization
```

---

## **✅ SUCCESS CRITERIA**

### **Technical Metrics**
- **Performance**: Lighthouse score >90 on mobile and desktop
- **Bundle Size**: Initial JS <100KB, total <300KB
- **Load Time**: LCP <2.5s, FCP <1.8s, TTFB <600ms
- **Test Coverage**: >90% unit test coverage, >85% integration coverage
- **Accessibility**: WCAG 2.1 AA compliance
- **Cross-browser**: Chrome, Safari, Firefox, Edge support

### **Business Metrics**
- **Completion Rate**: >75% assessment completion rate
- **Qualification Rate**: 15-25% qualified leads from total completions
- **Platform Conversion**: >80% qualified leads sign up for platform
- **Time to Complete**: Average 8-12 minutes for full assessment
- **Mobile Usage**: Support 60%+ mobile traffic efficiently
- **Error Rate**: <1% critical errors, <5% minor errors

### **User Experience Metrics**
- **Engagement**: Low exit rate before question 7
- **Satisfaction**: Positive user feedback on assessment experience
- **Conversion**: Smooth transition to platform onboarding
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: No loading delays that impact completion

---

## **🎯 POST-LAUNCH OPTIMIZATION**

### **A/B Testing Framework**
```typescript
// Testing scenarios for optimization
const abTestScenarios = {
  questionOrder: {
    control: 'current order',
    variant: 'high-engagement questions first'
  },
  
  progressIndicator: {
    control: 'percentage based',
    variant: 'milestone based (25%, 50%, 75%)'
  },
  
  exitIntent: {
    control: 'standard modal',
    variant: 'progress-specific messaging'
  },
  
  resultsDisplay: {
    control: 'immediate scores',
    variant: 'progressive revelation'
  }
};
```

### **Continuous Improvement**
```typescript
// Optimization roadmap
const optimizationPlan = {
  week1: 'Performance monitoring and bug fixes',
  week2: 'User feedback integration and UX improvements',
  week3: 'A/B test implementation and data collection',
  week4: 'Conversion optimization based on analytics',
  
  ongoing: [
    'Question effectiveness analysis',
    'Scoring algorithm refinement',
    'Platform integration enhancement',
    'Mobile experience optimization'
  ]
};
```

---

## **📖 DOCUMENTATION REQUIREMENTS**

### **Developer Documentation**
- **Setup Guide**: Environment configuration and local development
- **Architecture Overview**: Component structure and data flow
- **API Documentation**: Endpoint specifications and response formats
- **Testing Guide**: Running tests and writing new test cases
- **Deployment Guide**: Production deployment and troubleshooting

### **User Documentation**
- **Assessment Guide**: How the assessment works and scoring methodology
- **Privacy Policy**: Data collection and usage policies
- **Accessibility Guide**: Features for users with disabilities
- **FAQ**: Common questions and technical requirements

This comprehensive codex provides the complete blueprint for rebuilding the Revenue Assessment Tool as a high-performance Next.js application optimized for technical founder acquisition and platform conversion.
/**
 * Behavioral Intelligence Hooks Index
 * 
 * Centralized export for all behavioral intelligence and progressive feature hooks
 */

// Core behavioral intelligence hooks (default exports)
export { default as useBehavioralTracking } from './useBehavioralTracking.js';
export { default as useSkillAssessment } from './useSkillAssessment.js'; 
export { default as useProgressiveFeatures } from './useProgressiveFeatures.js';

// Re-export existing hooks for compatibility
export { useWorkflowProgress } from './useWorkflowProgress.js';
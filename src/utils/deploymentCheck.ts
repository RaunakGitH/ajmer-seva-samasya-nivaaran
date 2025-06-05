
import { APP_CONFIG, ENV } from './environment';
import { logger } from './logger';

// Check if the app is properly configured for deployment
export const performDeploymentCheck = () => {
  const checks = {
    environment: ENV.isProduction,
    supabaseUrl: APP_CONFIG.supabaseUrl.includes('supabase.co'),
    siteUrl: !APP_CONFIG.siteUrl.includes('localhost'),
    hasSupabaseKey: !!APP_CONFIG.supabaseAnonKey,
  };

  const allChecksPass = Object.values(checks).every(Boolean);

  logger.info('Deployment readiness check', {
    checks,
    isReady: allChecksPass,
    environment: ENV.isProduction ? 'production' : 'development'
  });

  if (!allChecksPass) {
    logger.warn('Deployment checks failed', checks);
  }

  return {
    isReady: allChecksPass,
    checks,
    issues: Object.entries(checks)
      .filter(([_, passed]) => !passed)
      .map(([check]) => check)
  };
};

// Initialize deployment check in production
if (ENV.isProduction) {
  performDeploymentCheck();
}

/**
 * @fileoverview Security analysis utilities for checking HTTPS, headers, and forms.
 */

import { SECURITY_FETCH_TIMEOUT } from '@/constants/seo';
import type { SeoStatus } from '@/types/seo';
import { t } from '@/utils/i18nHelper';

// =============================================================================
// TYPES
// =============================================================================

/** Mixed content resource found on HTTPS page */
export interface MixedContentResource {
  type: 'script' | 'stylesheet' | 'image' | 'iframe' | 'video' | 'audio' | 'font' | 'object';
  src: string;
}

/** HTTPS analysis result */
export interface HttpsAnalysis {
  usesHttps: boolean;
  protocol: string;
  mixedContentCount: number;
  mixedContent: MixedContentResource[];
  hasUpgradeInsecureRequests: boolean;
  issues: string[];
  status: SeoStatus;
}

/** Security header analysis item */
export interface SecurityHeaderItem {
  header: string;
  present: boolean;
  value: string | null;
  severity: 'high' | 'medium' | 'low';
  recommendation?: string;
}

/** CSP analysis details */
export interface CspAnalysis {
  directivesCount: number;
  hasUnsafeInline: boolean;
  hasUnsafeEval: boolean;
  warnings: string[];
}

/** Security headers analysis result */
export interface SecurityHeadersAnalysis {
  accessible: boolean;
  corsBlocked: boolean;
  headers: SecurityHeaderItem[];
  cspAnalysis: CspAnalysis | null;
  issues: string[];
  status: SeoStatus;
}

/** Form analysis item */
export interface FormAnalysisItem {
  id: number;
  action: string;
  method: string;
  usesHttps: boolean;
  hasSensitiveData: boolean;
  passwordFieldsCount: number;
  hasCSRFProtection: boolean;
  hasCaptcha: boolean;
  issues: string[];
}

/** Forms security analysis result */
export interface FormsSecurityAnalysis {
  totalForms: number;
  formsWithHttps: number;
  formsWithCSRF: number;
  formsWithSensitiveData: number;
  criticalIssues: number;
  forms: FormAnalysisItem[];
  issues: string[];
  status: SeoStatus;
}

/** Complete security analysis result */
export interface SecurityAnalysis {
  https: HttpsAnalysis;
  headers: SecurityHeadersAnalysis;
  forms: FormsSecurityAnalysis;
  overallScore: number;
  status: SeoStatus;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SECURITY_HEADERS = [
  { name: 'Content-Security-Policy', severity: 'high' as const, weight: 30 },
  { name: 'Strict-Transport-Security', severity: 'high' as const, weight: 25 },
  { name: 'X-Frame-Options', severity: 'medium' as const, weight: 15 },
  { name: 'X-Content-Type-Options', severity: 'medium' as const, weight: 15 },
  { name: 'Referrer-Policy', severity: 'low' as const, weight: 10 },
  { name: 'Permissions-Policy', severity: 'low' as const, weight: 5 },
] as const;

const CSRF_TOKEN_NAMES = [
  '_token',
  'csrf_token',
  'csrf-token',
  'authenticity_token',
  '__RequestVerificationToken',
  '_csrf',
  'csrfmiddlewaretoken',
] as const;

// Timeout constant imported from @/constants/seo as SECURITY_FETCH_TIMEOUT

// =============================================================================
// HTTPS ANALYSIS
// =============================================================================

/**
 * Analyzes HTTPS usage and detects mixed content.
 */
export function analyzeHttps(url: string, doc: Document): HttpsAnalysis {
  let urlObj: URL;
  try {
    urlObj = new URL(url);
  } catch {
    return {
      usesHttps: false,
      protocol: 'unknown',
      mixedContentCount: 0,
      mixedContent: [],
      hasUpgradeInsecureRequests: false,
      issues: [t('seo.security.analyzers.invalidUrl')],
      status: 'error',
    };
  }

  const usesHttps = urlObj.protocol === 'https:';
  const mixedContent: MixedContentResource[] = [];

  if (usesHttps) {
    // Check scripts
    doc.querySelectorAll('script[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (src?.startsWith('http://')) {
        mixedContent.push({ type: 'script', src });
      }
    });

    // Check stylesheets
    doc.querySelectorAll('link[rel="stylesheet"][href]').forEach((el) => {
      const href = el.getAttribute('href');
      if (href?.startsWith('http://')) {
        mixedContent.push({ type: 'stylesheet', src: href });
      }
    });

    // Check images
    doc.querySelectorAll('img[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (src?.startsWith('http://')) {
        mixedContent.push({ type: 'image', src });
      }
    });

    // Check iframes
    doc.querySelectorAll('iframe[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (src?.startsWith('http://')) {
        mixedContent.push({ type: 'iframe', src });
      }
    });

    // Check videos
    doc.querySelectorAll('video source[src], video[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (src?.startsWith('http://')) {
        mixedContent.push({ type: 'video', src });
      }
    });

    // Check audio
    doc.querySelectorAll('audio source[src], audio[src]').forEach((el) => {
      const src = el.getAttribute('src');
      if (src?.startsWith('http://')) {
        mixedContent.push({ type: 'audio', src });
      }
    });

    // Check fonts and other objects
    doc.querySelectorAll('object[data]').forEach((el) => {
      const data = el.getAttribute('data');
      if (data?.startsWith('http://')) {
        mixedContent.push({ type: 'object', src: data });
      }
    });
  }

  // Check for upgrade-insecure-requests meta tag
  const hasUpgradeInsecureRequests =
    doc.querySelector(
      'meta[http-equiv="Content-Security-Policy"][content*="upgrade-insecure-requests"]',
    ) !== null;

  const issues: string[] = [];

  if (!usesHttps) {
    issues.push(t('seo.security.analyzers.notHttps'));
  }

  if (mixedContent.length > 0) {
    issues.push(t('seo.security.analyzers.mixedContent', { count: mixedContent.length }));
  }

  if (usesHttps && !hasUpgradeInsecureRequests && mixedContent.length > 0) {
    issues.push(t('seo.security.analyzers.noUpgradeInsecure'));
  }

  let status: SeoStatus = 'good';
  if (!usesHttps) {
    status = 'error';
  } else if (mixedContent.length > 0) {
    status = 'warning';
  }

  return {
    usesHttps,
    protocol: urlObj.protocol,
    mixedContentCount: mixedContent.length,
    mixedContent: mixedContent.slice(0, 10), // Limit to first 10
    hasUpgradeInsecureRequests,
    issues,
    status,
  };
}

// =============================================================================
// SECURITY HEADERS ANALYSIS
// =============================================================================

/**
 * Analyzes CSP directive in detail.
 */
function analyzeCSP(csp: string): CspAnalysis {
  const directives = csp
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean);
  const hasUnsafeInline = csp.includes("'unsafe-inline'");
  const hasUnsafeEval = csp.includes("'unsafe-eval'");

  const warnings: string[] = [];
  if (hasUnsafeInline) {
    warnings.push(t('seo.security.analyzers.cspUnsafeInline'));
  }
  if (hasUnsafeEval) {
    warnings.push(t('seo.security.analyzers.cspUnsafeEval'));
  }

  return {
    directivesCount: directives.length,
    hasUnsafeInline,
    hasUnsafeEval,
    warnings,
  };
}

/**
 * Attempts to check security headers via direct fetch.
 * Note: This will only work if the server allows CORS and exposes headers.
 */
export async function analyzeSecurityHeaders(url: string): Promise<SecurityHeadersAnalysis> {
  const headers: SecurityHeaderItem[] = SECURITY_HEADERS.map((h) => ({
    header: h.name,
    present: false,
    value: null,
    severity: h.severity,
  }));

  let accessible = false;
  let corsBlocked = false;
  let cspValue: string | null = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), SECURITY_FETCH_TIMEOUT);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Try to access each header
    headers.forEach((h) => {
      try {
        const value = response.headers.get(h.header);
        if (value) {
          h.present = true;
          h.value = value;
          accessible = true;

          if (h.header === 'Content-Security-Policy') {
            cspValue = value;
          }
        }
      } catch {
        // Header not accessible
      }
    });
  } catch {
    corsBlocked = true;
  }

  // Analyze CSP outside the forEach to fix TypeScript control flow
  const cspAnalysisResult: CspAnalysis | null = cspValue ? analyzeCSP(cspValue) : null;

  // Add recommendations for missing headers
  headers.forEach((h) => {
    if (!h.present) {
      switch (h.header) {
        case 'Content-Security-Policy':
          h.recommendation = t('seo.security.analyzers.recommendCsp');
          break;
        case 'Strict-Transport-Security':
          h.recommendation = t('seo.security.analyzers.recommendHsts');
          break;
        case 'X-Frame-Options':
          h.recommendation = t('seo.security.analyzers.recommendXFrameOptions');
          break;
        case 'X-Content-Type-Options':
          h.recommendation = t('seo.security.analyzers.recommendXContentType');
          break;
        case 'Referrer-Policy':
          h.recommendation = t('seo.security.analyzers.recommendReferrerPolicy');
          break;
        case 'Permissions-Policy':
          h.recommendation = t('seo.security.analyzers.recommendPermissionsPolicy');
          break;
      }
    }
  });

  const issues: string[] = [];
  if (corsBlocked) {
    issues.push(t('seo.security.analyzers.corsBlocked'));
  } else {
    const missingHigh = headers.filter((h) => !h.present && h.severity === 'high');
    const missingMedium = headers.filter((h) => !h.present && h.severity === 'medium');

    if (missingHigh.length > 0) {
      issues.push(
        t('seo.security.analyzers.criticalHeadersMissing', { count: missingHigh.length }),
      );
    }
    if (missingMedium.length > 0) {
      issues.push(
        t('seo.security.analyzers.recommendedHeadersMissing', { count: missingMedium.length }),
      );
    }
  }

  if (cspAnalysisResult !== null && cspAnalysisResult.warnings.length > 0) {
    issues.push(...cspAnalysisResult.warnings);
  }

  let status: SeoStatus = 'info';
  if (!corsBlocked) {
    const presentCount = headers.filter((h) => h.present).length;
    const highPresent = headers.filter((h) => h.present && h.severity === 'high').length;
    const highTotal = headers.filter((h) => h.severity === 'high').length;

    if (highPresent === highTotal && presentCount >= 4) {
      status = 'good';
    } else if (highPresent > 0 || presentCount >= 2) {
      status = 'warning';
    } else {
      status = 'error';
    }
  }

  return {
    accessible,
    corsBlocked,
    headers,
    cspAnalysis: cspAnalysisResult,
    issues,
    status,
  };
}

// =============================================================================
// FORM SECURITY ANALYSIS
// =============================================================================

/**
 * Analyzes form security on the page.
 */
export function analyzeFormSecurity(url: string, doc: Document): FormsSecurityAnalysis {
  const forms = Array.from(doc.querySelectorAll('form'));
  let urlObj: URL;

  try {
    urlObj = new URL(url);
  } catch {
    return {
      totalForms: 0,
      formsWithHttps: 0,
      formsWithCSRF: 0,
      formsWithSensitiveData: 0,
      criticalIssues: 0,
      forms: [],
      issues: [t('seo.security.analyzers.invalidUrl')],
      status: 'error',
    };
  }

  const pageUsesHttps = urlObj.protocol === 'https:';

  const formAnalysis: FormAnalysisItem[] = forms.map((form, index) => {
    const action = form.getAttribute('action') || url;
    const method = (form.getAttribute('method') || 'GET').toUpperCase();

    let actionUrl: string;
    try {
      actionUrl = action.startsWith('http') ? action : new URL(action, url).href;
    } catch {
      actionUrl = action;
    }

    const usesHttps = actionUrl.startsWith('https://') || actionUrl.startsWith('/');

    // Check for sensitive fields
    const passwordFields = form.querySelectorAll('input[type="password"]');
    const creditCardFields = form.querySelectorAll(
      'input[name*="card"], input[name*="cvv"], input[name*="ccv"], input[autocomplete*="cc-"]',
    );

    const hasSensitiveData = passwordFields.length > 0 || creditCardFields.length > 0;

    // Check for CSRF protection
    const csrfSelector = CSRF_TOKEN_NAMES.map((name) => `input[name="${name}"]`).join(', ');
    const hasCSRFProtection = form.querySelector(csrfSelector) !== null;

    // Check for CAPTCHA
    const hasCaptcha =
      form.querySelector(
        '[class*="recaptcha"], [class*="g-recaptcha"], [class*="h-captcha"], [class*="cf-turnstile"]',
      ) !== null;

    const issues: string[] = [];

    if (!usesHttps && hasSensitiveData) {
      issues.push(t('seo.security.analyzers.formCriticalSensitive'));
    } else if (!usesHttps && !pageUsesHttps) {
      issues.push(t('seo.security.analyzers.formActionNoHttps'));
    }

    if (method === 'POST' && !hasCSRFProtection) {
      issues.push(t('seo.security.analyzers.formMissingCsrf'));
    }

    if (hasSensitiveData && !hasCaptcha) {
      issues.push(t('seo.security.analyzers.formNoCaptcha'));
    }

    // Check password field autocomplete
    passwordFields.forEach((field) => {
      const autocomplete = field.getAttribute('autocomplete');
      if (!autocomplete || autocomplete === 'on') {
        issues.push(t('seo.security.analyzers.passwordNoAutocomplete'));
      }
    });

    return {
      id: index + 1,
      action: actionUrl,
      method,
      usesHttps,
      hasSensitiveData,
      passwordFieldsCount: passwordFields.length,
      hasCSRFProtection,
      hasCaptcha,
      issues,
    };
  });

  const criticalIssues = formAnalysis.filter((f) => !f.usesHttps && f.hasSensitiveData).length;

  const allIssues: string[] = [];
  if (criticalIssues > 0) {
    allIssues.push(t('seo.security.analyzers.formsCriticalCount', { count: criticalIssues }));
  }

  const formsWithoutCSRF = formAnalysis.filter(
    (f) => f.method === 'POST' && !f.hasCSRFProtection,
  ).length;
  if (formsWithoutCSRF > 0) {
    allIssues.push(t('seo.security.analyzers.formsNoCsrfCount', { count: formsWithoutCSRF }));
  }

  let status: SeoStatus = 'good';
  if (criticalIssues > 0) {
    status = 'error';
  } else if (formAnalysis.some((f) => f.issues.length > 0)) {
    status = 'warning';
  } else if (forms.length === 0) {
    status = 'info';
  }

  return {
    totalForms: forms.length,
    formsWithHttps: formAnalysis.filter((f) => f.usesHttps).length,
    formsWithCSRF: formAnalysis.filter((f) => f.hasCSRFProtection).length,
    formsWithSensitiveData: formAnalysis.filter((f) => f.hasSensitiveData).length,
    criticalIssues,
    forms: formAnalysis,
    issues: allIssues,
    status,
  };
}

// =============================================================================
// MAIN ANALYSIS FUNCTION
// =============================================================================

/**
 * Performs complete security analysis.
 */
export async function analyzeSecurityFull(url: string, doc: Document): Promise<SecurityAnalysis> {
  // Run all analyses
  const https = analyzeHttps(url, doc);
  const headers = await analyzeSecurityHeaders(url);
  const forms = analyzeFormSecurity(url, doc);

  // Calculate overall score
  const weights = {
    https: 0.4,
    headers: 0.3,
    forms: 0.3,
  };

  // Score calculations
  const httpsScore = https.usesHttps ? (https.mixedContentCount === 0 ? 100 : 70) : 0;

  const headersScore = headers.corsBlocked
    ? 50 // Unknown, assume middle ground
    : headers.headers.reduce((sum, h) => {
        const headerDef = SECURITY_HEADERS.find((sh) => sh.name === h.header);
        return sum + (h.present ? (headerDef?.weight ?? 0) : 0);
      }, 0);

  const formsScore =
    forms.totalForms === 0
      ? 100
      : Math.round(
          (forms.formsWithHttps / forms.totalForms) * 50 +
            (forms.formsWithCSRF /
              Math.max(1, forms.forms.filter((f) => f.method === 'POST').length)) *
              30 +
            (forms.criticalIssues === 0 ? 20 : 0),
        );

  const overallScore = Math.round(
    httpsScore * weights.https + headersScore * weights.headers + formsScore * weights.forms,
  );

  let status: SeoStatus = 'good';
  if (overallScore < 50 || https.status === 'error' || forms.status === 'error') {
    status = 'error';
  } else if (overallScore < 80 || https.status === 'warning' || forms.status === 'warning') {
    status = 'warning';
  }

  return {
    https,
    headers,
    forms,
    overallScore,
    status,
  };
}

<script setup lang="ts">
import { computed } from 'vue';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  FileText,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { SecurityAnalysis } from '@/utils/securityAnalysis';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  security: SecurityAnalysis;
}>();

const { t } = useI18n();

const scoreColor = computed(() => {
  if (props.security.overallScore >= 80) {
    return 'text-green-600 dark:text-green-400';
  }
  if (props.security.overallScore >= 60) {
    return 'text-amber-600 dark:text-amber-400';
  }
  return 'text-red-600 dark:text-red-400';
});

const allIssues = computed(() => {
  const issues: string[] = [];
  issues.push(...props.security.https.issues);
  issues.push(...props.security.headers.issues);
  issues.push(...props.security.forms.issues);
  return issues;
});

function getSeverityClass(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high':
      return 'text-red-600 dark:text-red-400';
    case 'medium':
      return 'text-amber-600 dark:text-amber-400';
    case 'low':
      return 'text-blue-600 dark:text-blue-400';
  }
}

function getSeverityLabel(severity: 'high' | 'medium' | 'low'): string {
  switch (severity) {
    case 'high':
      return t('seo.security.headers.critical');
    case 'medium':
      return t('seo.security.headers.recommended');
    case 'low':
      return t('seo.security.headers.optional');
  }
}
</script>

<template>
  <AnalysisSection :title="t('seo.security.title')" :status="security.status">
    <div class="space-y-4">
      <!-- Score -->
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <component
            :is="
              security.overallScore >= 80
                ? ShieldCheck
                : security.overallScore >= 60
                  ? Shield
                  : ShieldAlert
            "
            :class="['h-8 w-8', scoreColor]"
            aria-hidden="true"
          />
          <div>
            <p :class="['text-2xl font-bold', scoreColor]">{{ security.overallScore }}</p>
            <p class="text-xs text-muted">{{ t('seo.security.score') }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- HTTPS Analysis -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <component
              :is="security.https.usesHttps ? Lock : Unlock"
              :class="['h-4 w-4', security.https.usesHttps ? 'text-green-500' : 'text-red-500']"
              aria-hidden="true"
            />
            <span class="font-medium text-sm">{{ t('seo.security.https.title') }}</span>
            <span
              :class="[
                'ml-auto text-xs px-2 py-0.5 rounded',
                security.https.usesHttps
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400',
              ]"
            >
              {{
                security.https.usesHttps
                  ? t('seo.security.https.secure')
                  : t('seo.security.https.notSecure')
              }}
            </span>
          </div>

          <div class="space-y-2 text-xs">
            <!-- Mixed Content -->
            <div class="flex items-center justify-between">
              <span class="text-muted">{{ t('seo.security.https.mixedContent') }}</span>
              <span
                :class="
                  security.https.mixedContentCount === 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-amber-600 dark:text-amber-400'
                "
              >
                {{
                  security.https.mixedContentCount === 0
                    ? t('seo.security.https.noMixedContent')
                    : t('seo.security.https.mixedContentFound', {
                        count: security.https.mixedContentCount,
                      })
                }}
              </span>
            </div>

            <!-- Upgrade Insecure Requests -->
            <div v-if="security.https.usesHttps" class="flex items-center justify-between">
              <span class="text-muted">{{ t('seo.security.https.upgradeInsecure') }}</span>
              <span
                :class="
                  security.https.hasUpgradeInsecureRequests
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-muted'
                "
              >
                {{
                  security.https.hasUpgradeInsecureRequests
                    ? t('seo.security.https.present')
                    : t('seo.security.https.missing')
                }}
              </span>
            </div>

            <!-- Mixed Content List -->
            <div
              v-if="security.https.mixedContent.length > 0"
              class="mt-2 p-2 rounded bg-amber-500/5 border border-amber-500/20"
            >
              <p
                v-for="(item, index) in security.https.mixedContent.slice(0, 3)"
                :key="index"
                class="text-amber-700 dark:text-amber-300 truncate"
                :title="item.src"
              >
                {{ item.type }}: {{ item.src }}
              </p>
              <p v-if="security.https.mixedContent.length > 3" class="text-muted mt-1">
                +{{ security.https.mixedContent.length - 3 }} {{ t('common.more') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Security Headers -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <Shield class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.security.headers.title') }}</span>
          </div>

          <div v-if="security.headers.corsBlocked" class="text-xs space-y-2">
            <div class="flex items-start gap-2 p-2 rounded bg-blue-500/5 border border-blue-500/20">
              <Info class="h-3.5 w-3.5 text-blue-500 mt-0.5 shrink-0" aria-hidden="true" />
              <div>
                <p class="text-blue-700 dark:text-blue-300">
                  {{ t('seo.security.headers.corsBlocked') }}
                </p>
                <p class="text-muted mt-1">{{ t('seo.security.headers.corsNote') }}</p>
              </div>
            </div>
          </div>

          <div v-else class="space-y-1.5 text-xs">
            <div
              v-for="header in security.headers.headers"
              :key="header.header"
              class="flex items-center gap-2"
            >
              <component
                :is="header.present ? CheckCircle : XCircle"
                :class="[
                  'h-3.5 w-3.5 shrink-0',
                  header.present ? 'text-green-500' : getSeverityClass(header.severity),
                ]"
                aria-hidden="true"
              />
              <span class="text-body truncate flex-1" :title="header.header">{{
                header.header
              }}</span>
              <span v-if="!header.present" :class="['text-xs', getSeverityClass(header.severity)]">
                {{ getSeverityLabel(header.severity) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Form Security -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <FileText class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.security.forms.title') }}</span>
            <span class="ml-auto text-xs text-muted">{{ security.forms.totalForms }}</span>
          </div>

          <div v-if="security.forms.totalForms === 0" class="text-xs text-muted">
            {{ t('seo.security.forms.noForms') }}
          </div>

          <div v-else class="space-y-2 text-xs">
            <div class="grid grid-cols-2 gap-2">
              <div class="flex items-center justify-between">
                <span class="text-muted">{{ t('seo.security.forms.withHttps') }}</span>
                <span
                  :class="
                    security.forms.formsWithHttps === security.forms.totalForms
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-amber-600 dark:text-amber-400'
                  "
                >
                  {{ security.forms.formsWithHttps }}/{{ security.forms.totalForms }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-muted">{{ t('seo.security.forms.withCSRF') }}</span>
                <span class="text-body"
                  >{{ security.forms.formsWithCSRF }}/{{ security.forms.totalForms }}</span
                >
              </div>
            </div>

            <div
              v-if="security.forms.criticalIssues > 0"
              class="flex items-center gap-2 p-2 rounded bg-red-500/10"
            >
              <AlertTriangle class="h-3.5 w-3.5 text-red-500 shrink-0" aria-hidden="true" />
              <span class="text-red-600 dark:text-red-400">
                {{ security.forms.criticalIssues }}
                {{ t('seo.security.forms.criticalIssues').toLowerCase() }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- All Issues -->
      <div
        v-if="allIssues.length > 0"
        class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
      >
        <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
          <AlertTriangle class="h-4 w-4" aria-hidden="true" />
          <span class="font-medium text-sm">{{ t('seo.security.issues') }}</span>
        </div>
        <ul class="space-y-1">
          <li
            v-for="(issue, index) in allIssues"
            :key="index"
            class="text-xs text-amber-700 dark:text-amber-300 pl-6"
          >
            • {{ issue }}
          </li>
        </ul>
      </div>

      <p class="text-xs text-muted">{{ t('seo.security.description') }}</p>
    </div>
  </AnalysisSection>
</template>

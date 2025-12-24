<script setup lang="ts">
import { ref } from 'vue';
import {
  FileText,
  Map,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Bot,
  Clock,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { RobotsTxtAnalysis, SitemapAnalysis } from '@/utils/robotsParser';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  robotsTxt: RobotsTxtAnalysis;
  sitemap: SitemapAnalysis;
}>();

const { t } = useI18n();

const showRobotsContent = ref(false);

const combinedStatus = (() => {
  if (props.robotsTxt.status === 'error' || props.sitemap.status === 'error') {
    return 'error';
  }
  if (props.robotsTxt.status === 'warning' || props.sitemap.status === 'warning') {
    return 'warning';
  }
  if (props.robotsTxt.found && props.sitemap.found) {
    return 'good';
  }
  return 'info';
})();

const allIssues = [...props.robotsTxt.issues, ...props.sitemap.issues];
</script>

<template>
  <AnalysisSection :title="t('seo.robotsTxt.title')" :status="combinedStatus">
    <div class="space-y-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- Robots.txt Status -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <FileText class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.robotsTxt.robotsFile') }}</span>
            <span
              :class="[
                'ml-auto flex items-center gap-1 text-xs',
                robotsTxt.found
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400',
              ]"
            >
              <CheckCircle v-if="robotsTxt.found" class="h-3.5 w-3.5" aria-hidden="true" />
              <XCircle v-else class="h-3.5 w-3.5" aria-hidden="true" />
              {{ robotsTxt.found ? t('seo.robotsTxt.found') : t('seo.robotsTxt.notFound') }}
            </span>
          </div>

          <div v-if="robotsTxt.found" class="space-y-2">
            <!-- User Agents -->
            <div v-if="robotsTxt.userAgents.length > 0" class="flex items-start gap-2">
              <Bot class="h-3.5 w-3.5 text-muted mt-0.5 shrink-0" aria-hidden="true" />
              <div class="text-xs">
                <span class="text-muted">{{ t('seo.robotsTxt.userAgents') }}:</span>
                <span class="ml-1 text-body">{{ robotsTxt.userAgents.join(', ') }}</span>
              </div>
            </div>

            <!-- Crawl Delay -->
            <div v-if="robotsTxt.crawlDelay !== null" class="flex items-center gap-2">
              <Clock class="h-3.5 w-3.5 text-muted shrink-0" aria-hidden="true" />
              <span class="text-xs text-muted">{{ t('seo.robotsTxt.crawlDelay') }}:</span>
              <span class="text-xs text-body">
                {{ robotsTxt.crawlDelay }} {{ t('seo.robotsTxt.seconds') }}
              </span>
            </div>

            <!-- Directives Summary -->
            <div class="flex flex-wrap gap-2 mt-2">
              <span
                v-if="robotsTxt.allowedPaths.length > 0"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-green-500/10 text-green-600 dark:text-green-400"
              >
                {{ t('seo.robotsTxt.allowed') }}: {{ robotsTxt.allowedPaths.length }}
              </span>
              <span
                v-if="robotsTxt.disallowedPaths.length > 0"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-red-500/10 text-red-600 dark:text-red-400"
              >
                {{ t('seo.robotsTxt.disallowed') }}: {{ robotsTxt.disallowedPaths.length }}
              </span>
            </div>

            <!-- View Content Toggle -->
            <button
              v-if="robotsTxt.content"
              type="button"
              class="flex items-center gap-1 text-xs text-accent hover:underline mt-2"
              @click="showRobotsContent = !showRobotsContent"
            >
              <component :is="showRobotsContent ? ChevronUp : ChevronDown" class="h-3.5 w-3.5" />
              {{ t('seo.robotsTxt.viewContent') }}
            </button>

            <!-- Robots Content -->
            <div
              v-if="showRobotsContent && robotsTxt.content"
              class="mt-2 p-2 rounded bg-surface-hover text-xs font-mono overflow-x-auto max-h-48 overflow-y-auto"
            >
              <pre class="whitespace-pre-wrap text-muted">{{ robotsTxt.content }}</pre>
            </div>
          </div>
        </div>

        <!-- Sitemap Status -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <Map class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.robotsTxt.sitemap') }}</span>
            <span
              :class="[
                'ml-auto flex items-center gap-1 text-xs',
                sitemap.found
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-amber-600 dark:text-amber-400',
              ]"
            >
              <CheckCircle v-if="sitemap.found" class="h-3.5 w-3.5" aria-hidden="true" />
              <XCircle v-else class="h-3.5 w-3.5" aria-hidden="true" />
              {{ sitemap.found ? t('seo.robotsTxt.found') : t('seo.robotsTxt.notFound') }}
            </span>
          </div>

          <!-- Sitemaps List -->
          <div v-if="sitemap.sitemaps.length > 0" class="space-y-2">
            <div
              v-for="(sm, index) in sitemap.sitemaps"
              :key="index"
              class="flex items-start gap-2"
            >
              <component
                :is="sm.found ? CheckCircle : XCircle"
                :class="[
                  'h-3.5 w-3.5 mt-0.5 shrink-0',
                  sm.found ? 'text-green-500' : 'text-red-500',
                ]"
                aria-hidden="true"
              />
              <div class="text-xs min-w-0 flex-1">
                <p class="text-body truncate" :title="sm.url">{{ sm.url }}</p>
                <div class="flex items-center gap-2 text-muted">
                  <span v-if="sm.found && sm.type === 'index'">
                    {{ t('seo.robotsTxt.sitemapIndex') }}
                  </span>
                  <span v-else-if="sm.found && sm.type === 'xml'">
                    {{ t('seo.robotsTxt.xmlSitemap') }}
                  </span>
                  <span class="text-muted/60">•</span>
                  <span>
                    {{
                      sm.source === 'robots.txt'
                        ? t('seo.robotsTxt.fromRobots')
                        : t('seo.robotsTxt.defaultLocation')
                    }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.robotsTxt.notFound') }}</p>
        </div>
      </div>

      <!-- Issues -->
      <div
        v-if="allIssues.length > 0"
        class="p-3 rounded-lg bg-amber-500/5 border border-amber-500/20"
      >
        <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
          <AlertTriangle class="h-4 w-4" aria-hidden="true" />
          <span class="font-medium text-sm">{{ t('seo.robotsTxt.issues') }}</span>
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

      <p class="text-xs text-muted">{{ t('seo.robotsTxt.description') }}</p>
    </div>
  </AnalysisSection>
</template>

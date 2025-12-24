<script setup lang="ts">
import { BarChart3, Code2, Share2, CheckCircle, XCircle } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SocialAnalyticsAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  socialAnalytics: SocialAnalyticsAnalysis;
}>();

const { t } = useI18n();

const analyticsTools = computed(() => [
  {
    key: 'googleAnalytics',
    label: 'Google Analytics',
    active: props.socialAnalytics.analytics.googleAnalytics,
  },
  {
    key: 'googleTagManager',
    label: 'Google Tag Manager',
    active: props.socialAnalytics.analytics.googleTagManager,
  },
  {
    key: 'facebookPixel',
    label: 'Facebook Pixel',
    active: props.socialAnalytics.analytics.facebookPixel,
  },
  { key: 'hotjar', label: 'Hotjar', active: props.socialAnalytics.analytics.hotjar },
]);

const frameworks = computed(() => [
  { key: 'react', label: 'React', active: props.socialAnalytics.frameworks.react },
  { key: 'vue', label: 'Vue.js', active: props.socialAnalytics.frameworks.vue },
  { key: 'angular', label: 'Angular', active: props.socialAnalytics.frameworks.angular },
  { key: 'svelte', label: 'Svelte', active: props.socialAnalytics.frameworks.svelte },
  { key: 'nextjs', label: 'Next.js', active: props.socialAnalytics.frameworks.nextjs },
  { key: 'nuxt', label: 'Nuxt', active: props.socialAnalytics.frameworks.nuxt },
  { key: 'jquery', label: 'jQuery', active: props.socialAnalytics.frameworks.jquery },
]);

const detectedFrameworks = computed(() => frameworks.value.filter((f) => f.active));
</script>

<template>
  <AnalysisSection :title="t('seo.socialAnalytics.title')" :status="socialAnalytics.status">
    <div class="space-y-6">
      <!-- Analytics Tools -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <BarChart3 class="h-4 w-4 text-accent" aria-hidden="true" />
          <h4 class="font-medium text-body text-sm">{{ t('seo.socialAnalytics.analytics') }}</h4>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div
            v-for="tool in analyticsTools"
            :key="tool.key"
            class="flex items-center gap-2 p-2 rounded-lg bg-surface"
          >
            <CheckCircle
              v-if="tool.active"
              class="h-4 w-4 text-green-500 shrink-0"
              aria-hidden="true"
            />
            <XCircle v-else class="h-4 w-4 text-muted shrink-0" aria-hidden="true" />
            <span :class="['text-xs', tool.active ? 'text-body' : 'text-muted']">
              {{ tool.label }}
            </span>
          </div>
        </div>
        <div v-if="socialAnalytics.analytics.other.length > 0" class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="other in socialAnalytics.analytics.other"
            :key="other"
            class="px-2 py-1 text-xs rounded bg-accent/10 text-accent"
          >
            {{ other }}
          </span>
        </div>
      </div>

      <!-- Frameworks -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Code2 class="h-4 w-4 text-accent" aria-hidden="true" />
          <h4 class="font-medium text-body text-sm">{{ t('seo.socialAnalytics.frameworks') }}</h4>
        </div>
        <div v-if="detectedFrameworks.length > 0" class="flex flex-wrap gap-2">
          <span
            v-for="framework in detectedFrameworks"
            :key="framework.key"
            class="px-3 py-1 text-xs rounded-full bg-accent/10 text-accent font-medium"
          >
            {{ framework.label }}
          </span>
        </div>
        <p v-else class="text-xs text-muted">{{ t('seo.socialAnalytics.noFrameworks') }}</p>
      </div>

      <!-- Social Links -->
      <div>
        <div class="flex items-center gap-2 mb-3">
          <Share2 class="h-4 w-4 text-accent" aria-hidden="true" />
          <h4 class="font-medium text-body text-sm">{{ t('seo.socialAnalytics.socialLinks') }}</h4>
          <span class="ml-auto text-xs text-muted">{{ socialAnalytics.socialLinks.length }}</span>
        </div>
        <div v-if="socialAnalytics.socialLinks.length > 0" class="space-y-1">
          <a
            v-for="(link, index) in socialAnalytics.socialLinks.slice(0, 5)"
            :key="index"
            :href="link"
            target="_blank"
            rel="noopener noreferrer"
            class="block text-xs text-accent hover:underline truncate"
          >
            {{ link }}
          </a>
          <p v-if="socialAnalytics.socialLinks.length > 5" class="text-xs text-muted">
            +{{ socialAnalytics.socialLinks.length - 5 }} {{ t('common.more') }}
          </p>
        </div>
        <p v-else class="text-xs text-muted">{{ t('seo.socialAnalytics.noSocialLinks') }}</p>
      </div>
    </div>
  </AnalysisSection>
</template>

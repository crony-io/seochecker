<script setup lang="ts">
import { CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SeoAnalysisResult, SeoStatus } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  result: SeoAnalysisResult;
}>();

const { t } = useI18n();

interface ChecklistItem {
  id: string;
  label: string;
  status: SeoStatus;
  priority: 'critical' | 'important' | 'optional';
  details?: string;
}

const checklistItems = computed<ChecklistItem[]>(() => {
  const items: ChecklistItem[] = [];

  // Critical items
  items.push({
    id: 'title',
    label: 'Page has a title tag',
    status: props.result.meta.title.value ? 'good' : 'error',
    priority: 'critical',
    details: props.result.meta.title.value
      ? `${props.result.meta.title.length} characters`
      : 'Missing title tag',
  });

  items.push({
    id: 'title-length',
    label: 'Title length is optimal (30-60 chars)',
    status: props.result.meta.title.status,
    priority: 'critical',
    details: `${props.result.meta.title.length} characters`,
  });

  items.push({
    id: 'description',
    label: 'Page has a meta description',
    status: props.result.meta.description.value ? 'good' : 'error',
    priority: 'critical',
    details: props.result.meta.description.value
      ? `${props.result.meta.description.length} characters`
      : 'Missing meta description',
  });

  items.push({
    id: 'h1',
    label: 'Page has exactly one H1 tag',
    status: props.result.headings.h1Count === 1 ? 'good' : 'error',
    priority: 'critical',
    details: `${props.result.headings.h1Count} H1 tag(s) found`,
  });

  items.push({
    id: 'viewport',
    label: 'Viewport meta tag is set',
    status: props.result.technical.hasViewport ? 'good' : 'error',
    priority: 'critical',
  });

  // Important items
  items.push({
    id: 'description-length',
    label: 'Description length is optimal (120-160 chars)',
    status: props.result.meta.description.status,
    priority: 'important',
    details: `${props.result.meta.description.length} characters`,
  });

  items.push({
    id: 'canonical',
    label: 'Canonical URL is set',
    status: props.result.technical.hasCanonical ? 'good' : 'warning',
    priority: 'important',
  });

  items.push({
    id: 'heading-hierarchy',
    label: 'Heading hierarchy is proper',
    status: props.result.headings.hasProperHierarchy ? 'good' : 'warning',
    priority: 'important',
    details: props.result.headings.hasProperHierarchy ? 'No gaps detected' : 'Hierarchy has gaps',
  });

  items.push({
    id: 'images-alt',
    label: 'All images have alt attributes',
    status: props.result.images.withoutAlt === 0 ? 'good' : 'warning',
    priority: 'important',
    details: `${props.result.images.withoutAlt} image(s) missing alt`,
  });

  items.push({
    id: 'https',
    label: 'Page uses HTTPS',
    status: props.result.technical.isHttps ? 'good' : 'error',
    priority: 'important',
  });

  items.push({
    id: 'og-tags',
    label: 'Open Graph tags are set',
    status: props.result.meta.openGraph.status,
    priority: 'important',
  });

  // Optional items
  items.push({
    id: 'twitter-cards',
    label: 'Twitter Card tags are set',
    status: props.result.meta.twitterCard.status,
    priority: 'optional',
  });

  items.push({
    id: 'language',
    label: 'HTML lang attribute is set',
    status: props.result.technical.hasLanguage ? 'good' : 'info',
    priority: 'optional',
  });

  items.push({
    id: 'favicon',
    label: 'Favicon is present',
    status: props.result.technical.hasFavicon ? 'good' : 'info',
    priority: 'optional',
  });

  items.push({
    id: 'content-length',
    label: 'Content has sufficient length (300+ words)',
    status: props.result.content.wordCount >= 300 ? 'good' : 'warning',
    priority: 'optional',
    details: `${props.result.content.wordCount} words`,
  });

  items.push({
    id: 'lazy-loading',
    label: 'Images use lazy loading',
    status:
      props.result.images.total === 0 ||
      props.result.images.withLazyLoading / props.result.images.total > 0.5
        ? 'good'
        : 'info',
    priority: 'optional',
    details: `${props.result.images.withLazyLoading}/${props.result.images.total} images`,
  });

  return items;
});

const criticalItems = computed(() =>
  checklistItems.value.filter((item) => item.priority === 'critical'),
);
const importantItems = computed(() =>
  checklistItems.value.filter((item) => item.priority === 'important'),
);
const optionalItems = computed(() =>
  checklistItems.value.filter((item) => item.priority === 'optional'),
);

const completedCount = computed(
  () => checklistItems.value.filter((item) => item.status === 'good').length,
);
const totalCount = computed(() => checklistItems.value.length);

const overallStatus = computed<SeoStatus>(() => {
  const criticalFailed = criticalItems.value.filter((item) => item.status === 'error').length;
  if (criticalFailed > 0) {
    return 'error';
  }
  if (completedCount.value / totalCount.value >= 0.8) {
    return 'good';
  }
  return 'warning';
});

function getStatusIcon(status: SeoStatus) {
  switch (status) {
    case 'good':
      return CheckCircle;
    case 'warning':
      return AlertTriangle;
    case 'error':
      return AlertCircle;
    default:
      return Info;
  }
}

function getStatusColor(status: SeoStatus): string {
  switch (status) {
    case 'good':
      return 'text-green-500';
    case 'warning':
      return 'text-yellow-500';
    case 'error':
      return 'text-red-500';
    default:
      return 'text-blue-500';
  }
}
</script>

<template>
  <AnalysisSection :title="t('seo.checklist.title')" :status="overallStatus">
    <div class="space-y-6">
      <!-- Summary -->
      <div class="flex items-center gap-4 text-sm">
        <span class="text-body font-medium">
          {{ completedCount }}/{{ totalCount }} {{ t('seo.checklist.completed') }}
        </span>
        <div class="flex-1 h-2 bg-surface rounded-full overflow-hidden">
          <div
            class="h-full bg-green-500 transition-all duration-500"
            :style="{ width: `${(completedCount / totalCount) * 100}%` }"
          />
        </div>
      </div>

      <!-- Critical items -->
      <div>
        <h4
          class="text-sm font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center gap-2"
        >
          <AlertCircle class="h-4 w-4" aria-hidden="true" />
          {{ t('seo.checklist.critical') }}
        </h4>
        <div class="space-y-2">
          <div
            v-for="item in criticalItems"
            :key="item.id"
            class="flex items-start gap-3 p-2 rounded-lg bg-surface"
          >
            <component
              :is="getStatusIcon(item.status)"
              :class="['h-5 w-5 shrink-0 mt-0.5', getStatusColor(item.status)]"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-body">{{ item.label }}</p>
              <p v-if="item.details" class="text-xs text-muted">{{ item.details }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Important items -->
      <div>
        <h4
          class="text-sm font-semibold text-yellow-600 dark:text-yellow-400 mb-3 flex items-center gap-2"
        >
          <AlertTriangle class="h-4 w-4" aria-hidden="true" />
          {{ t('seo.checklist.important') }}
        </h4>
        <div class="space-y-2">
          <div
            v-for="item in importantItems"
            :key="item.id"
            class="flex items-start gap-3 p-2 rounded-lg bg-surface"
          >
            <component
              :is="getStatusIcon(item.status)"
              :class="['h-5 w-5 shrink-0 mt-0.5', getStatusColor(item.status)]"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-body">{{ item.label }}</p>
              <p v-if="item.details" class="text-xs text-muted">{{ item.details }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Optional items -->
      <div>
        <h4
          class="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"
        >
          <Info class="h-4 w-4" aria-hidden="true" />
          {{ t('seo.checklist.optional') }}
        </h4>
        <div class="space-y-2">
          <div
            v-for="item in optionalItems"
            :key="item.id"
            class="flex items-start gap-3 p-2 rounded-lg bg-surface"
          >
            <component
              :is="getStatusIcon(item.status)"
              :class="['h-5 w-5 shrink-0 mt-0.5', getStatusColor(item.status)]"
              aria-hidden="true"
            />
            <div class="flex-1 min-w-0">
              <p class="text-sm text-body">{{ item.label }}</p>
              <p v-if="item.details" class="text-xs text-muted">{{ item.details }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AnalysisSection>
</template>

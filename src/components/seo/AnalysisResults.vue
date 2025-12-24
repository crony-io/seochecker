<script setup lang="ts">
import { RotateCcw, ExternalLink, Clock } from 'lucide-vue-next';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import AnchorTextCard from '@/components/seo/AnchorTextCard.vue';
import ContentAnalysisCard from '@/components/seo/ContentAnalysisCard.vue';
import ExportCard from '@/components/seo/ExportCard.vue';
import HeadingsTree from '@/components/seo/HeadingsTree.vue';
import ImagesAnalysisCard from '@/components/seo/ImagesAnalysisCard.vue';
import KeywordsCard from '@/components/seo/KeywordsCard.vue';
import LinksAnalysisCard from '@/components/seo/LinksAnalysisCard.vue';
import MetaAnalysisCard from '@/components/seo/MetaAnalysisCard.vue';
import MobileAnalysisCard from '@/components/seo/MobileAnalysisCard.vue';
import PerformanceCard from '@/components/seo/PerformanceCard.vue';
import PreviewsCard from '@/components/seo/PreviewsCard.vue';
import ReadingLevelCard from '@/components/seo/ReadingLevelCard.vue';
import ResourceHintsCard from '@/components/seo/ResourceHintsCard.vue';
import RobotsSitemapCard from '@/components/seo/RobotsSitemapCard.vue';
import SecurityAnalysisCard from '@/components/seo/SecurityAnalysisCard.vue';
import UrlAnalysisCard from '@/components/seo/UrlAnalysisCard.vue';
import EmbeddedContentCard from '@/components/seo/EmbeddedContentCard.vue';
import SchemaPreviewCard from '@/components/seo/SchemaPreviewCard.vue';
import ScoreCard from '@/components/seo/ScoreCard.vue';
import SeoChecklist from '@/components/seo/SeoChecklist.vue';
import SocialAnalyticsCard from '@/components/seo/SocialAnalyticsCard.vue';
import TechnicalAnalysisCard from '@/components/seo/TechnicalAnalysisCard.vue';
import ResourceOptimizationCard from '@/components/seo/ResourceOptimizationCard.vue';
import RenderingCard from '@/components/seo/RenderingCard.vue';
import LazyContentCard from '@/components/seo/LazyContentCard.vue';
import SocialShareCard from '@/components/seo/SocialShareCard.vue';
import AccessibilityCard from '@/components/seo/AccessibilityCard.vue';
import CoreWebVitalsCard from '@/components/seo/CoreWebVitalsCard.vue';
import { useSeoStore } from '@/stores/seo';

const { t } = useI18n();
const seoStore = useSeoStore();
const {
  result,
  robotsTxt,
  sitemap,
  security,
  urlAnalysis,
  embeddedContent,
  isLoadingRobots,
  isLoadingSecurity,
} = storeToRefs(seoStore);

const analyzedDate = computed(() => {
  if (!result.value) {
    return '';
  }
  return new Date(result.value.analyzedAt).toLocaleString();
});

const fetchDuration = computed(() => {
  if (!result.value) {
    return '';
  }
  return `${Math.round(result.value.fetchDuration)}ms`;
});

function handleNewAnalysis(): void {
  seoStore.reset();
}
</script>

<template>
  <div v-if="result" class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-xl font-bold text-body">{{ t('seo.results.title') }}</h2>
        <a
          :href="result.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1 text-sm text-accent hover:underline mt-1"
        >
          {{ result.url }}
          <ExternalLink class="h-3.5 w-3.5" aria-hidden="true" />
        </a>
        <div class="flex items-center gap-4 mt-2 text-xs text-muted">
          <span class="flex items-center gap-1">
            <Clock class="h-3.5 w-3.5" aria-hidden="true" />
            {{ analyzedDate }}
          </span>
          <span>{{ t('seo.results.fetchTime') }}: {{ fetchDuration }}</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn-outline flex items-center gap-2"
          @click="handleNewAnalysis"
        >
          <RotateCcw class="h-4 w-4" aria-hidden="true" />
          {{ t('seo.results.newAnalysis') }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <ScoreCard :score="result.overallScore" :label="t('seo.results.overallScore')" />
      <div class="md:col-span-2 glass-card p-6">
        <h3 class="text-lg font-semibold text-body mb-4">{{ t('seo.results.summary') }}</h3>
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p class="text-2xl font-bold text-body">
              {{ result.content.wordCount.toLocaleString() }}
            </p>
            <p class="text-xs text-muted">{{ t('seo.content.words') }}</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-body">{{ result.headings.items.length }}</p>
            <p class="text-xs text-muted">{{ t('seo.headings.title') }}</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-body">{{ result.images.total }}</p>
            <p class="text-xs text-muted">{{ t('seo.images.title') }}</p>
          </div>
          <div>
            <p class="text-2xl font-bold text-body">{{ result.links.total }}</p>
            <p class="text-xs text-muted">{{ t('seo.links.title') }}</p>
          </div>
        </div>
      </div>
    </div>

    <MetaAnalysisCard :meta="result.meta" />
    <PreviewsCard :url="result.url" :meta="result.meta" />
    <HeadingsTree :headings="result.headings" />
    <ContentAnalysisCard :content="result.content" />
    <ReadingLevelCard :text="result.bodyText" />
    <KeywordsCard :keywords="result.keywords" />
    <ImagesAnalysisCard :images="result.images" />
    <LinksAnalysisCard :links="result.links" />
    <AnchorTextCard :anchor-text="result.anchorText" />
    <TechnicalAnalysisCard :technical="result.technical" />
    <MobileAnalysisCard :mobile="result.mobile" />
    <PerformanceCard :performance="result.performance" />
    <ResourceHintsCard :resource-hints="result.resourceHints" />
    <RobotsSitemapCard
      v-if="robotsTxt && sitemap && !isLoadingRobots"
      :robots-txt="robotsTxt"
      :sitemap="sitemap"
    />
    <div v-else-if="isLoadingRobots" class="glass-card p-6 animate-pulse">
      <div class="h-6 bg-surface rounded w-48 mb-4"></div>
      <div class="h-24 bg-surface rounded"></div>
    </div>
    <SecurityAnalysisCard v-if="security && !isLoadingSecurity" :security="security" />
    <div v-else-if="isLoadingSecurity" class="glass-card p-6 animate-pulse">
      <div class="h-6 bg-surface rounded w-48 mb-4"></div>
      <div class="h-24 bg-surface rounded"></div>
    </div>
    <UrlAnalysisCard v-if="urlAnalysis" :url-analysis="urlAnalysis" />
    <EmbeddedContentCard v-if="embeddedContent" :embedded-content="embeddedContent" />
    <SchemaPreviewCard
      :structured-data="result.structuredData"
      :schema-previews="result.schemaPreviews"
    />
    <SocialAnalyticsCard :social-analytics="result.socialAnalytics" />
    <ResourceOptimizationCard :resource-optimization="result.resourceOptimization" />
    <RenderingCard :rendering="result.rendering" />
    <LazyContentCard :lazy-content="result.lazyContent" />
    <SocialShareCard :social-share="result.socialShare" />
    <AccessibilityCard :accessibility="result.accessibility" />
    <CoreWebVitalsCard :core-web-vitals="result.coreWebVitals" />
    <SeoChecklist :result="result" />
    <ExportCard :result="result" />
  </div>
</template>

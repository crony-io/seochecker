<script setup lang="ts">
import { Calendar, User, FileJson } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type { SchemaPreview, StructuredDataAnalysis } from '@/types/seo';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

const props = defineProps<{
  structuredData: StructuredDataAnalysis;
  schemaPreviews: SchemaPreview[];
}>();

const { t } = useI18n();

const activePreview = ref(0);

const currentPreview = computed(() => {
  return props.schemaPreviews[activePreview.value];
});

const hasPreviewData = computed(() => {
  return props.schemaPreviews.some(
    (p) => p.name || p.description || p.rating || p.price || p.image,
  );
});

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
}

function renderStars(rating: number): string {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return '★'.repeat(fullStars) + (halfStar ? '½' : '') + '☆'.repeat(emptyStars);
}
</script>

<template>
  <AnalysisSection :title="t('seo.schema.title')" :status="structuredData.status">
    <div class="space-y-4">
      <!-- Schema Types Found -->
      <div class="flex flex-wrap gap-2">
        <span
          v-for="(schema, index) in structuredData.jsonLd"
          :key="index"
          class="px-3 py-1 text-xs rounded-full font-medium cursor-pointer transition-colors"
          :class="
            activePreview === index
              ? 'bg-accent text-white'
              : 'bg-surface hover:bg-surface-hover text-body'
          "
          @click="activePreview = index"
        >
          {{ schema.type }}
        </span>
      </div>

      <!-- No Schema -->
      <div v-if="structuredData.jsonLd.length === 0" class="text-center py-6">
        <FileJson class="h-12 w-12 mx-auto text-muted mb-3" aria-hidden="true" />
        <p class="text-sm text-muted">{{ t('seo.schema.noSchema') }}</p>
        <p class="text-xs text-muted mt-1">{{ t('seo.schema.recommendation') }}</p>
      </div>

      <!-- Rich Snippet Preview -->
      <div
        v-else-if="hasPreviewData && currentPreview"
        class="border border-border rounded-lg overflow-hidden bg-white dark:bg-stone-900"
      >
        <div class="p-4">
          <p class="text-xs text-muted mb-2">{{ t('seo.schema.richSnippetPreview') }}</p>

          <!-- Product/Article Preview -->
          <div class="flex gap-4">
            <img
              v-if="currentPreview.image"
              :src="currentPreview.image"
              :alt="currentPreview.name || 'Preview'"
              class="w-24 h-24 object-cover rounded shrink-0"
              @error="($event.target as HTMLImageElement).style.display = 'none'"
            />
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-blue-700 dark:text-blue-400 text-lg line-clamp-2">
                {{ currentPreview.name || t('seo.schema.untitled') }}
              </h3>

              <!-- Rating -->
              <div v-if="currentPreview.rating" class="flex items-center gap-2 mt-1">
                <span class="text-yellow-500 text-sm">
                  {{ renderStars(currentPreview.rating.value) }}
                </span>
                <span class="text-xs text-muted">
                  {{ currentPreview.rating.value.toFixed(1) }}
                  ({{ currentPreview.rating.count }} {{ t('seo.schema.reviews') }})
                </span>
              </div>

              <!-- Price -->
              <div v-if="currentPreview.price" class="mt-1">
                <span class="text-green-600 dark:text-green-400 font-medium">
                  {{ currentPreview.price.currency }}
                  {{ currentPreview.price.value }}
                </span>
              </div>

              <!-- Author & Date -->
              <div
                v-if="currentPreview.author || currentPreview.datePublished"
                class="flex items-center gap-3 mt-2 text-xs text-muted"
              >
                <span v-if="currentPreview.author" class="flex items-center gap-1">
                  <User class="h-3 w-3" aria-hidden="true" />
                  {{ currentPreview.author }}
                </span>
                <span v-if="currentPreview.datePublished" class="flex items-center gap-1">
                  <Calendar class="h-3 w-3" aria-hidden="true" />
                  {{ formatDate(currentPreview.datePublished) }}
                </span>
              </div>

              <!-- Description -->
              <p
                v-if="currentPreview.description"
                class="text-sm text-stone-600 dark:text-stone-400 mt-2 line-clamp-2"
              >
                {{ currentPreview.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Raw JSON Preview Toggle -->
      <details v-if="structuredData.jsonLd.length > 0" class="text-xs">
        <summary class="cursor-pointer text-muted hover:text-body">
          {{ t('seo.schema.viewRawJson') }}
        </summary>
        <pre class="mt-2 p-3 bg-surface rounded-lg overflow-x-auto text-xs text-body">{{
          JSON.stringify(structuredData.jsonLd[activePreview]?.raw, null, 2)
        }}</pre>
      </details>
    </div>
  </AnalysisSection>
</template>

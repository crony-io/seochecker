<script setup lang="ts">
import { Frame, Video, Music } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

import type { EmbeddedContentAnalysis } from '@/utils/embeddedContentAnalysis';
import AnalysisSection from '@/components/seo/AnalysisSection.vue';

defineProps<{
  embeddedContent: EmbeddedContentAnalysis;
}>();

const { t } = useI18n();
</script>

<template>
  <AnalysisSection :title="t('seo.embeddedContent.title')" :status="embeddedContent.overallStatus">
    <div class="space-y-4">
      <!-- No Content Message -->
      <div
        v-if="
          embeddedContent.iframes.total === 0 &&
          embeddedContent.videos.total === 0 &&
          embeddedContent.audios.total === 0
        "
        class="text-sm text-muted text-center py-4"
      >
        {{ t('seo.embeddedContent.noContent') }}
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <!-- Iframes -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <Frame class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.embeddedContent.iframes') }}</span>
            <span class="ml-auto text-xs text-muted">{{ embeddedContent.iframes.total }}</span>
          </div>

          <div v-if="embeddedContent.iframes.total > 0" class="space-y-2">
            <div
              v-for="(iframe, index) in embeddedContent.iframes.items.slice(0, 3)"
              :key="index"
              class="text-xs p-2 rounded bg-surface-hover"
            >
              <p class="text-body truncate" :title="iframe.src">
                {{ iframe.src || t('seo.embeddedContent.noSrc') }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  :class="[
                    'px-1.5 py-0.5 rounded',
                    iframe.title
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400',
                  ]"
                >
                  {{
                    iframe.title
                      ? t('seo.embeddedContent.hasTitle')
                      : t('seo.embeddedContent.missingTitle')
                  }}
                </span>
                <span
                  v-if="iframe.loading === 'lazy'"
                  class="px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  {{ t('seo.embeddedContent.lazy') }}
                </span>
                <span
                  v-if="iframe.sandbox"
                  class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400"
                >
                  {{ t('seo.embeddedContent.sandbox') }}
                </span>
              </div>
            </div>

            <div v-if="embeddedContent.iframes.issues.length > 0" class="mt-2">
              <p
                v-for="(issue, idx) in embeddedContent.iframes.issues"
                :key="idx"
                class="text-xs text-amber-600 dark:text-amber-400"
              >
                • {{ issue }}
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.embeddedContent.noContent') }}</p>
        </div>

        <!-- Videos -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <Video class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.embeddedContent.videos') }}</span>
            <span class="ml-auto text-xs text-muted">{{ embeddedContent.videos.total }}</span>
          </div>

          <div v-if="embeddedContent.videos.total > 0" class="space-y-2">
            <div
              v-for="(video, index) in embeddedContent.videos.items.slice(0, 3)"
              :key="index"
              class="text-xs p-2 rounded bg-surface-hover"
            >
              <p class="text-body truncate" :title="video.src || video.sources[0]">
                {{ video.src || video.sources[0] || t('seo.embeddedContent.noSrc') }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  :class="[
                    'px-1.5 py-0.5 rounded',
                    video.hasControls
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400',
                  ]"
                >
                  {{
                    video.hasControls
                      ? t('seo.embeddedContent.hasControls')
                      : t('seo.embeddedContent.missingControls')
                  }}
                </span>
                <span
                  :class="[
                    'px-1.5 py-0.5 rounded',
                    video.hasCaptions
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  ]"
                >
                  {{
                    video.hasCaptions
                      ? t('seo.embeddedContent.hasCaptions')
                      : t('seo.embeddedContent.missingCaptions')
                  }}
                </span>
                <span
                  v-if="video.poster"
                  class="px-1.5 py-0.5 rounded bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  {{ t('seo.embeddedContent.poster') }}
                </span>
              </div>
            </div>

            <div v-if="embeddedContent.videos.issues.length > 0" class="mt-2">
              <p
                v-for="(issue, idx) in embeddedContent.videos.issues"
                :key="idx"
                class="text-xs text-amber-600 dark:text-amber-400"
              >
                • {{ issue }}
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.embeddedContent.noContent') }}</p>
        </div>

        <!-- Audio -->
        <div class="p-3 rounded-lg bg-surface">
          <div class="flex items-center gap-2 text-body mb-3">
            <Music class="h-4 w-4 text-accent" aria-hidden="true" />
            <span class="font-medium text-sm">{{ t('seo.embeddedContent.audios') }}</span>
            <span class="ml-auto text-xs text-muted">{{ embeddedContent.audios.total }}</span>
          </div>

          <div v-if="embeddedContent.audios.total > 0" class="space-y-2">
            <div
              v-for="(audio, index) in embeddedContent.audios.items.slice(0, 3)"
              :key="index"
              class="text-xs p-2 rounded bg-surface-hover"
            >
              <p class="text-body truncate" :title="audio.src || audio.sources[0]">
                {{ audio.src || audio.sources[0] || t('seo.embeddedContent.noSrc') }}
              </p>
              <div class="flex flex-wrap gap-1 mt-1">
                <span
                  :class="[
                    'px-1.5 py-0.5 rounded',
                    audio.hasControls
                      ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                      : 'bg-red-500/10 text-red-600 dark:text-red-400',
                  ]"
                >
                  {{
                    audio.hasControls
                      ? t('seo.embeddedContent.hasControls')
                      : t('seo.embeddedContent.missingControls')
                  }}
                </span>
                <span
                  v-if="audio.hasAutoplay"
                  class="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400"
                >
                  {{ t('seo.embeddedContent.autoplay') }}
                </span>
              </div>
            </div>

            <div v-if="embeddedContent.audios.issues.length > 0" class="mt-2">
              <p
                v-for="(issue, idx) in embeddedContent.audios.issues"
                :key="idx"
                class="text-xs text-amber-600 dark:text-amber-400"
              >
                • {{ issue }}
              </p>
            </div>
          </div>
          <p v-else class="text-xs text-muted">{{ t('seo.embeddedContent.noContent') }}</p>
        </div>
      </div>

      <p class="text-xs text-muted">{{ t('seo.embeddedContent.description') }}</p>
    </div>
  </AnalysisSection>
</template>

<script setup lang="ts">
/**
 * @fileoverview About page with project info, features, tech stack, and credits.
 */
import {
  Search,
  Shield,
  Zap,
  Globe,
  FileText,
  Image,
  Link,
  BarChart3,
  Code,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const features = [
  { icon: FileText, key: 'metaTags' },
  { icon: Search, key: 'headings' },
  { icon: BarChart3, key: 'content' },
  { icon: Image, key: 'images' },
  { icon: Link, key: 'links' },
  { icon: Code, key: 'technical' },
];

const benefits = [
  { icon: Shield, key: 'privacy' },
  { icon: Zap, key: 'fast' },
  { icon: Globe, key: 'free' },
];
</script>

<template>
  <div class="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8">
    <!-- Header -->
    <section class="text-center py-8">
      <h1 class="text-3xl md:text-4xl font-bold text-body mb-4">
        {{ t('app.about.title') }}
      </h1>
      <p class="text-lg text-muted max-w-2xl mx-auto">
        {{ t('app.about.description') }}
      </p>
    </section>

    <!-- What It Does -->
    <section class="glass-card p-6">
      <h2 class="text-xl font-semibold text-body mb-4">
        {{ t('app.about.whatItDoes.title') }}
      </h2>
      <p class="text-muted mb-6">
        {{ t('app.about.whatItDoes.description') }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="feature in features"
          :key="feature.key"
          class="flex items-start gap-3 p-4 rounded-lg bg-surface"
        >
          <component
            :is="feature.icon"
            class="h-5 w-5 text-accent shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div>
            <h3 class="font-medium text-body text-sm">
              {{ t(`app.about.features.${feature.key}.title`) }}
            </h3>
            <p class="text-xs text-muted mt-1">
              {{ t(`app.about.features.${feature.key}.description`) }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits -->
    <section class="glass-card p-6">
      <h2 class="text-xl font-semibold text-body mb-4">
        {{ t('app.about.benefits.title') }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="benefit in benefits" :key="benefit.key" class="text-center p-4">
          <div
            class="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center"
          >
            <component :is="benefit.icon" class="h-6 w-6 text-accent" aria-hidden="true" />
          </div>
          <h3 class="font-medium text-body">
            {{ t(`app.about.benefits.${benefit.key}.title`) }}
          </h3>
          <p class="text-sm text-muted mt-1">
            {{ t(`app.about.benefits.${benefit.key}.description`) }}
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="glass-card p-6">
      <h2 class="text-xl font-semibold text-body mb-4">
        {{ t('app.about.howItWorks.title') }}
      </h2>

      <ol class="space-y-4">
        <li class="flex items-start gap-3">
          <span
            class="w-6 h-6 rounded-full bg-accent text-white text-sm font-medium flex items-center justify-center shrink-0"
          >
            1
          </span>
          <p class="text-muted">{{ t('app.about.howItWorks.step1') }}</p>
        </li>
        <li class="flex items-start gap-3">
          <span
            class="w-6 h-6 rounded-full bg-accent text-white text-sm font-medium flex items-center justify-center shrink-0"
          >
            2
          </span>
          <p class="text-muted">{{ t('app.about.howItWorks.step2') }}</p>
        </li>
        <li class="flex items-start gap-3">
          <span
            class="w-6 h-6 rounded-full bg-accent text-white text-sm font-medium flex items-center justify-center shrink-0"
          >
            3
          </span>
          <p class="text-muted">{{ t('app.about.howItWorks.step3') }}</p>
        </li>
      </ol>
    </section>

    <!-- Tech Stack -->
    <section class="glass-card p-6">
      <h2 class="text-xl font-semibold text-body mb-4">
        {{ t('app.about.techStack.title') }}
      </h2>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tech in ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Pinia', 'Vite', 'vue-i18n']"
          :key="tech"
          class="px-3 py-1 text-sm rounded-full bg-surface border border-border text-body"
        >
          {{ tech }}
        </span>
      </div>
    </section>
  </div>
</template>

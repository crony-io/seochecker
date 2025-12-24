/**
 * @fileoverview Content analysis module.
 */

import type { ContentAnalysis, SeoStatus } from '@/types/seo';
import {
  CONTENT_MIN_WORDS_GOOD,
  CONTENT_MIN_WORDS_WARNING,
  TEXT_HTML_RATIO_MIN,
  WORDS_PER_MINUTE,
} from '@/constants/seo';

/**
 * Analyzes content quality metrics.
 */
export function analyzeContent(text: string, htmlSize: number): ContentAnalysis {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const characterCount = text.length;
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;
  const readingTimeMinutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  const textToHtmlRatio = htmlSize > 0 ? Math.round((characterCount / htmlSize) * 100) : 0;

  const status: SeoStatus =
    wordCount >= CONTENT_MIN_WORDS_GOOD && textToHtmlRatio >= TEXT_HTML_RATIO_MIN
      ? 'good'
      : wordCount >= CONTENT_MIN_WORDS_WARNING
        ? 'warning'
        : 'error';

  return {
    wordCount,
    characterCount,
    paragraphCount,
    sentenceCount,
    avgWordsPerSentence,
    readingTimeMinutes,
    textToHtmlRatio,
    status,
  };
}

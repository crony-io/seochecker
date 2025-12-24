/**
 * @fileoverview Keywords analysis module.
 */

import type { KeywordItem, KeywordsAnalysis, SeoStatus } from '@/types/seo';
import {
  KEYWORD_CONSISTENCY_CHECK_COUNT,
  KEYWORD_CONSISTENCY_GOOD,
  KEYWORD_CONSISTENCY_WARNING,
  KEYWORD_MIN_WORD_LENGTH,
  TOP_KEYWORDS_COUNT,
} from '@/constants/seo';
import { filterStopWords } from '@/utils/stopWords';

/**
 * Analyzes keyword usage and consistency.
 */
export function analyzeKeywords(
  text: string,
  title: string | null,
  description: string | null,
  h1Text: string | null,
): KeywordsAnalysis {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > KEYWORD_MIN_WORD_LENGTH);

  const filteredWords = filterStopWords(words);
  const frequency: Record<string, number> = {};

  filteredWords.forEach((word) => {
    frequency[word] = (frequency[word] ?? 0) + 1;
  });

  const totalWords = filteredWords.length;
  const topKeywords: KeywordItem[] = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, TOP_KEYWORDS_COUNT)
    .map(([word, count]) => ({
      word,
      count,
      density: Math.round((count / totalWords) * 10000) / 100,
    }));

  const topKeywordWords = topKeywords.slice(0, KEYWORD_CONSISTENCY_CHECK_COUNT).map((k) => k.word);
  const titleLower = title?.toLowerCase() ?? '';
  const descLower = description?.toLowerCase() ?? '';
  const h1Lower = h1Text?.toLowerCase() ?? '';

  const consistency = {
    inTitle: topKeywordWords.filter((w) => titleLower.includes(w)),
    inDescription: topKeywordWords.filter((w) => descLower.includes(w)),
    inH1: topKeywordWords.filter((w) => h1Lower.includes(w)),
    inContent: topKeywordWords,
  };

  const consistencyScore =
    consistency.inTitle.length + consistency.inDescription.length + consistency.inH1.length;
  const status: SeoStatus =
    consistencyScore >= KEYWORD_CONSISTENCY_GOOD
      ? 'good'
      : consistencyScore >= KEYWORD_CONSISTENCY_WARNING
        ? 'warning'
        : 'error';

  return {
    topKeywords,
    totalWords,
    uniqueWords: Object.keys(frequency).length,
    consistency,
    status,
  };
}

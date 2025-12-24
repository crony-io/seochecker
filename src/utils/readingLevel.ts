/**
 * @fileoverview Reading level analysis utilities (Flesch-Kincaid).
 */

import { t } from '@/utils/i18nHelper';

/**
 * Counts the number of syllables in a word.
 * Uses a simplified algorithm based on vowel patterns.
 */
export function countSyllables(word: string): number {
  const lowerWord = word.toLowerCase().replace(/[^a-z]/g, '');

  if (lowerWord.length <= 3) {
    return 1;
  }

  // Count vowel groups
  let syllables = lowerWord.match(/[aeiouy]+/g)?.length ?? 1;

  // Subtract silent 'e' at end
  if (lowerWord.endsWith('e') && !lowerWord.endsWith('le')) {
    syllables = Math.max(1, syllables - 1);
  }

  // Handle special endings
  if (lowerWord.endsWith('es') || lowerWord.endsWith('ed')) {
    const beforeEnding = lowerWord.slice(0, -2);
    if (!/[aeiouy]/.test(beforeEnding.slice(-1))) {
      syllables = Math.max(1, syllables - 1);
    }
  }

  return Math.max(1, syllables);
}

/**
 * Counts sentences in text.
 */
export function countSentences(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  return Math.max(1, sentences.length);
}

/**
 * Counts words in text.
 */
export function countWords(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  return words.length;
}

/**
 * Calculates the Flesch Reading Ease score.
 * Higher scores = easier to read.
 * - 90-100: Very Easy (5th grade)
 * - 80-89: Easy (6th grade)
 * - 70-79: Fairly Easy (7th grade)
 * - 60-69: Standard (8th-9th grade)
 * - 50-59: Fairly Difficult (10th-12th grade)
 * - 30-49: Difficult (College)
 * - 0-29: Very Difficult (College graduate)
 */
export function calculateFleschReadingEase(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    return 0;
  }

  const sentenceCount = countSentences(text);
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Flesch Reading Ease formula
  const score = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllableCount / wordCount);

  // Clamp between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculates the Flesch-Kincaid Grade Level.
 * Returns the US school grade level needed to understand the text.
 */
export function calculateFleschKincaidGrade(text: string): number {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    return 0;
  }

  const sentenceCount = countSentences(text);
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  // Flesch-Kincaid Grade Level formula
  const grade = 0.39 * (wordCount / sentenceCount) + 11.8 * (syllableCount / wordCount) - 15.59;

  // Clamp between 0 and 18
  return Math.max(0, Math.min(18, Math.round(grade * 10) / 10));
}

/**
 * Gets a human-readable label for the Flesch Reading Ease score.
 */
export function getReadingEaseLabel(score: number): string {
  if (score >= 90) {
    return t('seo.readingLevel.labels.veryEasy');
  }
  if (score >= 80) {
    return t('seo.readingLevel.labels.easy');
  }
  if (score >= 70) {
    return t('seo.readingLevel.labels.fairlyEasy');
  }
  if (score >= 60) {
    return t('seo.readingLevel.labels.standard');
  }
  if (score >= 50) {
    return t('seo.readingLevel.labels.fairlyDifficult');
  }
  if (score >= 30) {
    return t('seo.readingLevel.labels.difficult');
  }
  return t('seo.readingLevel.labels.veryDifficult');
}

/**
 * Gets the target audience for a reading level.
 */
export function getTargetAudience(score: number): string {
  if (score >= 90) {
    return t('seo.readingLevel.audiences.grade5');
  }
  if (score >= 80) {
    return t('seo.readingLevel.audiences.grade6');
  }
  if (score >= 70) {
    return t('seo.readingLevel.audiences.grade7');
  }
  if (score >= 60) {
    return t('seo.readingLevel.audiences.grade8to9');
  }
  if (score >= 50) {
    return t('seo.readingLevel.audiences.grade10to12');
  }
  if (score >= 30) {
    return t('seo.readingLevel.audiences.college');
  }
  return t('seo.readingLevel.audiences.collegeGraduate');
}

export interface ReadingLevelAnalysis {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  readingEaseLabel: string;
  targetAudience: string;
  avgSyllablesPerWord: number;
  avgWordsPerSentence: number;
}

/**
 * Performs complete reading level analysis on text.
 */
export function analyzeReadingLevel(text: string): ReadingLevelAnalysis {
  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const wordCount = words.length;
  const sentenceCount = countSentences(text);
  const syllableCount = words.reduce((sum, word) => sum + countSyllables(word), 0);

  const fleschReadingEase = calculateFleschReadingEase(text);
  const fleschKincaidGrade = calculateFleschKincaidGrade(text);

  return {
    fleschReadingEase,
    fleschKincaidGrade,
    readingEaseLabel: getReadingEaseLabel(fleschReadingEase),
    targetAudience: getTargetAudience(fleschReadingEase),
    avgSyllablesPerWord: wordCount > 0 ? Math.round((syllableCount / wordCount) * 100) / 100 : 0,
    avgWordsPerSentence: sentenceCount > 0 ? Math.round((wordCount / sentenceCount) * 10) / 10 : 0,
  };
}

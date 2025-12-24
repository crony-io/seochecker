/**
 * @fileoverview HTML parser composable for extracting SEO-relevant data.
 */

import type { MetaTags } from '@/types/seo';

/**
 * Parses HTML string into a Document object.
 */
export function parseHtml(html: string): Document {
  const parser = new DOMParser();
  return parser.parseFromString(html, 'text/html');
}

/**
 * Extracts all meta tags from a document.
 */
export function extractMetaTags(doc: Document): MetaTags {
  const getMetaContent = (name: string): string | null => {
    const el = doc.querySelector(`meta[name="${name}"], meta[name="${name.toLowerCase()}"]`);
    return el?.getAttribute('content') ?? null;
  };

  const getMetaProperty = (property: string): string | null => {
    const el = doc.querySelector(`meta[property="${property}"]`);
    return el?.getAttribute('content') ?? null;
  };

  return {
    title: doc.querySelector('title')?.textContent?.trim() ?? null,
    description: getMetaContent('description'),
    keywords: getMetaContent('keywords'),
    robots: getMetaContent('robots'),
    viewport: getMetaContent('viewport'),
    charset: doc.querySelector('meta[charset]')?.getAttribute('charset') ?? null,
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    ogTitle: getMetaProperty('og:title'),
    ogDescription: getMetaProperty('og:description'),
    ogImage: getMetaProperty('og:image'),
    ogType: getMetaProperty('og:type'),
    ogUrl: getMetaProperty('og:url'),
    twitterCard: getMetaContent('twitter:card') ?? getMetaProperty('twitter:card'),
    twitterTitle: getMetaContent('twitter:title') ?? getMetaProperty('twitter:title'),
    twitterDescription:
      getMetaContent('twitter:description') ?? getMetaProperty('twitter:description'),
    twitterImage: getMetaContent('twitter:image') ?? getMetaProperty('twitter:image'),
    author: getMetaContent('author'),
    language: doc.documentElement.getAttribute('lang') ?? null,
  };
}

/**
 * Extracts all headings from a document.
 */
export function extractHeadings(
  doc: Document,
): Array<{ tag: string; level: number; text: string }> {
  const headings: Array<{ tag: string; level: number; text: string }> = [];
  const elements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

  elements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const level = parseInt(tag.charAt(1), 10);
    const text = el.textContent?.trim() ?? '';
    headings.push({ tag, level, text });
  });

  return headings;
}

/**
 * Extracts all images from a document.
 */
export function extractImages(doc: Document): Array<{
  src: string;
  alt: string | null;
  loading: string | null;
}> {
  const images: Array<{ src: string; alt: string | null; loading: string | null }> = [];
  const elements = doc.querySelectorAll('img');

  elements.forEach((el) => {
    images.push({
      src: el.getAttribute('src') ?? '',
      alt: el.getAttribute('alt'),
      loading: el.getAttribute('loading'),
    });
  });

  return images;
}

/**
 * Extracts all links from a document.
 */
export function extractLinks(doc: Document): Array<{
  href: string;
  text: string;
  rel: string | null;
  target: string | null;
}> {
  const links: Array<{ href: string; text: string; rel: string | null; target: string | null }> =
    [];
  const elements = doc.querySelectorAll('a[href]');

  elements.forEach((el) => {
    links.push({
      href: el.getAttribute('href') ?? '',
      text: el.textContent?.trim() ?? '',
      rel: el.getAttribute('rel'),
      target: el.getAttribute('target'),
    });
  });

  return links;
}

/**
 * Extracts body text content.
 */
export function extractBodyText(doc: Document): string {
  const body = doc.body;
  if (!body) {
    return '';
  }

  const clone = body.cloneNode(true) as HTMLElement;

  clone.querySelectorAll('script, style, noscript, iframe, svg').forEach((el) => el.remove());

  return clone.textContent?.trim() ?? '';
}

/**
 * Extracts JSON-LD structured data.
 */
export function extractJsonLd(doc: Document): unknown[] {
  const scripts = doc.querySelectorAll('script[type="application/ld+json"]');
  const data: unknown[] = [];

  scripts.forEach((script) => {
    try {
      const content = script.textContent;
      if (content) {
        data.push(JSON.parse(content));
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.warn('[HTML Parser] Invalid JSON-LD found, skipping:', error);
      }
    }
  });

  return data;
}

/**
 * Counts DOM elements and calculates depth.
 */
export function analyzeDom(doc: Document): { elements: number; maxDepth: number } {
  let maxDepth = 0;
  let elements = 0;

  function traverse(node: Element, depth: number): void {
    elements++;
    if (depth > maxDepth) {
      maxDepth = depth;
    }

    const children = node.children;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (child) {
        traverse(child, depth + 1);
      }
    }
  }

  if (doc.documentElement) {
    traverse(doc.documentElement, 0);
  }

  return { elements, maxDepth };
}

/**
 * Extracts script information.
 */
export function extractScripts(doc: Document): {
  external: number;
  inline: number;
  async: number;
  defer: number;
} {
  const scripts = doc.querySelectorAll('script');
  let external = 0;
  let inline = 0;
  let asyncCount = 0;
  let deferCount = 0;

  scripts.forEach((script) => {
    if (script.src) {
      external++;
      if (script.async) {
        asyncCount++;
      }
      if (script.defer) {
        deferCount++;
      }
    } else if (script.textContent?.trim()) {
      inline++;
    }
  });

  return { external, inline, async: asyncCount, defer: deferCount };
}

/**
 * Extracts stylesheet information.
 */
export function extractStylesheets(doc: Document): {
  external: number;
  inline: number;
} {
  const externalStyles = doc.querySelectorAll('link[rel="stylesheet"]');
  const inlineStyles = doc.querySelectorAll('style');

  return {
    external: externalStyles.length,
    inline: inlineStyles.length,
  };
}

/**
 * Checks for technical SEO elements.
 */
export function checkTechnicalElements(doc: Document): {
  hasDoctype: boolean;
  hasCharset: boolean;
  hasViewport: boolean;
  hasFavicon: boolean;
  hasHreflang: boolean;
} {
  return {
    hasDoctype: doc.doctype !== null,
    hasCharset: doc.querySelector('meta[charset]') !== null,
    hasViewport: doc.querySelector('meta[name="viewport"]') !== null,
    hasFavicon: doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]') !== null,
    hasHreflang: doc.querySelector('link[rel="alternate"][hreflang]') !== null,
  };
}

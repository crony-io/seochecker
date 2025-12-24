# SEO Checker

A client-side SEO analysis tool for evaluating website optimization.

**Live Demo:** [seocheck.crony.io](https://seocheck.crony.io/)

## Disclaimer

**This is a proof of concept.** Intended for educational exploration, not production use.

**AI-Assisted Development:** This project was developed with the assistance of AI tools.

## Overview

SEO Checker is a client-only single-page web application for analyzing website SEO performance. Enter any URL to get instant analysis of meta tags, headings, content, images, links, and more.

### Features

- **Meta Analysis** - Title, description, canonical, robots directives
- **Headings** - Structure and hierarchy validation
- **Content** - Word count, keyword density, readability
- **Images** - Alt text, optimization, lazy loading
- **Links** - Internal/external link analysis, anchor text
- **Social** - Open Graph, Twitter Cards validation
- **Structured Data** - JSON-LD, Schema.org detection
- **Accessibility** - Basic a11y checks
- **Performance** - Resource hints, optimization suggestions
- **Mobile** - Viewport, responsive design checks
- **Internationalization** - English and Spanish
- **Theme Support** - Light and dark modes

## Technical Stack

- Vue 3 (Composition API)
- Pinia (state management)
- Tailwind CSS 4
- Vite 7
- TypeScript
- Zod (schema validation)

## Architecture

- **No backend** - Entirely client-side
- **No router** - View switching via Pinia store (`activeView`)
- **Versioned persistence** - LocalStorage with Zod schema migrations

## Getting Started

### Prerequisites

- Node.js >= 20.0.0

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Linting

```bash
npm run lint
npm run lint:fix
```

## Project Structure

```
src/
  analyzers/      # SEO analysis modules
  components/     # Vue components
  composables/    # Vue composables
  locales/        # i18n translation files
  stores/         # Pinia stores
  types/          # TypeScript type definitions
  utils/          # Utility functions
  views/          # Page-level components
```

## Contributing

Contributions are welcome. Feel free to open issues or submit pull requests.

## License

GNU Affero General Public License v3.0 (AGPL-3.0)

See [LICENSE](LICENSE) for details.

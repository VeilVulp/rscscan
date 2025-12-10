# Contributing to RscScan

Thank you for your interest in contributing to RscScan! This document provides guidelines and instructions for contributing.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Documentation](#documentation)
- [Translation Contribution Guide](#translation-contribution-guide)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## How Can I Contribute?

### Reporting Bugs

**Before submitting a bug report:**
1. Check existing issues to avoid duplicates
2. Collect information about the bug:
   - OS and version
   - Node.js and npm versions
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

**Submit a bug report:**
1. Go to [GitHub Issues](https://github.com/VeilVulp/Rscscan/issues)
2. Click "New Issue"
3. Choose "Bug Report" template
4. Fill in all sections
5. Submit

---

### Suggesting Enhancements

**Before suggesting an enhancement:**
1. Check if it's already been suggested
2. Consider if it fits the project scope
3. Think about how it would benefit users

**Submit an enhancement:**
1. Go to [GitHub Issues](https://github.com/VeilVulp/Rscscan/issues)
2. Click "New Issue"
3. Choose "Feature Request" template
4. Describe the feature and its benefits
5. Submit

---

### Contributing Code

**Types of contributions we welcome:**
- Bug fixes
- New features
- Performance improvements
- Documentation improvements
- Test coverage improvements
- UI/UX enhancements
- Translation improvements

---

## Development Setup

### 1. Fork and Clone
```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/Rscscan.git
cd Rscscan

### 2. Add Upstream Remote

bash
git remote add upstream https://github.com/VeilVulp/Rscscan.git

### 3. Install Dependencies

bash
npm install

### 4. Create a Branch

bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Or a bugfix branch
git checkout -b fix/bug-description

# Or a translation branch
git checkout -b i18n/language-code

### 5. Start Development

bash
# Web mode
npm run dev

# Electron mode
npm run electron:dev

---

## Coding Standards

### JavaScript/React

#### Style Guide

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications.

**Key points:**
- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when appropriate

**Examples:**

javascript
// ✅ Good
const greeting = `Hello, ${name}!`;
const { firstName, lastName } = user;
const handleClick = () => console.log('clicked');

// ❌ Bad
var greeting = 'Hello, ' + name + '!';
var firstName = user.firstName;
var lastName = user.lastName;
function handleClick() { console.log('clicked'); }

---

#### React Components

**Functional Components:**
javascript
// ✅ Good - Functional component with hooks
import { useState, useEffect } from 'react';

export function MyComponent({ prop1, prop2 }) {
const [state, setState] = useState(initialValue);

useEffect(() => {
// Effect logic
return () => {
// Cleanup
};
}, [dependencies]);

return (
<div>
{/* JSX */}
</div>
);
}

**Component Organization:**
javascript
// 1. Imports
import { useState } from 'react';
import { helperFunction } from '../utils';

// 2. Component definition
export function MyComponent() {
// 3. Hooks
const [state, setState] = useState();

// 4. Event handlers
const handleClick = () => {
// Handler logic
};

// 5. Render
return (
<div onClick={handleClick}>
{/* JSX */}
</div>
);
}

---

#### Naming Conventions

**Files:**
- Components: `PascalCase.jsx` (e.g., `Header.jsx`)
- Hooks: `camelCase.js` (e.g., `useTheme.js`)
- Utils: `camelCase.js` (e.g., `helpers.js`)
- Constants: `camelCase.js` (e.g., `constants.js`)
- Translations: `languageCode.json` (e.g., `en.json`, `fa.json`)

**Variables:**
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Variables: `camelCase` (e.g., `userName`)
- Components: `PascalCase` (e.g., `UserProfile`)
- Functions: `camelCase` (e.g., `handleSubmit`)

---

### Comments

#### File Headers

javascript
/**
 * Component/Module Name
 *
 * Brief description of purpose and functionality.
 *
 * Key Features:
 * - Feature 1
 * - Feature 2
 *
 * @module path/to/module
 */

#### Function Documentation

javascript
/**
 * Function description
 *
 * Detailed explanation if needed.
 *
 * @param {Type} paramName - Parameter description
 * @returns {Type} Return value description
 * @throws {Error} When error occurs
 *
 * @example
 * functionName(param);
 * // => result
 */
function functionName(paramName) {
// Implementation
}

#### Inline Comments

javascript
// Single-line comment for simple explanations

/**
 * Multi-line comment for complex logic:
 * 1. Step one
 * 2. Step two
 * 3. Step three
 */

// TODO: Future improvement
// FIXME: Known issue
// NOTE: Important information

---

### ESLint

Run ESLint before committing:

bash
# Check for errors
npm run lint

# Auto-fix issues
npm run lint:fix

**ESLint configuration:** `.eslintrc.cjs`

---

## Commit Guidelines

### Commit Message Format


<type>(<scope>): <subject>

<body>

<footer>

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `i18n`: Translation or internationalization changes

### Examples

bash
# Feature
git commit -m "feat(scanner): add concurrent request limit"

# Bug fix
git commit -m "fix(ui): resolve theme toggle issue"

# Documentation
git commit -m "docs(readme): update installation instructions"

# Refactoring
git commit -m "refactor(hooks): simplify useScanner logic"

# Translation
git commit -m "i18n(fa): add Persian translation"

### Detailed Commit


feat(scanner): add support for custom headers

- Allow users to specify custom HTTP headers
- Add UI controls in settings modal
- Update scanner service to use custom headers
- Add tests for custom header functionality

Closes #123

---

## Pull Request Process

### 1. Update Your Branch

bash
# Fetch latest changes
git fetch upstream

# Merge into your branch
git checkout your-branch
git merge upstream/main

### 2. Test Your Changes

bash
# Run tests
npm test

# Run linter
npm run lint

# Test in development
npm run electron:dev

# Test build
npm run electron:build

### 3. Commit Your Changes

bash
git add .
git commit -m "feat: your feature description"

### 4. Push to Your Fork

bash
git push origin your-branch

### 5. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select your branch
4. Fill in the PR template:
   - Description of changes
   - Related issues
   - Testing performed
   - Screenshots (if UI changes)
5. Submit PR

### 6. Code Review

- Respond to feedback
- Make requested changes
- Push updates to same branch
- PR will update automatically

### 7. Merge

Once approved, maintainers will merge your PR.

---

## Testing

### Running Tests

bash
# All tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run test:coverage

### Writing Tests

**Test file location:**

src/tests/
├── componentName.test.js
├── serviceName.test.js
└── hookName.test.js

**Test structure:**
javascript
import { describe, it, expect } from 'vitest';
import { functionToTest } from '../module';

describe('Module Name', () => {
describe('functionToTest', () => {
it('should do something', () => {
const result = functionToTest(input);
expect(result).toBe(expected);
});

it('should handle edge case', () => {
const result = functionToTest(edgeCase);
expect(result).toBe(expected);
});
});
});

### Test Coverage

Aim for:
- **Statements:** 80%+
- **Branches:** 75%+
- **Functions:** 80%+
- **Lines:** 80%+

---

## Documentation

### Code Documentation

- Add JSDoc comments to all functions
- Include usage examples for complex functions
- Document edge cases and gotchas
- Explain "why" not just "what"

### README Updates

If your changes affect:
- Installation process
- Usage instructions
- Features
- Requirements

Update the README.md accordingly.

### Changelog

Add entry to CHANGELOG.md:

markdown
## [Unreleased]

### Added
- New feature description (#PR-number)

### Changed
- Changed feature description (#PR-number)

### Fixed
- Bug fix description (#PR-number)

---

## Translation Contribution Guide

RscScan supports multiple languages: English, Persian (Farsi), Russian, German, and Chinese. We welcome translation contributions to improve localization quality.

### Supported Languages

| Language | Code | Native Name | Status |
|----------|------|-------------|--------|
| English | `en` | English | ✅ Complete |
| Persian | `fa` | فارسی | ✅ Complete |
| Russian | `ru` | Русский | ✅ Complete |
| German | `de` | Deutsch | ✅ Complete |
| Chinese | `zh` | 中文 | ✅ Complete |

---

### Translation File Structure

Translation files are located in `src/locales/`:


src/locales/
├── en.json    # English (base language)
├── fa.json    # Persian
├── ru.json    # Russian
├── de.json    # German
└── zh.json    # Chinese

---

### Translation File Format

Each translation file follows this JSON structure:

json
{
  "app": {
"title": "Application Title",
"description": "Application description"
  },
  "scanner": {
"start": "Start Scan",
"stop": "Stop Scan"
  }
}

**Key naming conventions:**
- Use lowercase with underscores for keys
- Group related translations under namespaces
- Keep keys consistent across all language files

---

### How to Add/Update Translations

#### 1. Fork and Setup

bash
git clone https://github.com/YOUR-USERNAME/Rscscan.git
cd Rscscan
npm install
git checkout -b i18n/your-language-code

#### 2. Edit Translation File

Open the appropriate language file in `src/locales/`:

bash
# Example: Update Persian translation
nano src/locales/fa.json

#### 3. Follow Translation Guidelines

**DO:**
- Maintain the same JSON structure as `en.json`
- Preserve special characters and formatting (e.g., `%s`, `{count}`)
- Use culturally appropriate terms
- Keep technical terms consistent
- Test your translations in the application

**DON'T:**
- Change key names (only translate values)
- Remove or add keys without updating all languages
- Use automatic translation tools blindly
- Mix languages within a single file

#### 4. Test Your Translation

bash
# Run the application
npm run electron:dev

# Change language in settings to your translation
# Verify all strings display correctly
# Check for text overflow or layout issues

#### 5. Quality Checklist

Before submitting, verify:
- [ ] All keys from `en.json` are present
- [ ] No extra keys that don't exist in `en.json`
- [ ] Text fits properly in UI (no overflow)
- [ ] Special characters render correctly
- [ ] Plural forms are handled properly
- [ ] Date/time formats are culturally appropriate
- [ ] Technical terms are accurate
- [ ] Tone is consistent throughout

---

### Translation Best Practices

#### Context Matters

Always consider the UI context when translating:

json
// ❌ Bad - Literal translation without context
{
  "button.back": "返回" // Chinese - too generic
}

// ✅ Good - Context-aware translation
{
  "button.back": "返回上一步" // Chinese - "Go back one step"
}

#### Maintain Tone

Keep the professional yet friendly tone:

json
// ❌ Bad - Too formal
{
  "error.network": "Netzwerkfehler aufgetreten. Bitte kontaktieren Sie den Administrator."
}

// ✅ Good - Professional and helpful
{
  "error.network": "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung."
}

#### Handle Plurals

Some languages have complex plural rules:

json
{
  "scanner.results": {
"zero": "Keine Ergebnisse",
"one": "Ein Ergebnis",
"other": "{{count}} Ergebnisse"
  }
}

#### RTL Languages (Persian)

For RTL languages like Persian, ensure proper text direction:

json
{
  "scanner.progress": "پیشرفت: {{percent}}%",
  "scanner.status": "وضعیت: {{status}}"
}

The application automatically handles RTL layout for Persian.

---

### Adding a New Language

To add a completely new language:

#### 1. Create Translation File

bash
# Create new language file
cp src/locales/en.json src/locales/NEW_LANG_CODE.json

#### 2. Update i18n Configuration

Edit `src/i18n/i18n.js`:

javascript
import newLang from '../locales/NEW_LANG_CODE.json';

i18n.use(initReactI18next).init({
  resources: {
en: { translation: en },
fa: { translation: fa },
ru: { translation: ru },
de: { translation: de },
zh: { translation: zh },
NEW_LANG_CODE: { translation: newLang }, // Add this
  },
  // ...
});

#### 3. Add Language Option to UI

Update language selector in settings:

javascript
const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: 'US' },
  { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: 'IR' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: 'RU' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: 'DE' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: 'CN' },
  { code: 'NEW_LANG_CODE', name: 'Language Name', nativeName: 'Native Name', flag: 'COUNTRY_CODE' },
];

#### 4. Add Required Fonts

If your language requires special fonts, update `tailwind.config.js`:

javascript
fontFamily: {
  sans: ['Inter', 'Vazirmatn', 'Noto Sans SC', 'YOUR_FONT', 'sans-serif'],
},

#### 5. Test Thoroughly

Test all UI components, modals, tooltips, and error messages.

---

### Translation Commit Guidelines

Use the `i18n` type for translation commits:

bash
# Adding new translation
git commit -m "i18n(es): add Spanish translation"

# Updating existing translation
git commit -m "i18n(fa): improve Persian scanner messages"

# Fixing translation errors
git commit -m "i18n(ru): fix plural forms in results"

---

### Translation Review Process

1. Submit PR with your translation
2. Native speakers will review for accuracy
3. UI testing for layout and overflow issues
4. Technical term verification
5. Approval and merge

---

### Translation Resources

**Helpful tools:**
- **Context:** Review `en.json` for source strings
- **UI Preview:** Run `npm run electron:dev` to see translations live
- **Character Limits:** Check UI components for text length constraints
- **Font Testing:** Ensure special characters render correctly

**Need help?**
- Open a [Discussion](https://github.com/VeilVulp/Rscscan/discussions) for translation questions
- Tag your issue with `i18n` label
- Mention specific keys you're unsure about

---

## Questions?

- **General questions:** Open a [Discussion](https://github.com/VeilVulp/Rscscan/discussions)
- **Bug reports:** Open an [Issue](https://github.com/VeilVulp/Rscscan/issues)
- **Security issues:** Email veilvulp@outlook.com
- **Translation help:** Open a Discussion with `i18n` tag

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">

**Thank you for contributing!** ❤️

[⬆ Back to Top](#contributing-to-rscscan)

</div>

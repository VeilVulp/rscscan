# Test Suite Documentation

## Overview

Comprehensive test suite for the RscScan application covering critical modules and components.

## Test Coverage

### Services
- ✅ **scanner.test.js** - Scanner service (payload building, vulnerability detection, concurrent scanning)
- ✅ **fileHandler.test.js** - File handler service (Electron/web dual-mode operations)

### Utilities
- ✅ **helpers.test.js** - Helper functions (validation, formatting, parsing)

### Components
- ✅ **ConfigPanel.test.jsx** - Configuration panel component

### Hooks
- ✅ **useScanner.test.js** - Scanner state management hook

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm test -- --watch
```

### Run tests with UI
```bash
npm run test:ui
```

### Generate coverage report
```bash
npm run test:coverage
```

## Test Structure

Each test file follows this structure:
1. **Setup** - Mocks and test data
2. **Unit Tests** - Individual function/component tests
3. **Integration Tests** - Component interaction tests
4. **Edge Cases** - Error handling and boundary conditions

## Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Key Test Scenarios

### Scanner Service
- Payload construction with DNS endpoint
- Vulnerability detection via headers
- Network error handling
- Timeout handling
- Concurrent request batching
- Demo mode simulation

### File Handler
- Electron vs Web mode detection
- Native file picker (Electron)
- Web File API fallback
- File save operations
- Notification handling

### Helper Utilities
- DNS endpoint validation
- URL validation
- Timestamp formatting
- File size formatting
- Target list parsing
- Filename sanitization

### ConfigPanel Component
- Rendering with different states
- Input validation
- File upload handling
- Demo mode display
- Reset functionality

### useScanner Hook
- State initialization
- Scan execution
- Progress tracking
- Statistics calculation
- Export functionality

## Mocking Strategy

- **axios** - Mocked for HTTP requests
- **electronAPI** - Mocked for Electron features
- **localStorage** - Mocked for storage operations
- **Notification** - Mocked for browser notifications

## CI/CD Integration

Tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm test -- --run
  
- name: Generate coverage
  run: npm run test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Best Practices

1. **Isolation** - Each test is independent
2. **Clarity** - Descriptive test names
3. **Coverage** - Test happy paths and edge cases
4. **Mocking** - Mock external dependencies
5. **Cleanup** - Clean up after each test

## Future Enhancements

- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Performance benchmarks
- [ ] Accessibility tests
- [ ] Integration tests for Electron IPC

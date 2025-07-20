# Currency Functionality Test Suite

This directory contains comprehensive tests for the currency consistency system implemented in the CASHFLOW application.

## Test Structure

### Unit Tests

#### `src/lib/__tests__/currencyUtils.test.ts`
Tests for core currency utility functions:
- `convertCurrency()` - Currency conversion logic
- `formatCurrency()` - Currency formatting with locale support
- `getCurrencySymbol()` - Currency symbol retrieval
- `getCurrencyName()` - Currency name retrieval
- `WORLD_CURRENCIES` and `SUPPORTED_CURRENCIES` data validation

#### `src/contexts/__tests__/CurrencyContext.test.tsx`
Tests for the currency context and provider:
- Context provider functionality
- Currency state management
- Error handling and loading states
- Event dispatching for currency changes
- Memoization and performance optimization
- Graceful fallbacks for conversion/formatting errors

#### `src/components/ui/__tests__/currency-error.test.tsx`
Tests for the currency error display component:
- Error message display
- Error dismissal functionality
- Accessibility compliance
- Various error message handling

### Integration Tests

#### `src/__tests__/currency-integration.test.tsx`
Tests for currency system integration across components:
- Cross-component currency consistency
- Currency change propagation
- Event-driven updates
- Loading state management
- Error handling across components
- Currency selector integration

### End-to-End Tests

#### `src/__tests__/currency-e2e.test.tsx`
Complete workflow tests:
- Full currency change workflow
- Transaction creation with current currency
- Historical transaction display with conversion
- Transaction filtering and search
- Currency selector search and selection
- Form state persistence during currency changes
- Rapid currency change handling

## Test Coverage

The test suite covers:

### ✅ Core Functionality
- Currency conversion accuracy
- Currency formatting consistency
- Symbol and name retrieval
- Data validation

### ✅ State Management
- Context provider behavior
- Currency preference persistence
- State synchronization across components
- Event-driven updates

### ✅ Error Handling
- Conversion failure fallbacks
- Formatting error recovery
- Network error handling
- Invalid input validation
- User-friendly error messages

### ✅ User Experience
- Loading states during operations
- Immediate UI updates on currency change
- Search and filter functionality
- Form state preservation
- Accessibility compliance

### ✅ Performance
- Memoization effectiveness
- Rapid change handling
- Memory leak prevention
- Re-render optimization

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- currencyUtils.test.ts

# Run tests matching pattern
npm test -- --testNamePattern="currency"
```

## Test Configuration

- **Framework**: Jest with React Testing Library
- **Environment**: jsdom for DOM simulation
- **Setup**: Comprehensive mocking for Next.js, localStorage, and browser APIs
- **Coverage**: Configured to track all source files with exclusions for non-testable files

## Mock Strategy

The tests use strategic mocking to:
- Isolate components under test
- Simulate various error conditions
- Control async operations
- Mock external dependencies (Next.js, browser APIs)
- Provide predictable test data

## Assertions

Tests verify:
- Functional correctness
- Error handling robustness
- Performance characteristics
- Accessibility compliance
- User experience quality
- Data integrity

## Continuous Integration

These tests are designed to run in CI/CD pipelines and provide:
- Fast feedback on currency system changes
- Regression detection
- Coverage reporting
- Performance monitoring

## Maintenance

When adding new currency features:
1. Add corresponding unit tests
2. Update integration tests if cross-component behavior changes
3. Extend e2e tests for new user workflows
4. Update this documentation

## Known Limitations

- Tests use mock exchange rates (not real-time data)
- Some browser-specific behaviors are mocked
- Network conditions are simulated, not real
- Performance tests are synthetic

## Future Enhancements

Potential test improvements:
- Visual regression testing
- Performance benchmarking
- Real API integration tests
- Cross-browser compatibility tests
- Load testing for rapid currency changes
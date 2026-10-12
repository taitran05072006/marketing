#!/bin/bash
echo "Running E2E tests..."
npm install -g @playwright/test
npx playwright test --config=tests/playwright.config.js tests/e2e.spec.js

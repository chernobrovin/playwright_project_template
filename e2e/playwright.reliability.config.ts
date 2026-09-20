import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Keep repeats in the loaded config so workers receive the effective count.
export default defineConfig(config, { repeatEach: 2, workers: 2, retries: 0, fullyParallel: true });

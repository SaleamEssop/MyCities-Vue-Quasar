/**
 * Test Setup File
 * 
 * Configures the test environment before tests run.
 */

import { config } from '@vue/test-utils';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  store: {},
  getItem: vi.fn((key) => localStorageMock.store[key] || null),
  setItem: vi.fn((key, value) => {
    localStorageMock.store[key] = value.toString();
  }),
  removeItem: vi.fn((key) => {
    delete localStorageMock.store[key];
  }),
  clear: vi.fn(() => {
    localStorageMock.store = {};
  }),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

// Mock visualViewport
window.visualViewport = {
  height: 800,
  width: 400,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Global stubs for Quasar components
config.global.stubs = {
  'q-page': { template: '<div class="q-page"><slot /></div>' },
  'q-layout': { template: '<div class="q-layout"><slot /></div>' },
  'q-page-container': { template: '<div class="q-page-container"><slot /></div>' },
  'q-btn': { template: '<button class="q-btn" @click="$emit(\'click\')"><slot /></button>' },
  'q-input': { template: '<input class="q-input" />' },
  'q-card': { template: '<div class="q-card"><slot /></div>' },
  'q-card-section': { template: '<div class="q-card-section"><slot /></div>' },
  'q-icon': { template: '<span class="q-icon"></span>' },
  'q-avatar': { template: '<span class="q-avatar"><slot /></span>' },
  'q-scroll-area': { template: '<div class="q-scroll-area"><slot /></div>' },
  'q-form': { template: '<form class="q-form" @submit.prevent="$emit(\'submit\')"><slot /></form>' },
  'q-banner': { template: '<div class="q-banner"><slot /></div>' },
  'q-list': { template: '<div class="q-list"><slot /></div>' },
  'q-item': { template: '<div class="q-item"><slot /></div>' },
  'q-item-section': { template: '<div class="q-item-section"><slot /></div>' },
  'q-item-label': { template: '<div class="q-item-label"><slot /></div>' },
  'q-select': { template: '<select class="q-select"></select>' },
  'q-dialog': { template: '<div class="q-dialog" v-if="modelValue"><slot /></div>', props: ['modelValue'] },
  'q-space': { template: '<div class="q-space"></div>' },
  'q-badge': { template: '<span class="q-badge"><slot /></span>' },
  'q-tooltip': { template: '<span class="q-tooltip"><slot /></span>' },
};

// Reset localStorage before each test
beforeEach(() => {
  localStorageMock.clear();
});



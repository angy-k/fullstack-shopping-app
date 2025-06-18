// Global test setup for Vitest
import { vi } from 'vitest'
import { config } from '@vue/test-utils'

// Set up Vue Test Utils global config
config.global.stubs = {
  'v-btn': true,
  'v-text-field': true,
  'v-card': true,
  'v-card-title': true,
  'v-card-text': true,
  'v-card-actions': true,
  'v-form': true,
  'v-container': true,
  'v-row': true,
  'v-col': true,
  'v-alert': true,
  'v-icon': true,
  'v-divider': true,
  'v-checkbox': true,
  'router-link': true
}

// Mock window.matchMedia for Vuetify
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
})

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() { }
  unobserve() { }
  disconnect() { }
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() { }
  unobserve() { }
  disconnect() { }
}

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn()
  }),
  useRoute: () => ({
    path: '/',
    query: {},
    params: {},
    name: 'Home',
    meta: {}
  })
}))

// Mock Pinia
vi.mock('pinia', () => ({
  defineStore: vi.fn(),
  createPinia: vi.fn(),
  setActivePinia: vi.fn()
}))

// Mock components
vi.mock('@/components/global/FormInput.vue', () => ({
  default: {
    name: 'FormInput',
    props: ['modelValue', 'label', 'type', 'rules', 'variant', 'prependIcon', 'togglePassword', 'autocomplete'],
    template: `
      <div class="form-input" data-testid="form-input" :data-label="label" :data-type="type">
        <input 
          :value="modelValue" 
          @input="$emit('update:modelValue', $event.target.value)" 
          :placeholder="label"
        />
      </div>
    `,
    emits: ['update:modelValue']
  }
}))

// Silence console warnings/errors during tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

console.error = (...args) => {
  if (
    args[0]?.includes?.('Vue received a Component which was made a reactive object') ||
    args[0]?.includes?.('[Vuetify]') ||
    args[0]?.includes?.('Could not find injected')
  ) {
    return
  }
  originalConsoleError(...args)
}

console.warn = (...args) => {
  if (
    args[0]?.includes?.('Vue received a Component which was made a reactive object') ||
    args[0]?.includes?.('[Vuetify]') ||
    args[0]?.includes?.('Could not find injected')
  ) {
    return
  }
  originalConsoleWarn(...args)
}

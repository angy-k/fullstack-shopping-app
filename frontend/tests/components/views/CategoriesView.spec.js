import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CategoriesView from '@/views/CategoriesView.vue'

// Mock components
vi.mock('@/components/categories/CategoryCard.vue', () => ({
  default: {
    name: 'CategoryCard',
    props: ['category'],
    template: '<div class="category-card-mock" data-testid="category-card">{{ category.name }}</div>',
    emits: ['click'],
  },
}))

vi.mock('@/components/skeletons/ui/CategoryCardSkeleton.vue', () => ({
  default: {
    name: 'CategoryCardSkeleton',
    template: '<div class="category-card-skeleton-mock" data-testid="category-card-skeleton"></div>',
  },
}))

// Create router mock
const routerPushMock = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: routerPushMock,
  }),
}))

describe('CategoriesView.vue', () => {
  let wrapper
  let categoryStore

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()
  })

  const mountComponent = (initialState = {}) => {
    wrapper = mount(CategoriesView, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              category: {
                categories: [],
                loading: false,
                error: null,
                ...initialState,
              },
            },
          }),
        ],
        stubs: {
          'v-container': true,
          'v-row': true,
          'v-col': true,
          'v-alert': true,
        },
      },
    })

    // Get the store from the component
    categoryStore = wrapper.vm.categoryStore
    // Mock the fetchCategories method
    categoryStore.fetchCategories = vi.fn()

    return wrapper
  }

  it('should fetch categories on mount', async () => {
    mountComponent()
    await flushPromises()

    expect(categoryStore.fetchCategories).toHaveBeenCalledTimes(1)
  })

  it('should display loading state when categories are loading', async () => {
    // Mount with loading state
    mountComponent({ loading: true })
    
    // Check for skeleton loaders
    const skeletons = wrapper.findAllComponents({ name: 'CategoryCardSkeleton' })
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('should display categories when loaded', async () => {
    const mockCategories = [
      { id: 1, name: 'Electronics', slug: 'electronics' },
      { id: 2, name: 'Clothing', slug: 'clothing' },
    ]

    // Mount with categories in store
    mountComponent({ categories: mockCategories, loading: false })
    
    // Check for category cards
    const categoryCards = wrapper.findAllComponents({ name: 'CategoryCard' })
    expect(categoryCards.length).toBe(mockCategories.length)
  })

  it('should display error message when there is an error', async () => {
    // Mount with empty categories
    mountComponent({ categories: [], loading: false, error: 'Error message' })
    
    // Check for the info alert
    const errorMessage = wrapper.find('.v-alert')
    expect(errorMessage.exists()).toBe(true)
    expect(errorMessage.text()).toContain('Error message')
  })

  it('should navigate to filtered products when a category is clicked', async () => {
    const mockCategory = { id: 1, name: 'Electronics', slug: 'electronics' }
    
    // Mount with categories
    mountComponent({ categories: [mockCategory], loading: false })
    
    // Find the category card and trigger click event
    const categoryCard = wrapper.findComponent({ name: 'CategoryCard' })
    expect(categoryCard.exists()).toBe(true)
    
    // Trigger click event
    categoryCard.vm.$emit('click', mockCategory)
    
    // Check if router.push was called with the correct path
    expect(routerPushMock).toHaveBeenCalledWith({
      name: 'products',
      query: { category: mockCategory.id.toString() },
    })
  })
})

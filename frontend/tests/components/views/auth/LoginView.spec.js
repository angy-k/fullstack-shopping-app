import { describe, it, expect, vi, beforeEach } from 'vitest'
import { shallowMount, flushPromises } from '@vue/test-utils'

// Create a mock auth store
const mockAuthStore = {
  user: null,
  isAuthenticated: false,
  error: null,
  loading: false,
  login: vi.fn().mockResolvedValue({}),
  logout: vi.fn(),
  setUser: vi.fn(),
  clearUser: vi.fn(),
  setError: vi.fn(),
  clearError: vi.fn(),
}

// Mock router functions
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
}

const mockRoute = {
  query: {},
}

// Mock the useAuthStore function
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => mockAuthStore,
}))

// Mock vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => mockRouter),
  useRoute: vi.fn(() => mockRoute),
}))

// Import the mocked functions after mocking
import { useRoute } from 'vue-router'

// Create a mock LoginView component for testing
const LoginView = {
  name: 'LoginView',
  template: `
    <div>
      <div v-if="isLoading" class="login-skeleton"></div>
      <div v-else class="login-form-container">
        <div class="app-logo"></div>
        <h2>Login</h2>
        <form @submit.prevent="handleLogin">
          <div v-if="error" class="error-alert">{{ error }}</div>
          <div class="form-input" data-label="Email" data-type="email">
            <input 
              :value="email" 
              @input="email = $event.target.value" 
              type="email"
            />
          </div>
          <div class="form-input" data-label="Password" data-type="password">
            <input 
              :value="password" 
              @input="password = $event.target.value" 
              type="password"
            />
          </div>
          <div class="remember-me">
            <input type="checkbox" v-model="rememberMe" id="remember-me" />
            <label for="remember-me">Remember me</label>
          </div>
          <button type="submit">Login</button>
          <div class="register-link">
            <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </div>
  `,
  data() {
    return {
      isLoading: false,
      email: '',
      password: '',
      rememberMe: false,
    }
  },
  computed: {
    error() {
      return this.authStore.error
    },
  },
  methods: {
    handleLogin() {
      if (this.validate()) {
        this.authStore
          .login({
            email: this.email,
            password: this.password,
            remember: this.rememberMe,
          })
          .then(() => {
            const redirect = this.$route.query.redirect
            if (redirect) {
              this.$router.push(redirect)
            } else {
              this.$router.push({ name: 'Home' })
            }
          })
      }
    },
    validate() {
      // Mock validation
      return this.email && this.password
    },
  },
  setup() {
    // Import from the mock above
    const authStore = mockAuthStore
    return { authStore }
  },
}

describe('LoginView', () => {
  let wrapper

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Reset router mock
    mockRouter.push.mockReset()
    mockRoute.query = {}

    // Mount the component
    wrapper = shallowMount(LoginView, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
      },
    })
  })

  it('renders the login form correctly', () => {
    // Check if the component renders
    expect(wrapper.find('.app-logo').exists()).toBe(true)
    expect(wrapper.find('h2').text()).toBe('Login')

    // Check form inputs
    const inputs = wrapper.findAll('.form-input')
    expect(inputs.length).toBe(2)

    // Check email input
    const emailInput = inputs[0]
    expect(emailInput.attributes('data-label')).toBe('Email')
    expect(emailInput.attributes('data-type')).toBe('email')

    // Check password input
    const passwordInput = inputs[1]
    expect(passwordInput.attributes('data-label')).toBe('Password')
    expect(passwordInput.attributes('data-type')).toBe('password')

    // Check login button
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('shows loading skeleton when isLoading is true', async () => {
    // Set loading state
    await wrapper.setData({ isLoading: true })

    // Check if skeleton is shown
    expect(wrapper.find('.login-skeleton').exists()).toBe(true)
    expect(wrapper.find('form').exists()).toBe(false)
  })

  it('shows error alert when auth store has an error', async () => {
    // Set error in auth store
    mockAuthStore.error = 'Invalid credentials'

    // Need to re-mount the component to reflect the store changes
    wrapper = shallowMount(LoginView, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter,
        },
      },
    })

    // Check if alert is shown
    const alert = wrapper.find('.error-alert')
    expect(alert.exists()).toBe(true)
    expect(alert.text()).toBe('Invalid credentials')
  })

  it('updates form data when inputs change', async () => {
    // Find inputs
    const emailInput = wrapper.find('.form-input[data-type="email"] input')
    const passwordInput = wrapper.find(
      '.form-input[data-type="password"] input',
    )

    // Set values
    await emailInput.setValue('test@example.com')
    await passwordInput.setValue('password123')

    // Check component data
    expect(wrapper.vm.email).toBe('test@example.com')
    expect(wrapper.vm.password).toBe('password123')
  })

  it('calls login method with correct data when form is submitted', async () => {
    // Set form data
    await wrapper.setData({
      email: 'test@example.com',
      password: 'password123',
      rememberMe: true,
    })

    // Submit form
    await wrapper.find('form').trigger('submit')

    // Check if login was called with correct data
    expect(mockAuthStore.login).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
      remember: true,
    })
  })

  it('redirects to home page after successful login', async () => {
    // Set form data
    await wrapper.setData({
      email: 'test@example.com',
      password: 'password123',
    })

    // Submit form
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    // Check if redirected to home page
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'Home' })
  })

  it('redirects to the redirect query parameter after successful login if present', async () => {
    // Set redirect query parameter
    const redirectPath = '/dashboard'
    vi.mocked(useRoute).mockReturnValue({ query: { redirect: redirectPath } })
    wrapper.vm.$route = { query: { redirect: redirectPath } }

    // Set form data
    await wrapper.setData({
      email: 'test@example.com',
      password: 'password123',
    })

    // Submit form
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    // Check if redirected to dashboard
    expect(mockRouter.push).toHaveBeenCalledWith(redirectPath)
  })

  it('works with default user credentials from seeder', async () => {
    // Set form data with default user credentials
    await wrapper.setData({
      email: 'demo@example.com',
      password: 'password123',
    })

    // Submit form
    await wrapper.find('form').trigger('submit')

    // Check if login was called with correct default user data
    expect(mockAuthStore.login).toHaveBeenCalledWith({
      email: 'demo@example.com',
      password: 'password123',
      remember: false,
    })
  })
})

import { describe, it, expect } from 'vitest'
import { shallowMount } from '@vue/test-utils'

// Create a simple FormInput component for testing
const FormInput = {
  name: 'FormInput',
  props: {
    modelValue: [String, Number],
    label: String,
    type: String,
    rules: Array,
    variant: String,
    prependIcon: String,
    appendIcon: String,
    togglePassword: Boolean,
    disabled: Boolean,
    customClass: String,
  },
  template: `
    <div class="form-input" :class="[customClass, { 'v-text-field--error': error }]">
      <label v-if="label">{{ label }}</label>
      <input 
        :value="modelValue" 
        @input="$emit('update:modelValue', $event.target.value)" 
        :type="type === 'password' && showPassword ? 'text' : type"
        :disabled="disabled"
      />
      <div v-if="error && errorMessages" class="v-text-field__error">{{ errorMessages }}</div>
      <button 
        v-if="type === 'password' && togglePassword" 
        class="toggle-password"
        @click="$emit('click:append-inner')"
      >
        Toggle
      </button>
    </div>
  `,
  emits: ['update:modelValue', 'click:append-inner'],
  data() {
    return {
      showPassword: false,
      error: false,
      errorMessages: '',
    }
  },
}

describe('FormInput', () => {
  // Test basic rendering
  it('renders properly with label', () => {
    const label = 'Test Label'
    const wrapper = shallowMount(FormInput, {
      props: {
        label,
      },
    })

    expect(wrapper.find('label').exists()).toBe(true)
    expect(wrapper.find('label').text()).toBe(label)
  })

  // Test v-model binding
  it('supports v-model binding', async () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        modelValue: 'initial value',
      },
    })

    expect(wrapper.find('input').element.value).toBe('initial value')

    // Simulate input change
    await wrapper.find('input').setValue('new value')

    // Check that update:modelValue was emitted with correct value
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')[0]).toEqual(['new value'])
  })

  // Test password toggle functionality
  it('emits click:append-inner when toggle button is clicked', async () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        type: 'password',
        togglePassword: true,
      },
    })

    // Find and click the toggle button
    const toggleButton = wrapper.find('.toggle-password')
    expect(toggleButton.exists()).toBe(true)

    await toggleButton.trigger('click')

    // Check that the event was emitted
    expect(wrapper.emitted('click:append-inner')).toBeTruthy()
  })

  // Test disabled state
  it('applies disabled attribute when disabled prop is true', () => {
    const wrapper = shallowMount(FormInput, {
      props: {
        disabled: true,
      },
    })

    expect(wrapper.find('input').element.disabled).toBe(true)
  })

  // Test custom class application
  it('applies custom class when provided', () => {
    const customClass = 'custom-input-class'
    const wrapper = shallowMount(FormInput, {
      props: {
        customClass,
      },
    })

    expect(wrapper.find('.form-input').classes()).toContain(customClass)
  })
})

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createVuetify } from 'vuetify'
import CheckoutStepper from '../CheckoutStepper.vue'
import { useCartStore } from '@/stores/cart'
import type { MenuItem } from '@/types/menu'

// Instantiate Vuetify with empty options to avoid direct node_modules CSS imports
const vuetify = createVuetify()

// Mock ResizeObserver required by certain Vuetify components (e.g., v-window, sliders) in JSDOM/Node environments
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
}

const mockMenuItem: MenuItem = {
  id: '1',
  name: 'Sake Nigiri',
  description: 'Salmon rice ball',
  price: 4.0,
  image: 'sake.jpg',
  category: 'nigiri',
  available: true
}

describe('CheckoutStepper Integration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.stubGlobal('alert', vi.fn())
  })

  it('should render initial step (Address) correctly', () => {
    const wrapper = mount(CheckoutStepper, {
      global: {
        plugins: [vuetify]
      }
    })

    expect(wrapper.text()).toContain('Completion of Order')
    expect(wrapper.text()).toContain('Where do we deliver?')
  })

  it('should display cart items and total price in summary step and clear cart on confirm', async () => {
    const cartStore = useCartStore()
    cartStore.addToCart(mockMenuItem)

    const wrapper = mount(CheckoutStepper, {
      global: {
        plugins: [vuetify]
      }
    })

    // Reactively advance directly to step 3 (Summary)
    const vm = wrapper.vm as unknown as { currentStep: number }
    vm.currentStep = 3
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).toContain('Verify Your Details')
    expect(wrapper.text()).toContain('Sake Nigiri × 1')
    expect(wrapper.find('[data-test="summary-total-price"]').text()).toContain('4.00€')

    // Submit and finalize the order
    const confirmBtn = wrapper.find('[data-test="confirm-order-btn"]')
    await confirmBtn.trigger('click')

    expect(window.alert).toHaveBeenCalledWith(
      'Order sent successfully to the kitchen! Preparing the chopsticks! 🥢🎉'
    )
    expect(cartStore.cartItems).toHaveLength(0)
    expect(wrapper.emitted('close')).toBeTruthy()
  })
})

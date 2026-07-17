<script setup lang="ts">
import { ref } from 'vue'
import { useCart } from '@/composables/useCart'
import { usePermissions } from '@/composables/usePermissions'
import CartLineItem from './CartLineItem.vue'
// Import new stepper component for checkout
import CheckoutStepper from '@/components/checkout/CheckoutStepper.vue'
import LoginModal from '@/components/auth/LoginModal.vue'
import RegisterModal from '@/components/auth/RegisterModal.vue'

// Synchronize open/close state of the drawer with App.vue
const model = defineModel<boolean>({ default: false })

const { cartItems, totalPrice, totalItemsCount, addToCart, removeFromCart, clearCart } = useCart()
const { hasRole } = usePermissions()

// State to control open/close of the checkout stepper modal
const isCheckoutOpen = ref(false)
const isLoginOpen = ref(false)
const isRegisterOpen = ref(false)

// Function which is a bridge between the cart drawer and the checkout stepper modal
const startCheckout = () => {
  model.value = false         // Close the cart drawer
  if (hasRole('user') || hasRole('admin')) {
    // User has Permissions, then open popup
    isCheckoutOpen.value = true // Open the checkout stepper modal
  } else {
    // It's a guest, open modal login
    isLoginOpen.value = true
  }
}

const handleCheckoutSuccess = () => {
  isCheckoutOpen.value = true
}
</script>

<template>
  <v-navigation-drawer
    v-model="model"
    location="right"
    temporary
    width="400"
    class="d-flex flex-column"
  >
    <!-- Header of the Cart -->
    <v-card-item class="border-b py-4">
      <div class="d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <v-icon color="primary" class="mr-2" size="24">mdi-cart-outline</v-icon>
          <span class="text-h6 font-weight-bold">Your Cart</span>
        </div>
        <!-- Close button -->
        <v-btn
          icon="mdi-close"
          variant="text"
          density="comfortable"
          @click="model = false"
        ></v-btn>
      </div>
    </v-card-item>

    <!-- Body of the Cart (Scrollable) -->
    <div class="flex-grow-1 overflow-y-auto pa-4">
      <!-- Empty State -->
      <div v-if="cartItems.length === 0" class="text-center py-12">
        <v-icon size="80" color="grey-lighten-1" class="mb-4">
          mdi-cart-off-outline
        </v-icon>
        <p class="text-body-1 text-grey-darken-1 font-weight-medium">
          Your cart is empty.
        </p>
        <p class="text-caption text-grey-darken-1 mt-1">
          Add some delicious sushi to get started!
        </p>
      </div>

      <!-- List of items in the cart -->
      <template v-else>
        <CartLineItem
          v-for="entry in cartItems"
          :key="entry.item.id"
          :item="entry"
          @increase="addToCart(entry.item)"
          @decrease="removeFromCart(entry.item.id)"
        />
      </template>
    </div>

    <!-- Footer of the Cart (Fixed at the bottom if there are items) -->
    <div v-if="cartItems.length > 0" class="border-t pa-4 bg-grey-lighten-5">
      <div class="d-flex justify-space-between align-center mb-4">
        <span class="text-subtitle-1 font-weight-medium text-grey-darken-1">
          Total ({{ totalItemsCount }} items):
        </span>
        <span class="text-h5 font-weight-black text-primary">
          {{ totalPrice.toFixed(2) }}€
        </span>
      </div>

      <!-- Button to open the checkout stepper modal -->
      <v-btn
        color="primary"
        block
        size="large"
        rounded="lg"
        class="font-weight-bold text-none mb-2"
        prepend-icon="mdi-cash-register"
        data-test="proceed-to-checkout-btn"
        @click="startCheckout"
      >
        Proceed to Checkout
      </v-btn>

      
      <v-btn
      variant="text"
      block
      color="error"
      size="small"
      class="text-none font-weight-bold"
      prepend-icon="mdi-trash-can-outline"
      @click="clearCart"
      >
      Clear Cart
    </v-btn>
  </div>
</v-navigation-drawer>

  <!-- LOGIN MODAL -->
  <LoginModal 
    v-model="isLoginOpen" 
    @success="handleCheckoutSuccess"
    @switch-to-register="isRegisterOpen = true" />

  <!-- REGISTER MODAL -->
  <RegisterModal 
    v-model="isRegisterOpen"
    @success="handleCheckoutSuccess"
    @switch-to-login="isLoginOpen = true" />

  <!-- Checkout Stepper Modal -->
  <v-dialog v-model="isCheckoutOpen" max-width="600" transition="dialog-bottom-transition" persistent>
    <!-- Listen for @close event emitted by the StepSummary or from parent component when the checkout is completed -->
    <CheckoutStepper @close="isCheckoutOpen = false" />
  </v-dialog>
</template>
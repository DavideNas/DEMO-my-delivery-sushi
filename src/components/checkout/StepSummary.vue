<script setup lang="ts">
import { inject, computed } from 'vue'
import { CheckoutKey } from '@/types/checkout'
import { useCart } from '@/composables/useCart'

const checkoutContext = inject(CheckoutKey)
if (!checkoutContext) throw new Error('StepSummary must be used inside CheckoutStepper')

const { checkoutData, prevStep } = checkoutContext
const { cartItems, totalPrice, clearCart } = useCart()

const emit = defineEmits<{
  (e: 'success'): void
}>()

// Transforms the payment method's technical ID into a user-friendly string
const paymentMethodLabel = computed(() => {
  const method = checkoutData.payment.method
  if (method === 'cash_on_delivery') return 'Cash on Delivery'
  if (method === 'paypal') {
    return `PayPal (${checkoutData.payment.paypalEmail || 'No email'})`
  }
  if (method === 'credit_card') {
    const card = checkoutData.payment.cardNumber || ''
    const lastFour = card.replace(/\s/g, '').slice(-4)
    return `Credit Card (ends with *${lastFour || 'XXXX'})`
  }
  return 'Not specified'
})

const handleConfirmOrder = () => {
  alert('Order sent successfully to the kitchen! Preparing the chopsticks! 🥢🎉')
  clearCart()
  emit('success')
}
</script>

<template>
  <div>
    <h3 class="text-h6 font-weight-bold mb-4">Verify Your Details 📝</h3>

    <!-- Summary Address -->
    <div class="bg-grey-lighten-4 pa-4 rounded-lg mb-4">
      <div class="font-weight-bold text-subtitle-2 mb-2 text-primary">Delivery Details:</div>
      <p class="text-body-2 mb-1"><strong>Recipient:</strong> {{ checkoutData.address.fullName }}</p>
      <p class="text-body-2 mb-1"><strong>Address:</strong> {{ checkoutData.address.street }}, {{ checkoutData.address.city }}</p>
      <p class="text-body-2"><strong>Phone:</strong> {{ checkoutData.address.phone }}</p>
    </div>

    <!-- Summary Payment -->
    <div class="bg-grey-lighten-4 pa-4 rounded-lg mb-4">
      <div class="font-weight-bold text-subtitle-2 mb-2 text-primary">Payment Method:</div>
      <p class="text-body-2">
        {{ paymentMethodLabel }}
      </p>
    </div>

    <!-- Summary Cart -->
    <div class="bg-grey-lighten-4 pa-4 rounded-lg mb-4">
      <div class="font-weight-bold text-subtitle-2 mb-2 text-primary">Items Ordered:</div>
      <div v-for="entry in cartItems" :key="entry.item.id" class="text-body-2 d-flex justify-space-between mb-1">
        <span>{{ entry.item.name }} × {{ entry.quantity }}</span>
        <span>{{ (entry.item.price * entry.quantity).toFixed(2) }}€</span>
      </div>
      <div class="border-t mt-2 pt-2 d-flex justify-space-between font-weight-bold text-subtitle-1">
        <span>Total:</span>
        <span class="text-primary" data-test="summary-total-price">{{ totalPrice.toFixed(2) }}€</span>
      </div>
    </div>

    <div class="d-flex gap-2 mt-4">
      <v-btn variant="outlined" data-test="summary-back" @click="prevStep" class="flex-grow-1">Back</v-btn>
      <v-btn color="success" data-test="confirm-order-btn" class="flex-grow-1" @click="handleConfirmOrder">Send Order 🚀</v-btn>
    </div>
  </div>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
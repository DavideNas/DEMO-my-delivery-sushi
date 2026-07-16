<script setup lang="ts">
import { inject, ref } from 'vue'
import { CheckoutKey } from '@/types/checkout'
import { rules } from '@/utils/validationRules'
import type { VForm } from 'vuetify/components'

const checkoutContext = inject(CheckoutKey)
        if (!checkoutContext) throw new Error('StepPayment must be used inside CheckoutStepper')

const { checkoutData, nextStep, prevStep } = checkoutContext

const form = ref<InstanceType<typeof VForm> | null>(null)

const handleSubmit = async () => {

  if (!form.value) return

  const { valid } = await form.value.validate()
  // SECURITY LOCK: Blocks progress if the form is invalid

  if (!valid) {
    console.warn("Validation failed in StepPayment. The user cannot proceed.")
    return
  }
  nextStep()
}
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSubmit" validate-on="submit">
    <h3 class="text-h6 font-weight-bold mb-4">Payment Method 💳</h3>

    <!-- New Radio Button aligned to the options of the Type -->
    <v-radio-group v-model="checkoutData.payment.method" class="mb-4" :rules="[rules.required]">
      <v-radio label="Cash on Delivery" value="cash_on_delivery" color="primary"></v-radio>
      <v-radio label="Credit Card / Debit Card" value="credit_card" data-test="pay-method-card" color="primary"></v-radio>
      <v-radio label="PayPal" value="paypal" color="primary"></v-radio>
    </v-radio-group>

    <!-- 1. Fields for CREDIT CARD -->
    <v-expand-transition>
      <div v-if="checkoutData.payment.method === 'credit_card'" class="mb-4">
        <v-text-field
          v-model="checkoutData.payment.cardNumber"
          label="Number of Card"
          variant="outlined"
          placeholder="0000 0000 0000 0000"
          :rules="[rules.required, rules.cardNumber]"
          data-test="card-number"
          required
        ></v-text-field>

        <v-row>
          <v-col cols="6" class="py-0">
            <v-text-field
              v-model="checkoutData.payment.cardExpiry"
              label="Expiry Date"
              placeholder="MM/AA"
              variant="outlined"
              :rules="[rules.required, rules.cardExpiry]"
              data-test="card-expiry"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="6" class="py-0">
            <v-text-field
              v-model="checkoutData.payment.cardCVC"
              label="CVC / CVV"
              placeholder="123"
              variant="outlined"
              type="password"
              maxlength="4"
              :rules="[rules.required, rules.cardCVC]"
              data-test="card-cvc"
              required
            ></v-text-field>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>

    <!-- 2. Fields for PAYPAL -->
    <v-expand-transition>
      <div v-if="checkoutData.payment.method === 'paypal'" class="mb-4">
        <v-text-field
          v-model="checkoutData.payment.paypalEmail"
          label="PayPal Account Email"
          variant="outlined"
          type="email"
          placeholder="nome@esempio.com"
          :rules="[rules.required, rules.email]"
          required
        ></v-text-field>
      </div>
    </v-expand-transition>

    <!-- 3. Conditional Note for CASH (Cash on Delivery) -->
    <v-expand-transition>
      <div v-if="checkoutData.payment.method === 'cash_on_delivery'" class="mb-4">
        <v-alert
          type="info"
          variant="tonal"
          density="compact"
          text="The payment will be made directly to the delivery person at the time of delivery. Please prepare the exact amount if possible."
        ></v-alert>
      </div>
    </v-expand-transition>

    <div class="d-flex gap-2 mt-6">
      <v-btn variant="outlined" data-test="payment-back" @click="prevStep" class="flex-grow-1">Back</v-btn>
      <v-btn type="submit" data-test="payment-submit" color="primary" class="flex-grow-1">Order Summary</v-btn>
    </div>
  </v-form>
</template>

<style scoped>
.gap-2 {
  gap: 8px;
}
</style>
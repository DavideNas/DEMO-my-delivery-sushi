<script setup lang="ts">
import { inject, ref } from 'vue'
import { CheckoutKey } from '@/types/checkout'
import { rules } from '@/utils/validationRules'
import type { VForm } from 'vuetify/components'

const checkoutContext = inject(CheckoutKey)
if (!checkoutContext) throw new Error('StepAddress must be used inside CheckoutStepper')

const { checkoutData, nextStep } = checkoutContext

const form = ref<InstanceType<typeof VForm> | null>(null)

const handleSubmit = async () => {

  if (!form.value) return

  const { valid } = await form.value.validate()
  // SECURITY LOCK: Blocks progress if the form is invalid

  if (!valid) {
    console.warn("Validation failed in StepAddress. The user cannot proceed.")
    return
  }
  nextStep()
}
</script>

<template>
  <v-form ref="form" @submit.prevent="handleSubmit" validate-on="submit"> 
    <h3 class="text-h6 font-weight-bold mb-4">Where do we deliver? 🛵</h3>
    
    <v-text-field
      v-model="checkoutData.address.fullName"
      label="Full Name on the Doorbell"
      variant="outlined"
      :rules="[rules.required]"
      data-test="address-fullname"
      required
    ></v-text-field>

    <v-text-field
      v-model="checkoutData.address.street"
      label="Street and Number"
      variant="outlined"
      :rules="[rules.required]"
      data-test="address-street"
      required
    ></v-text-field>

    <v-text-field
      v-model="checkoutData.address.city"
      label="City"
      variant="outlined"
      :rules="[rules.required]"
      data-test="address-city"
      required
    ></v-text-field>

    <v-text-field
      v-model="checkoutData.address.phone"
      label="Phone Number"
      variant="outlined"
      type="tel"
      :rules="[rules.required, rules.phone]"
      data-test="address-phone"
      required
    ></v-text-field>

    <v-btn type="submit" data-test="address-submit" color="primary" block size="large" class="mt-4">
      Continue to Payment
    </v-btn>
  </v-form>
</template>
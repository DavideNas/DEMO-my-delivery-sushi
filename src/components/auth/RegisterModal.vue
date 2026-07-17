<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void
  (e: 'switch-to-login'): void // Return to login
}>()

const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isLoading = computed(() => authStore.isLoading)
const errorMessage = computed(() => authStore.error)

const handleRegister = async () => {
  if (!name.value || !email.value || !password.value) return

  try {
    // Note: Make sure your authStore has a register function,
    // otherwise you can simulate or hook into direct login for now.
    await authStore.register({ name: name.value, email: email.value, password: password.value })
    isOpen.value = false
    emit('success')
  } catch (error) {
    console.log(error.message)
    // Managed by the store
  }
}

const openLogin = () => {
  isOpen.value = false
  emit('switch-to-login')
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="450" persistent>
    <v-card class="pa-4 elevation-4 rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Create Account</span>
        <v-btn 
          icon="mdi-close" 
          variant="text" 
          density="comfortable" 
          :disabled="isLoading"
          @click="isOpen = false"
        ></v-btn>
      </v-card-title>

      <v-card-text class="pt-0">
        <p class="text-caption text-medium-emphasis mb-4">
          Sign up to track your orders and save delivery addresses.
        </p>

        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          closable
          class="mb-4 text-body-2"
        >
          {{ errorMessage }}
        </v-alert>

        <v-form @submit.prevent="handleRegister">
          <v-text-field
            v-model="name"
            label="Full Name"
            type="text"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            density="comfortable"
            required
            :disabled="isLoading"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="email"
            label="Email"
            type="email"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            required
            :disabled="isLoading"
            class="mb-2"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
            @click:append-inner="showPassword = !showPassword"
            variant="outlined"
            density="comfortable"
            required
            :disabled="isLoading"
            class="mb-4"
          ></v-text-field>

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            :loading="isLoading"
            variant="elevated"
          >
            Sign Up
          </v-btn>
        </v-form>

        <div class="text-center mt-4 text-body-2">
          Already have an account? 
          <a href="#" class="text-primary font-weight-bold text-decoration-none" @click.prevent="openLogin">
            Sign in
          </a>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
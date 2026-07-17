<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

interface Props {
  modelValue: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'success'): void // Event fired upon successful login
  (e: 'switch-to-register'): void  // Used to switch modal
}>()

const authStore = useAuthStore()

// State of the form inside the modal
const email = ref('')
const password = ref('')
const showPassword = ref(false)

// Synchronizing the modal's state with its parent
const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isLoading = computed(() => authStore.isLoading)
const errorMessage = computed(() => authStore.error)

const handleLogin = async () => {
  if (!email.value || !password.value) return

  try {
    await authStore.login(email.value, password.value)
    isOpen.value = false // Closes the modal on success
    emit('success')
  } catch (error) {
    console.log(error.message)
    // Managed by the store
  }
}

const openRegister = () => {
    isOpen.value = false // close this modal
    emit('switch-to-register')  // Tell the father to open the other one
}

const quickLogin = async (mockEmail: string) => {
  email.value = mockEmail
  password.value = 'any-password'
  await handleLogin()
}
</script>

<template>
  <v-dialog v-model="isOpen" max-width="450" persistent>
    <v-card class="pa-4 elevation-4 rounded-lg">
      <!-- Close button at the top right -->
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">Sign in</span>
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
          Log in to your account to complete your order.
        </p>

        <!-- Alert di Errore -->
        <v-alert
          v-if="errorMessage"
          type="error"
          variant="tonal"
          closable
          class="mb-4 text-body-2"
        >
          {{ errorMessage }}
        </v-alert>

        <!-- Form -->
        <v-form @submit.prevent="handleLogin">
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
            Sign in
          </v-btn>
        </v-form>

        <div class="text-center mt-4 text-body-2">
          Don't have an account? 
          <a href="#" class="text-primary font-weight-bold text-decoration-none" @click.prevent="openRegister">
            Sign up
          </a>
        </div>

        <v-divider class="my-6">Quick Test Account</v-divider>

        <!-- Pulsanti Quick Login -->
        <v-row dense>
          <v-col cols="6">
            <v-btn
              color="success"
              variant="outlined"
              block
              size="small"
              prepend-icon="mdi-account"
              :disabled="isLoading"
              @click="quickLogin('mario@sushi.it')"
            >
              User
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              class="bg-deep-purple-darken-1 text-white"
              variant="flat"
              block
              size="small"
              prepend-icon="mdi-shield-check"
              :disabled="isLoading"
              @click="quickLogin('admin@sushi.it')"
            >
              Admin
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
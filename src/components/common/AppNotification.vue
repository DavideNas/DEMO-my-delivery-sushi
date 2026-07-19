<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const store = useNotificationStore()
// storeToRefs mantiene la reattività quando destrutturiamo le proprietà dello store
const { isVisible, message, type, timeout } = storeToRefs(store)
</script>

<template>
  <v-snackbar
    v-model="isVisible"
    :color="type"
    :timeout="timeout"
    location="top right"
    elevation="24"
    rounded="md"
  >
    <div class="d-flex align-center">
      <v-icon class="mr-3">
        {{ type === 'success' ? 'mdi-check-circle' : type === 'error' ? 'mdi-alert-circle' : 'mdi-information' }}
      </v-icon>
      <span class="text-body-2 font-weight-medium">{{ message }}</span>
    </div>

    <template #actions>
      <v-btn
        icon="mdi-close"
        variant="text"
        density="comfortable"
        @click="store.hide()"
      ></v-btn>
    </template>
  </v-snackbar>
</template>
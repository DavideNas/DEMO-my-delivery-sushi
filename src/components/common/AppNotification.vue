<script setup lang="ts">
import { useNotificationStore } from '@/stores/notification'
import { storeToRefs } from 'pinia'

const store = useNotificationStore()
// storeToRefs mantiene la reattività quando destrutturiamo le proprietà dello store
const { notifications } = storeToRefs(store)
</script>

<template>
  <!-- Fixed container top right above everything (high z-index) -->
  <div class="toast-stack-container">
    <TransitionGroup name="toast-list">
      <v-alert
        v-for="item in notifications"
        :key="item.id"
        :type="item.type"
        density="comfortable"
        elevation="6"
        class="toast-item mb-2"
        closable
        @click:close="store.remove(item.id)"
      >
        <span class="text-body-2 font-weight-medium">{{ item.message }}</span>
      </v-alert>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-stack-container {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;
  pointer-events: none; /* Permette il click sotto al contenitore se non c'è notifica */
}

.toast-item {
  pointer-events: auto; /* Ripristina i click (es. pulsante chiudi) sul singolo toast */
}

/* Animazioni CSS per la comparsa/scomparsa fluida */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.3s ease;
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.toast-list-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

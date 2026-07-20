<script setup lang="ts">
import { ref } from 'vue'
import OrderTrackingModal from '@/components/orders/OrderTrackingModal.vue'

// Local minimal types to simulate orders
interface Order {
  id: string
  date: string
  total: number
  itemsCount: number
}

// States for modal management
const isTrackingOpen = ref(false)
const selectedOrderId = ref('')

const openTracking = (orderId: string) => {
  selectedOrderId.value = orderId
  isTrackingOpen.value = true
}

const closeTracking = () => {
  isTrackingOpen.value = false
  selectedOrderId.value = ''
}

// Typed data mockup to populate Vuetify table/cards
const orders = ref<Order[]>([
  { id: '98765', date: '19 Lug 2026, 12:30', total: 24.50, itemsCount: 6 },
  { id: '11223', date: '18 Lug 2026, 20:15', total: 42.00, itemsCount: 11 },
  { id: '44556', date: '10 Lug 2026, 19:00', total: 18.90, itemsCount: 4 }
])
</script>

<template>
  <v-container class="py-8" max-width="800">
    <h1 class="text-h4 font-weight-bold mb-6">📦 My Orders</h1>

    <v-row v-if="orders.length > 0">
      <v-col v-for="order in orders" :key="order.id" cols="12">
        <v-card variant="outlined" class="rounded-lg pa-4">
          <div class="d-flex flex-column flex-sm-row justify-space-between align-sm-center">

            <!-- Order Info -->
            <div>
              <div class="text-subtitle-1 font-weight-bold color-primary">
                Order #{{ order.id }}
              </div>
              <div class="text-caption text-grey">
                Made on: {{ order.date }}
              </div>
              <div class="text-body-2 mt-1">
                Products ordered: <strong>{{ order.itemsCount }} pieces</strong>
              </div>
            </div>

            <!-- Price and Tracking Button -->
            <div class="d-flex align-center justify-space-between justify-sm-end mt-4 mt-sm-0">
              <div class="text-h6 font-weight-bold mr-6 text-right">
                €{{ order.total.toFixed(2) }}
              </div>
              <v-btn
                color="primary"
                variant="elevated"
                rounded="md"
                prepend-icon="mdi-map-marker-distance"
                class="text-none"
                @click="openTracking(order.id)"
              >
                Track
              </v-btn>
            </div>

          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Fallback if there are no orders -->
    <v-sheet v-else class="text-center py-12 rounded-lg" border>
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-package-variant-closed-remove</v-icon>
      <p class="text-grey-darken-1">You haven't placed any orders on My Delivery Sushi yet..</p>
      <v-btn to="/" color="primary" class="mt-4 text-none">Order Now</v-btn>
    </v-sheet>

    <!-- ENCAPSULATED TRACKING MODAL -->
    <OrderTrackingModal
      v-if="isTrackingOpen"
      :is-open="isTrackingOpen"
      :order-id="selectedOrderId"
      @close="closeTracking"
    />
  </v-container>
</template>

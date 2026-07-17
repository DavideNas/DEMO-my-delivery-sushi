<script setup lang="ts">
import { ref, computed } from 'vue'
import { useMenuStore, type MenuItem } from '@/stores/menu'

const menuStore = useMenuStore()

// We read responsive data from the global store
const menuItems = computed(() => menuStore.items)

// Let's define the columns of the Enterprise Table
const headers = [
  { title: 'Snap', key: 'image', sortable: false, width: '80px' },
  { title: 'Dish Name', key: 'name', sortable: true },
  { title: 'Category', key: 'category', sortable: true, width: '130px' },
  { title: 'Price (€)', key: 'price', sortable: true, width: '130px' },
  { title: 'Availability', key: 'available', sortable: false, width: '150px' },
  { title: 'Actions', key: 'actions', sortable: false, width: '100px' },
]

// UI Control States
const search = ref('')
const isCreateDialogOpen = ref(false)
const isDeleteDialogOpen = ref(false)
const itemToDelete = ref<MenuItem | null>(null)

// Status for the new dish
const newItem = ref({
  name: '',
  category: 'uramaki',
  price: 0,
  description: '',
  image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500', // Standard fallback image
  available: true
})

const categories = ['nigiri', 'uramaki', 'temaki', 'poke', 'drinks']

// CRUD Methods (Mock)
const saveNewItem = () => {
  if (!newItem.value.name || newItem.value.price <= 0) return
  
  // 2. Passiamo i dati puliti all'azione dello store. Ci pensa lo store a calcolare l'ID stringa!
  menuStore.addItem({
    name: newItem.value.name,
    category: newItem.value.category,
    price: Number(newItem.value.price),
    description: newItem.value.description,
    image: newItem.value.image,
    available: newItem.value.available
  })
  
  // Reset form and modal closure
  newItem.value = { name: '', category: 'uramaki', price: 0, description: '', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500', available: true }
  isCreateDialogOpen.value = false
}

const confirmDelete = (item: MenuItem) => {
  itemToDelete.value = item
  isDeleteDialogOpen.value = true
}

const deleteItem = () => {
  if (!itemToDelete.value) return

  // 3. We call the store delete action by passing the string ID
  menuStore.deleteItem(itemToDelete.value.id)

  isDeleteDialogOpen.value = false
  itemToDelete.value = null
}
</script>

<template>
  <v-card class="pa-4 elevation-1 rounded-lg">
    <!-- Table header with title and controls -->
    <v-card-title class="d-flex flex-wrap justify-space-between align-center gap-4 px-2 py-3">
      <div>
        <h2 class="text-h5 font-weight-bold">Sushi Menu Management</h2>
        <p class="text-caption text-medium-emphasis">Edit prices inline or change availability instantly</p>
      </div>
      
      <div class="d-flex align-center gap-3 style-controls">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Cerca piatto..."
          variant="outlined"
          density="compact"
          hide-details
          flat
          style="max-width: 260px; min-width: 200px;"
        ></v-text-field>

        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          class="text-none"
          @click="isCreateDialogOpen = true"
        >
          New Dish
        </v-btn>
      </div>
    </v-card-title>

    <v-divider class="mb-4"></v-divider>

    <!-- ENTERPRISE DATA TABLE -->
    <v-data-table
      :headers="headers"
      :items="menuItems"
      :search="search"
      hover
      class="border rounded-lg"
      density="comfortable"
    >
      <!-- Slot to preview the dish image -->
      <template #[`item.image`]="{ item }">
        <v-avatar size="40" rounded="lg" class="my-1 border">
          <v-img :src="item.image" cover></v-img>
        </v-avatar>
      </template>

      <!-- Stylized tag for the category (makes everything "cleaner") -->
      <template #[`item.category`]="{ item }">
        <v-chip size="small" variant="tonal" class="text-capitalize">
          {{ item.category }}
        </v-chip>
      </template>

      <!-- INLINE EDITING: Change prices on the fly -->
      <template #[`item.price`]="{ item }">
        <v-text-field
          v-model.number="item.price"
          type="number"
          prefix="€"
          step="0.5"
          density="compact"
          variant="underlined"
          hide-details
          class="pt-0 mt-0 price-inline-input"
          style="max-width: 80px;"
        ></v-text-field>
      </template>

      <!-- INLINE EDITING: Toggle immediate availability -->
      <template #[`item.available`]="{ item }">
        <v-switch
          v-model="item.available"
          :color="item.available ? 'success' : 'error'"
          density="compact"
          hide-details
          inset
        ></v-switch>
      </template>

      <!-- Elimination actions -->
      <template #[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-trash-can-outline"
          variant="text"
          color="error"
          density="comfortable"
          @click="confirmDelete(item)"
        ></v-btn>
      </template>
    </v-data-table>

    <!-- NEW DISH CREATION MODAL -->
    <v-dialog v-model="isCreateDialogOpen" max-width="500">
      <v-card class="pa-4 rounded-lg">
        <v-card-title class="text-h6 font-weight-bold">Add Dish to Menu</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveNewItem">
            <v-text-field
              v-model="newItem.name"
              label="Name of the dish"
              variant="outlined"
              required
              class="mb-2"
            ></v-text-field>

            <v-select
              v-model="newItem.category"
              :items="categories"
              label="Category"
              variant="outlined"
              class="text-capitalize mb-2"
            ></v-select>

            <v-text-field
              v-model.number="newItem.price"
              label="Selling price (€)"
              type="number"
              step="0.1"
              variant="outlined"
              required
              class="mb-2"
            ></v-text-field>

            <v-textarea
              v-model="newItem.description"
              label="Description"
              variant="outlined"
              rows="3"
              class="mb-4"
            ></v-textarea>
            
            <v-card-actions class="px-0 pb-0">
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="isCreateDialogOpen = false">Annulla</v-btn>
              <v-btn color="primary" variant="elevated" type="submit" :disabled="!newItem.name || newItem.price <= 0">Salva</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- CANCELLATION CONFIRMATION MODAL -->
    <v-dialog v-model="isDeleteDialogOpen" max-width="400">
      <v-card class="pa-3 text-center">
        <v-card-text class="pt-4">
          <v-icon color="error" size="48" class="mb-2">mdi-alert-circle-outline</v-icon>
          <h3 class="text-h6 font-weight-bold mb-1">Do you confirm the deletion?</h3>
          <p class="text-body-2 text-medium-emphasis">
            You are about to permanently remove <strong>{{ itemToDelete?.name }}</strong> from menu.
          </p>
        </v-card-text>
        <v-card-actions class="justify-center pb-4">
          <v-btn variant="outlined" @click="isDeleteDialogOpen = false">Annulla</v-btn>
          <v-btn color="error" variant="elevated" @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.gap-4 { gap: 1rem; }
.gap-3 { gap: 0.75rem; }
.style-controls {
  flex-grow: 1;
  justify-content: flex-end;
}
:deep(.price-inline-input input) {
  text-align: right;
  padding-right: 4px;
}
</style>
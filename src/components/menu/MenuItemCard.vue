<script setup lang="ts">
import type { MenuItem } from '@/types/menu'

defineProps<{
  item: MenuItem
}>()

const emit = defineEmits<{
  (e: 'add-to-cart', item: MenuItem): void
}>()
</script>

<template>
  <!-- Applichiamo una transizione fluida e la classe 'disabled-card' se il sushi non è disponibile -->
  <v-card 
    class="sushi-card d-flex flex-column h-100 w-100" 
    :class="{ 'disabled-card': !item.available }"
    elevation="1"
    rounded="lg"
  >
    <!-- Immagine pulita senza overlay di testo -->
    <v-img
      :src="item.image"
      height="180px"
      cover
      class="bg-grey-lighten-2"
    >
      <!-- Badge "Esaurito" se il prodotto non è disponibile -->
      <template v-if="!item.available">
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-chip color="error" variant="elevated" class="font-weight-bold text-uppercase">
            Esaurito
          </v-chip>
        </v-row>
      </template>
    </v-img>

    <!-- Contenuto informativo con ottima gerarchia visiva -->
    <v-card-item class="pt-4 flex-grow-1">
      <div class="d-flex justify-space-between align-start mb-2">
        <!-- Il titolo ora ha spazio per andare a capo se necessario (no troncamento brutto) -->
        <h3 class="text-subtitle-1 font-weight-bold text-grey-darken-4 line-clamp-2">
          {{ item.name }}
        </h3>
        <!-- Prezzo ben visibile -->
        <span class="text-subtitle-1 font-weight-bold text-primary ml-2">
          {{ item.price.toFixed(2) }}€
        </span>
      </div>
      
      <!-- Descrizione con altezza minima per tenere allineate le card -->
      <p class="text-body-2 text-grey-darken-1 description-text">
        {{ item.description }}
      </p>
    </v-card-item>

    <!-- Azioni: Pulsante flessibile e responsivo -->
    <v-card-actions class="px-4 pb-4 pt-0">
      <v-btn
        :disabled="!item.available"
        color="primary"
        variant="flat"
        block
        rounded="md"
        :prepend-icon="item.available ? 'mdi-cart-plus' : 'mdi-alert-circle-outline'"
        class="font-weight-bold text-none add-to-cart-btn"
        data-test="add-to-cart-btn"
        @click="emit('add-to-cart', item)"
      >
        <!-- Il testo cambia dinamicamente in base alla disponibilità -->
        {{ item.available ? 'Aggiungi' : 'Non disponibile' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
/* Effetto hover elegante sulla card */
.sushi-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid #eeeeee !important;
}

.sushi-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
}

/* Forza la descrizione a non superare le 3 righe per mantenere le card allineate */
.description-text {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  min-height: 60px; /* Altezza minima per mantenere i pulsanti allineati */
}

/* Stile per i piatti esauriti */
.disabled-card {
  border-color: #e0e0e0 !important;
}
.disabled-card :deep(.v-img) {
  filter: grayscale(0.8) opacity(0.7);
}

/* Risolve il problema del testo del bottone che esce fuori */
.add-to-cart-btn {
  letter-spacing: 0.5px;
}
</style>
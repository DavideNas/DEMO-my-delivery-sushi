<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import LoginModal from '@/components/auth/LoginModal.vue'

const router = useRouter()
const route = useRoute()

// Nella pagina dedicata il modale è sempre aperto
const isAlwaysOpen = ref(true)

const handleRedirect = () => {
  const redirectPath = (route.query.redirect as string) || '/'
  router.push(redirectPath)
}
</script>

<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <!-- Il modale si aprirà sopra lo sfondo grigio e reindirizzerà l'utente a buon fine -->
    <LoginModal 
      v-model="isAlwaysOpen" 
      @success="handleRedirect" 
    />
  </v-container>
</template>
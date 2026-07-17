<template>
  <v-container class="fill-height d-flex align-center justify-center">
    <v-card class="pa-6 text-center elevation-2" max-width="500">
      <v-icon color="error" size="64" class="mb-4">mdi-shield-alert</v-icon>
      
      <h1 class="text-h4 font-weight-bold mb-2">Accesso Negato</h1>
      
      <p class="text-body-1 text-medium-emphasis mb-6">
        Spiacenti, non hai le autorizzazioni necessarie per visualizzare questa pagina. 
        Se ritieni sia un errore, contatta l'amministratore.
      </p>

      <v-btn color="primary" to="/" variant="elevated" prepend-icon="mdi-home">
        Torna alla Home
      </v-btn>
    </v-card>
  </v-container>
</template>
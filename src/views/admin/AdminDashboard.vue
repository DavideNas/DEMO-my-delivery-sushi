<script setup lang="ts">
import AdminMenuTable from '@/components/admin/AdminMenuTable.vue'
</script>

<template>
  <v-container class="py-8">
    <!-- Global Dashboard Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center">
          <v-icon color="primary" size="36" class="mr-3">mdi-shield-check-outline</v-icon>
          <div>
            <h1 class="text-h4 font-weight-black">Administrator Panel</h1>
            <p class="text-body-2 text-medium-emphasis">Welcome to the My Delivery Sushi control console</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- CRUD Management Table -->
    <v-row>
      <v-col cols="12">
        <AdminMenuTable />
      </v-col>
    </v-row>
  </v-container>
</template>
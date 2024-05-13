<template>
  <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.transition.timeout"
    :transition="snackbar.transition.type">
    <v-icon :icon="snackbar.icon" />
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script lang="ts" setup>
import useNotification from '../stores/notification';
const notification = useNotification()
const snackbar = notification.$state
</script>

<template>
    <h2  class="py-2 font-bold text-xl md:text-center mb-6 text-light-blue-darken-4">
      {{ title }}
    </h2>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string
  }>();
  </script>
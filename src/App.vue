<template lang="pug">
.d-flex.flex-column.h-100
  main.flex-shrink-0
    .container
      main-title
      app-cards
  footer-credits

</template>

<script setup>
import MainTitle from './components/MainTitle.vue';
import AppCards from './components/AppCards.vue';
import FooterCredits from './components/FooterCredits.vue';
</script>

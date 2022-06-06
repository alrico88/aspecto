<template lang="pug">
.d-flex.vh-100.flex-column
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

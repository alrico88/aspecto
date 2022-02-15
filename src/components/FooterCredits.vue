<template lang="pug">
footer.mt-auto.p-4
  .container
    .row
      .col
        .d-flex.justify-content-between.align-items-center
          .text-black-50 Made by #[a.text-black(:href="siteLink", target="_blank") Alberto Rico]
          a.text-black-50.hover-black(
            :href="repoLink",
            target="_blank"
          )
            .visually-hidden Github
            gh-icon
</template>

<script setup>
import GhIcon from './GhIcon.vue';

const repoLink = 'https://github.com/alrico88/aspecto';
const siteLink = 'https://alrico.es';
</script>

<style lang="scss" scoped>
.hover-black:hover {
  color: black !important;
}
</style>

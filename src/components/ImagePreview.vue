<template lang="pug">
.limited-height.w-100
  .d-flex.h-100.align-items-center.justify-content-center
    img(:src="image")
  small.d-block.text-truncate(:title="filename") {{ filename }}
</template>

<script setup>
const props = defineProps({
  image: String,
  filename: String,
});
</script>

<style lang="scss" scoped>
.limited-height {
  width: 100%;
  height: 200px;

  img {
    max-height: 100%;
    max-width: 100%;
    width: auto;
  }
}
</style>

<template lang='pug'>
.hstack.gap-2
  .fw-bold Resolution presets
  ul.list-unstyled.list-inline.mb-0
    li.list-inline-item(v-for="preset of presets", :key="title")
      button.btn.btn-link.p-0.text-dark(@click="setPreset(preset.width, preset.height)") {{ preset.title }}
</template>

<script setup>
const presets = [
  {
    title: '8K',
    width: 7680,
    height: 4320,
  },
  {
    title: '4K',
    width: 3840,
    height: 2160,
  },
  {
    title: 'QHD',
    width: 2560,
    height: 1440,
  },
  {
    title: 'FHD',
    width: 1920,
    height: 1080,
  },
  {
    title: 'SD',
    width: 1280,
    height: 720,
  },
];

const emit = defineEmits(['set-preset']);

function setPreset(w, h) {
  emit('set-preset', w, h);
}
</script>

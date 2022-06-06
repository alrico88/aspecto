<template lang='pug'>
.hstack.gap-2
  .fw-bold Size presets
  ul.list-unstyled.list-inline.mb-0
    li.list-inline-item(v-for="preset of presets", :key="preset")
      button.btn.btn-link.p-0.text-dark(@click="setPreset(preset)", :disabled="!enabled") {{ preset }}%
</template>

<script setup>
const presets = [200, 150, 75, 50, 25];

const props = defineProps({
  enabled: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['set-preset']);

function setPreset(percentage) {
  emit('set-preset', percentage);
}
</script>

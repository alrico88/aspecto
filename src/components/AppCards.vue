<template lang="pug">
.row.row-cols-md-2.row-cols-1.py-3.g-4
  .col
    .card.h-100.mb-2(
      @dragover.prevent="setIsDragged",
      @dragleave.prevent="setUndragged",
      :class="{drag: dragged}",
      @drop.prevent="handleDrop"
    )
      .card-body.p-4
        .hstack.gap-2.justify-content-between.align-items-center.pt-3.pb-4
          h5.mb-0.card-title Original dimensions #[small (px.)]
          a.text-danger(
            href="#",
            role="button",
            v-show="hasOriginalImage",
            @click.prevent="removeImage"
          ) Remove image
        .d-flex.text-center.p-4.border.mb-4.rounded.align-items-center.bg-light(v-if="hasOriginalImage")
          image-preview(:image="originalImg.image", :filename="originalImg.filename")
        form(@submit.prevent)
          .form-group
            label(for="iWidth") Width
            input.form-control(
              type="number",
              id="iWidth",
              v-model="input.width",
              :disabled="hasOriginalImage",
              :min="0"
            )
          .form-group
            label(for="iHeight") Height
            input.form-control(
              type="number",
              id="iHeight",
              v-model="input.height",
              :disabled="hasOriginalImage",
              :min="0"
            )
        small.d-block.text-success(v-if="hasOriginalImage") Image loaded
        template(v-else)
          small.d-block(v-if="!dragged") Drag image or enter dimensions
          small.d-block(v-else) Drop image to get dimensions
        small.d-block.text-danger(v-if="errorMsg") {{ errorMsg }}
    resolutions-presets(@set-preset="setResolutionPreset")
  .col
    .card.h-100.mb-2
      .card-body.p-4
        .hstack.gap-2.justify-content-between.align-items-center.pt-3.pb-4
          h5.mb-0.card-title Desired dimensions #[small (px.)]
          a(
            href="#",
            role="button",
            v-show="hasResizedImage",
            @click.prevent="downloadImage"
          ) Save image
        .d-flex.text-center.p-4.border.mb-4.rounded.align-items-center.bg-light(v-if="hasOriginalImage")
          image-preview(
            v-if="hasResizedImage"
            :image="resizedImg.image",
            :filename="resizedFilename"
          )
          .limited-height(v-else)
            .d-flex.align-items-center.h-100.justify-content-center
              div Please enter some dimensions
        form(@submit.prevent)
          .form-group
            label(for="dWidth") Width
            input.form-control(
              type="number",
              id="dWidth",
              :value="dWidth",
              @input="(e) => handleChange('width', e)",
              :min="0"
            )
          .form-group
            label(for="dHeight") Height
            input.form-control(
              type="number",
              id="dHeight",
              :value="dHeight",
              @input="(e) => handleChange('height', e)",
              :min="0"
            )
        .d-flex.w-100.justify-content-between.align-items-center(v-if="percentage !== null")
          small {{ percentage }}% of the original
    size-presets(:enabled="input.width !== '' && input.height !== ''", @set-preset="setSizePreset")
</template>

<script setup>

import {
  computed, reactive, ref, watch,
} from 'vue';
import { calcPercent, ruleOfThree } from 'math-helper-functions';
import { processNumber } from 'number-helper-functions';
import { readAsDataURL } from 'promise-file-reader';
import { saveAs } from 'file-saver';
import {
  base64ToImage, canvasToBlob, imageToCanvas, readImageDimensions,
} from '../helpers/image';
import { useImage } from '../composables/useImage';
import ImagePreview from './ImagePreview.vue';
import ResolutionsPresets from './ResolutionsPresets.vue';
import SizePresets from './SizePresets.vue';

const errorMsg = ref(null);

const input = reactive({
  width: '',
  height: '',
});

const dWidth = ref('');
const dHeight = ref('');
const percentage = ref(null);

function resetOriginalInputs() {
  input.width = '';
  input.height = '';
}

function resetDestInputs() {
  dWidth.value = '';
  dHeight.value = '';
  percentage.value = null;
}

watch(input, resetDestInputs);

const { image: originalImg, imageLoaded: hasOriginalImage } = useImage();
const { image: resizedImg, imageLoaded: hasResizedImage } = useImage();
const resizedFilename = computed(() => `${originalImg.filename}_resized_${dWidth.value}x${dHeight.value}`);

const handleChange = async (emitter, event) => {
  const val = event.target.value;
  const isEmpty = val === '';

  if (isEmpty) {
    resetDestInputs();

    return;
  }

  if (emitter === 'width') {
    dWidth.value = val;
    percentage.value = processNumber(calcPercent(dWidth.value, input.width));
    dHeight.value = Math.floor(ruleOfThree(input.width, dWidth.value, input.height));
  } else {
    dHeight.value = val;
    percentage.value = processNumber(calcPercent(dHeight.value, input.height));
    dWidth.value = Math.floor(ruleOfThree(input.height, dHeight.value, input.width));
  }
};

watch([dWidth, dHeight, hasOriginalImage], async ([w, h, run]) => {
  if (run && w !== '' && h !== '') {
    const img = await base64ToImage(originalImg.image);
    img.width = w;
    img.height = h;
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    const asBase64 = canvas.toDataURL('image/png');
    resizedImg.image = asBase64;
    resizedImg.filename = originalImg.filename;
  } else {
    resizedImg.image = '';
  }
});

const dragged = ref(false);
const setIsDragged = () => { dragged.value = true; };
const setUndragged = () => { dragged.value = false; };
const handleDrop = async (e) => {
  try {
    const file = e.dataTransfer.files[0];
    const base64 = await readAsDataURL(file);
    const img = await base64ToImage(base64);
    const { width, height } = readImageDimensions(img);

    originalImg.image = base64;
    originalImg.filename = file.name;
    input.width = width;
    input.height = height;
    dragged.value = false;
  } catch (err) {
    errorMsg.value = 'Unsupported image';

    setTimeout(() => {
      errorMsg.value = null;
    }, 5000);
    console.error(err);
  }
};

async function downloadImage() {
  const img = await base64ToImage(resizedImg.image);
  const asCanvas = imageToCanvas(img);
  const asBlob = await canvasToBlob(asCanvas);

  saveAs(asBlob, resizedImg.filename, 'image/png');
}

function removeImage() {
  resetOriginalInputs();
  originalImg.image = '';
}

function setResolutionPreset(width, height) {
  input.width = width;
  input.height = height;
}

function setSizePreset(percent) {
  handleChange('width', {
    target: {
      value: ruleOfThree(100, input.width, percent),
    },
  });
}
</script>

<style lang="scss" scoped>
.limited-height {
  width: 100%;
  height: 200px;
}
</style>

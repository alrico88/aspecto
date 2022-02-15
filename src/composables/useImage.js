import { reactive, computed } from 'vue';

export function useImage() {
  const image = reactive({
    image: '',
    filename: '',
  });

  const imageLoaded = computed(() => image.image !== '');

  return {
    image,
    imageLoaded,
  };
}

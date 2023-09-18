import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useLoading = defineStore("loading-store", () => {
  const loading = ref<boolean>();

  async function setLoading(payload: boolean): Promise<void> {
    loading.value = payload;
  }

  function setLoadingSync(payload: boolean): void {
    loading.value = payload;
  }

  const getLoading = computed(() => {
    return loading.value;
  });

  return { loading, getLoading, setLoading, setLoadingSync };
});

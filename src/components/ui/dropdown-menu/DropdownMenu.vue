<script setup lang="ts">
import { computed } from 'vue'
import { DropdownMenuRoot, type DropdownMenuRootEmits, type DropdownMenuRootProps, useForwardPropsEmits } from 'radix-vue'

const props = defineProps<DropdownMenuRootProps & { class?: string }>()
const emits = defineEmits<DropdownMenuRootEmits>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props
  return delegated
})

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <DropdownMenuRoot v-bind="forwarded" :class="props.class">
    <slot />
  </DropdownMenuRoot>
</template>

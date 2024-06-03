<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import { List } from 'lucide-vue-next';
  
</script>

<template>
  <div class="home-page suit-theme-reverse h-auto w-full custom-style p-6">
    <h1 class="text-xl flex items-center mb-4"><span class="online w-3 h-3 bg-green-400 rounded-full mr-2"></span> 26 haydovchilar</h1>
    <Button class="suit-theme w-full"><List class="mr-2"/> Buyurtmalar</Button>
  </div>
</template>
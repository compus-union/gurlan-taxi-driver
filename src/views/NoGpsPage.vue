<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGpsDetector } from '@/composables/useGpsDetector'
import { toast } from 'vue-sonner'
import { useRouterHistory } from '@/composables/useRouterHistory'
import { Button } from '@/components/ui/button'
import CatSad from '@/components/custom-illustrations/CatSad.vue'

const router = useRouter()
const gpsDetector = useGpsDetector()
const { hasPreviousPage } = useRouterHistory()

const loading = ref(false)

const checkGps = async () => {
	try {
		loading.value = true
		const result = await gpsDetector.checkGPSStatus()
		if (result === 'disabled') {
			toast("GPS bilan aloqa yo'q")
		} else if (result === 'enabled') {
			if (hasPreviousPage.value) {
				router.go(-1)
				return
			}
			await router.push('/home')
		}
	} catch (error: any) {
		toast(error.message || error || "Xatolik yuzaga keldi, boshqatdan urinib ko'ring")
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="no-internet flex flex-col items-center justify-center h-screen px-6">
		<CatSad class="w-full my-6"/>	
		<h1 class="text-center font-bold text-4xl">GPS bilan aloqa mavjud emas</h1>
		<Button :disabled="loading" @click="checkGps" class="suit-theme my-8">Tekshirish</Button>
	</div>
</template>

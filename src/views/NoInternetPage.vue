<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Network } from '@capacitor/network'
import { useRouterHistory } from '@/composables/useRouterHistory'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import CatSad from '@/components/custom-illustrations/CatSad.vue'

const router = useRouter()
const { hasPreviousPage } = useRouterHistory()

const loading = ref(false)

Network.addListener('networkStatusChange', async status => {
	if (status.connected) {
		if (hasPreviousPage.value) {
			router.go(-1)
			return
		}

		await router.push('/home')
	}
})

const checkNetworkStatus = async () => {
	try {
		loading.value = true
		const status = await Network.getStatus()

		if (status.connected) {
			if (hasPreviousPage.value) {
				router.go(-1)
				return
			}

			await router.push('/home')
		} else {
			toast('Internet bilan aloqa mavjud emas')
		}
	} catch (error: any) {
		toast(error.message || "Xatolik yuzaga keldi, boshqatdan urinib ko'ring")
	} finally {
		loading.value = false
	}
}
</script>

<template>
	<div class="no-internet flex flex-col items-center justify-center">
		<CatSad class="w-full my-6" />
		<h1 class="text-center font-bold text-4xl">Internet Aloqasi mavjud emas</h1>
		<Button @click="checkNetworkStatus" :disabled="loading">Tekshirish</Button>
	</div>
</template>

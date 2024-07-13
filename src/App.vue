<script setup lang="ts">
import { onMounted, watch, toRefs } from 'vue'
import { Toaster, toast } from 'vue-sonner'
import { PageTransition } from 'vue3-page-transition'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { useSocket } from './stores/socket'
import { Preferences } from '@capacitor/preferences'
import { useAuth } from './stores/auth'
import { useGpsDetector } from '@/composables/useGpsDetector'
import { useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const socketStore = useSocket()
const authStore = useAuth()
const gpsDetector = useGpsDetector()

const { state } = storeToRefs(socketStore)

const check = async () => {
	const { value: oneId } = await Preferences.get({ key: 'driverOneId' })
	const { value: token } = await Preferences.get({ key: 'auth_token' })

	await authStore.checkIfLoggedIn({
		oneId: oneId as string,
		token: token as string,
	})

	return
}
onMounted(async () => {
	try {
		await check()
	} catch (error: any) {
		toast(
			error ||
				error.response.data.msg ||
				error.message ||
				"Ma'lumotlaringizni tekshirishda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring"
		)
	}
})
onMounted(async () => {
	try {
		if (route.meta?.layout === 'auth-layout') return
		if (!state.value.connected) {
			await socketStore.connectSocket({ loading: true })
		}
		window.addEventListener('beforeunload', async e => {
			if (state.value.connected) {
				await socketStore.disconnectSocket({ loading: false })
			}
		})
	} catch (error: any) {
		toast(
			error ||
				error.response.data.msg ||
				error.message ||
				'Faollikni yoqishda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring'
		)
	}
})
onMounted(async () => {
	const gpsResult = await gpsDetector.checkGPSStatus()
	if (gpsResult === 'disabled') {
		await router.push('/no-gps')
	}
})
</script>

<template>
	<div class="content">
		<vue3-progress-bar></vue3-progress-bar>
		<Toaster position="top-center" :duration="4000" :toast-options="{ class: 'my-toast' }" />
		<router-view v-slot="{ Component }">
			<PageTransition name="fade-in-up" appear>
				<component :is="Component" />
			</PageTransition>
		</router-view>
	</div>
</template>

<style>
.scale-slide-enter-active,
.scale-slide-leave-active {
	position: absolute;
	transition: all 0.85s ease;
}

.scale-slide-enter-from {
	left: -100%;
}

.scale-slide-enter-to {
	left: 0%;
}

.scale-slide-leave-from {
	transform: scale(1);
}

.scale-slide-leave-to {
	transform: scale(0.8);
}

.vue3-progress-bar-container .vue3-progress-bar {
	background-color: #fcdc2a !important;
	height: 5px !important;
	z-index: 9999999 !important;
}

.my-toast,
.my-toast * {
	@apply text-lg;
}
</style>

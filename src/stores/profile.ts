import { driverInstance } from '@/http'
import { Preferences } from '@capacitor/preferences'
import { loadingController } from '@ionic/vue'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { toast } from 'vue-sonner'

type StatusDriver =
	| 'ONLINE'
	| 'GOINGTOCLIENT'
	| 'WAITING'
	| 'ONTHEWAY'
	| 'BANNED'
	| 'LIMITED'
	| 'OFFLINE'
	| 'APPROVED'
	| 'IGNORED'

interface Driver {
	id: string
	oneId: string
	fullname: string
	phone: string[]
	password: string
	license: string // prava
	registration: string // mashina dokumenti
	rides: object[]
	status: StatusDriver
	type: string
	ban: object // {ban: boolean, reason: string, admin: admin_id}
	createdAt: Date
	lastOnline: Date
	account: string
	loggedIn: boolean
	deleted: boolean
	rating: number[]
	car: object
	totalEarnings: number
	earnings: object[]
}
export const useProfile = defineStore('profile-store', () => {
	const status = ref<StatusDriver>()
	const profile = ref<Driver>()

	const fullnameSplitted = computed(() => {
		const splittedFirstname = profile.value?.fullname.split(' ')[0]
		const splittedLastname = profile.value?.fullname.split(' ')[1]

		return { firstname: splittedFirstname, lastname: splittedLastname }
	})

	async function getStatus() {
		try {
			const oneId = await Preferences.get({ key: 'driverOneId' })
			const token = await Preferences.get({ key: 'auth_token' })

			if (!oneId.value) {
				toast('OneId mavjud emas, dasturni boshqatdan ishga tushiring')
				return
			}
			if (!token.value) {
				toast('Token mavjud emas, dasturni boshqatdan ishga tushiring')
				return
			}

			const response = await driverInstance.get(`/get-status/${oneId.value}`, {
				headers: { Authorization: `Bearer ${token.value}` },
			})
			if (!response) {
				toast('Internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			console.log(response)

			status.value = response.data.result
		} catch (error: any) {
			toast(error || error.response.data.msg || error.message)
		}
	}

	async function getProfile(payload: { loading?: boolean }) {
		const loading = await loadingController.create({
			message: 'Profil yuklanmoqda...',
		})
		try {
			const oneId = await Preferences.get({ key: 'driverOneId' })
			const token = await Preferences.get({ key: 'auth_token' })

			if (!oneId.value) {
				toast('OneId mavjud emas, dasturni boshqatdan ishga tushiring')
				return
			}
			if (!token.value) {
				toast('Token mavjud emas, dasturni boshqatdan ishga tushiring')
				return
			}

			if (payload.loading) {
				await loading.present()
			}

			const response = await driverInstance.get(`/get-profile/${oneId.value}`, {
				headers: { Authorization: `Bearer ${token.value}` },
			})

			if (!response) {
				toast('Internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			profile.value = response.data.profile
		} catch (error: any) {
			toast(
				error ||
					error.response.data.msg ||
					error.message ||
					'Profilni yuklashda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring'
			)
		} finally {
			if (payload.loading) {
				await loading.dismiss()
			}
		}
	}

	async function updateProfile(payload: { loading?: boolean; profile: any }) {
		const loading = await loadingController.create({
			message: 'Profil yangilanmoqda...',
		})
		try {
			const oneId = await Preferences.get({ key: 'driverOneId' })
			const token = await Preferences.get({ key: 'auth_token' })

			if (!oneId.value) {
				toast('OneId mavjud emas, dasturni boshqatdan ishga tushiring')
				return
			}
			if (!token.value) {
				toast('Token mavjud emas, dasturni boshqatdan ishga tushiring')
				return
			}

			if (payload.loading) {
				await loading.present()
			}

			const response = await driverInstance.put(`/update-profile/${oneId.value}`, {
				driver: { fullname: `${payload.profile.firstname} ${payload.profile.lastname}` },
			})

			alert(token.value)

			if (!response) {
				toast('Internet bilan aloqa mavjud emas')
				return
			}

			if (response.data.status !== 'ok') {
				toast(response.data.msg)
				return
			}

			profile.value = response.data.profile
			toast(response.data.msg)
		} catch (error: any) {
			console.log(error)
			toast(
				error ||
					error.response.data.msg ||
					error.message ||
					'Profilni yuklashda xatolik yuzaga keldi, dasturni boshqatdan ishga tushiring'
			)
		} finally {
			if (payload.loading) {
				await loading.dismiss()
			}
		}
	}

	async function changeStatus(payload: StatusDriver) {
		status.value = payload
	}

	return {
		status,
		getStatus,
		changeStatus,
		getProfile,
		profile,
		fullnameSplitted,
		updateProfile,
	}
})

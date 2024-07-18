import { ref } from 'vue'
import { Geolocation } from '@capacitor/geolocation'

export const useGpsDetector = () => {
	const locationStatus = ref<'enabled' | 'disabled' | 'pending'>()

	const checkGPSStatus = async (): Promise<'enabled' | 'disabled'> => {
		try {
			const result = await Geolocation.getCurrentPosition()
			locationStatus.value = 'enabled'
			return 'enabled'
		} catch (error: any) {
			// alert(JSON.stringify(error))
			locationStatus.value = 'disabled'
			return 'disabled'
		}
	}

	return { locationStatus, checkGPSStatus }
}

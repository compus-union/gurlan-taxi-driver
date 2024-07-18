import axios from 'axios'
import config from '@/config'
import { useLoading } from '@/stores/loading'
import { Preferences } from '@capacitor/preferences'
import { ref } from 'vue'

const token = ref('')

// Function to get the token from Capacitor Preferences
const getToken = async () => {
	const { value } = await Preferences.get({ key: 'auth_token' })
	token.value = value as string
}

export const driverInstance = axios.create({
	baseURL: config.SERVER_URL + '/driver',
})

// Add a request interceptor to set the Authorization header
driverInstance.interceptors.request.use(
	async function (config) {
		// Ensure token is fetched before making the request
		if (!token.value) {
			await getToken()
		}
		if (token.value) {
			config.headers.Authorization = `Bearer ${token.value}`
		}

		// Set loading state
		const loadingStore = useLoading()
		await loadingStore.setLoading(true)
		return config
	},
	async function (error) {
		// Handle request error
		const loadingStore = useLoading()
		await loadingStore.setLoading(false)
		return Promise.reject(error)
	}
)

// Add a response interceptor to manage loading state
driverInstance.interceptors.response.use(
	async function (response) {
		// Handle response success
		const loadingStore = useLoading()
		await loadingStore.setLoading(false)
		return response
	},
	async function (error) {
		// Handle response error
		const loadingStore = useLoading()
		await loadingStore.setLoading(false)
		return Promise.reject(error)
	}
)

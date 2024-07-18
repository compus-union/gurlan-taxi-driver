import { ref, onMounted } from 'vue'

export function useRouterHistory() {
	const hasPreviousPage = ref(false)

	const checkForPreviousPage = async () => {
		hasPreviousPage.value = window.history.length > 1
	}

	onMounted(() => {
		checkForPreviousPage()
	})

	return {
		hasPreviousPage,
		checkForPreviousPage,
	}
}

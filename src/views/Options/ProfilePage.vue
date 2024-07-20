<script setup lang="ts">
import { useProfile } from '../../stores/profile'
import { computed, ref, onBeforeMount } from 'vue'
import { storeToRefs } from 'pinia'
import { Button } from '@/components/ui/button'
import { ArrowLeft, RefreshCcw, Star, Phone, Pencil, CheckCheck, Wallet } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogClose,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import router from '@/router'
import { Separator } from '@/components/ui/separator'

const profileStore = useProfile()
const { profile, fullnameSplitted } = storeToRefs(profileStore)

const goBack = async () => {
	router.go(-1)
}

const newProfileToUpdate = ref({
	firstname: '',
	lastname: '',
	card: ""
})

const buttonDisabled = computed(() => {
	if (newProfileToUpdate.value.firstname || newProfileToUpdate.value.lastname) {
		return false
	}

	return true
})

const saveCreditButtonDisabled = computed(() => {
	return false
})

const updatePersonalInfo = async () => {
	await profileStore.updateProfile({
		loading: true,
		profile: {
			fullname: newProfileToUpdate.value.firstname + ' ' + newProfileToUpdate.value.lastname,
		},
	})
}

onBeforeMount(async () => {
	await profileStore.getProfile({ loading: true })
})
</script>

<template>
	<div class="profile-page h-full w-full bg-primary-foreground px-2">
		<div class="header flex items-center justify-between">
			<div class="goback flex items-center space-x-2">
				<Button @click="goBack" variant="ghost" size="icon"><ArrowLeft /></Button>
				<p class="font-semibold text-lg">Profil</p>
			</div>
			<Button
				@click="profileStore.getProfile({ loading: true })"
				class="justify-self-end"
				variant="ghost"
				><RefreshCcw class="w-5 h-5 mr-2" /> Yangilash</Button
			>
		</div>
		<div class="first-part h-[140px] border-b flex justify-between items-center w-full">
			<div class="left flex items-center space-x-5">
				<Avatar class="w-20 h-20">
					<AvatarImage
						:src="`https://ui-avatars.com/api/?background=FCDC2A&color=fff&name=${profile?.fullname}&format=svg`"
					/>
					<AvatarFallback>Yuklanmoqda...</AvatarFallback>
				</Avatar>
				<div class="info">
					<p class="text-sm font-bold opacity-40">{{ profile?.oneId }}</p>
					<h1 class="text-primary text-xl font-semibold">
						{{ profile?.fullname }}
					</h1>
					<p class="flex items-center opacity-40 font-poppins font-semibold">
						<Star class="w-5 h-5 mr-2" /> {{ profile?.rating }}
					</p>
				</div>
			</div>
			<div class="action">
				<Dialog>
					<DialogTrigger as-child>
						<Button size="icon"><Pencil /></Button>
					</DialogTrigger>
					<DialogContent class="rounded-lg suit-theme-reverse">
						<DialogHeader class="text-left">
							<DialogTitle class="text-xl font-poppins font-bold">Yangilash</DialogTitle>
							<DialogDescription class="text-base">
								Tugatganingizdan keyin "Saqlash" tugmasini bosing
							</DialogDescription>
						</DialogHeader>
						<div class="flex flex-col py-4 space-y-4">
							<div class="flex flex-col items-start">
								<Label for="firstName" class="text-right text-lg font-bold"> Ism </Label>
								<Input
									autocomplete="off"
									v-model:model-value="newProfileToUpdate.firstname"
									id="firstName"
									class="py-6 text-lg"
									:placeholder="fullnameSplitted.firstname"
								/>
							</div>

							<div class="flex flex-col items-start">
								<Label for="lastName" class="text-right text-lg font-bold"> Familiya </Label>
								<Input
									autocomplete="off"
									v-model:model-value="newProfileToUpdate.lastname"
									id="lastName"
									class="py-6 text-lg"
									:placeholder="fullnameSplitted.lastname"
								/>
							</div>
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button
									:disabled="buttonDisabled"
									class="py-6 text-lg suit-theme"
									@click="updatePersonalInfo"
								>
									Saqlash
								</Button>
							</DialogClose>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
		<div class="middle">
			<div class="account py-4 section flex justify-between items-center">
				<div class="left mr-5">
					<p class="title flex items-center font-bold text-xl mb-2">
						<Wallet class="w-6 h-6 mr-2" /> Hisobingiz
					</p>
					<p class="opacity-50">
						Har bir yakunlangan buyurtma uchun hisobingizdan 1,200 so’m ayriladi
					</p>
				</div>
				<div class="right">
					<h1 class="text-primary font-poppins font-bold text-2xl text-nowrap">
						{{ !profile?.account ? '0' : profile.account }} so'm
					</h1>
				</div>
			</div>
			<Separator />
			<div class="phone py-4 section flex flex-col justify-between items-start">
				<div class="top mr-5">
					<p class="title flex items-center font-bold text-xl mb-2">
						<Phone class="w-6 h-6 mr-2" /> Telefon raqamlaringiz
					</p>
				</div>
				<div class="bottom w-full flex flex-col">
					<div v-if="profile" class="form-group w-full flex flex-col">
						<Input
							v-model:model-value="newProfileToUpdate.card"
							autocomplete="off"
							class="w-full"
							:placeholder="profile.phone[0]"
						/>
					</div>
					<Button :disabled="saveCreditButtonDisabled" class="self-end mt-4 suit-theme"
						><CheckCheck class="w-5 h-5 mr-2" /> Saqlash</Button
					>
				</div>
			</div>
			<div class="divider w-full h-5 bg-gray-100"></div>
		</div>
	</div>
</template>

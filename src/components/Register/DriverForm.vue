<script setup lang="ts">
import Message from "../UI/Message.vue";
import { IonButton, IonCheckbox, IonText } from "@ionic/vue";
</script>

<template>
  <div class="driver-form container mx-auto sm:px-4 px-2">
    <Message> Iltimos, lotinchada yozing </Message>
    <form class="form border rounded p-4 mt-4">
      <IonText class="text-xl font-bold"> Haydovchi ma’lumotlari</IonText>
      <div class="groups mt-4 space-y-3">
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="fullname">Ism familiya</label>
          <input
            required
            class="border rounded w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="Sardor Aminov"
            id="fullname"
          />
        </div>
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="phone">Telefon raqamingiz</label>
          <input
            required
            class="border rounded w-full px-2 py-1 outline-none bg-transparent"
            type="text"
            placeholder="+998"
            id="phone"
          />
        </div>
        <div class="form-group flex flex-col items-start">
          <label class="mb-1" for="password">Parolingiz</label>
          <input
            required
            class="border rounded w-full px-2 py-1 outline-none bg-transparent"
            type="password"
            placeholder="*****"
            id="password"
          />
        </div>
        <div class="form-group">
          <IonCheckbox label-placement="end">Parolni ko'rsatish</IonCheckbox>
        </div>
        <IonButton class="default-btn font-bold uppercase" type="button" expand="full">Keyingisi</IonButton>
      </div>  
    </form>
  </div>
</template>

<style scoped>
.default-btn {
  color: white;
}

@media (prefers-color-scheme: dark) {
  .default-btn {
    color: black;
  }
}
</style>
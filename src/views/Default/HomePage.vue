<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import { List, PowerOff } from "lucide-vue-next";
import { useAccount } from "@/stores/account";
import { useRouter } from "vue-router";
import { useSocket } from "@/stores/socket";
import { storeToRefs } from "pinia";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const router = useRouter();
const socketStore = useSocket();

const accountStore = useAccount();

const { status } = storeToRefs(accountStore);

const pushToOptions = () => {
  router.push("/options");
};

const disconnectSocket = async () => {
  await socketStore.disconnectSocket({ loading: true });
  await router.push("/home/deactivated");
};
</script>

<template>
  <div class="home-page h-auto flex flex-col items-end">
    <AlertDialog>
      <AlertDialogTrigger as-child>
        <button class="suit-theme-reverse rounded-md p-4 w-auto mr-6 mb-4">
          <PowerOff class="w-6 h-6" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent class="suit-theme-reverse border-none">
        <AlertDialogHeader>
          <AlertDialogTitle>Ishonchingiz komilmi?</AlertDialogTitle>
          <AlertDialogDescription>
            Server bilan aloqani uzmoqchimisiz?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel class="suit-theme-reverse border py-6">Bekor qilish</AlertDialogCancel>
          <AlertDialogAction @click="disconnectSocket" class="py-6 suit-theme"
            >Ha</AlertDialogAction
          >
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <div class="main-content h-auto suit-theme-reverse w-full custom-style p-6">
      <h1 class="text-xl flex items-center mb-4">
        <span class="online w-3 h-3 bg-green-400 rounded-full mr-2"></span> 26
        haydovchilar
        {{ status }}
      </h1>
      <Button class="suit-theme w-full"
        ><List class="mr-2" /> Buyurtmalar</Button
      >
    </div>
  </div>
</template>

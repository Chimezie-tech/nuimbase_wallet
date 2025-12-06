<template>

  <div class="flex gap-3">
    <Button label="Create wallet" @click="keys.modal = true" />
    <Button label="Send" severity="secondary" @click="keys.modalSend = true" />
    <Button label="Change Pin" severity="contrast" @click="keys.modalPin = true" />

  </div>



  <!-- Create Wallet -->
  <Dialog v-model:visible="keys.modal" :header="`${keys.pinNeeded ? 'Opps! pin needed' : 'Create your wallet'}`" modal
    class="!w-[340px]">
    <CreatePin @on-hide="keys.pinNeeded = true" @on-show="keys.pinNeeded = false" />

    <form @submit.prevent="onCreateWallet" class="space-y-4" v-if="!keys.pinNeeded">
      <div class="flex flex-col gap-1">
        <label for="">PIN</label>
        <InputOtp v-model="nwForm.pin" :length="6" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Blockchain</label>
        <Select v-model="nwForm.blockchain" :options="tokens" option-label="label" option-value="key" />
      </div>

      <Button type="submit" label="Create wallet" fluid />
    </form>
  </Dialog>




  <!-- Send Token -->
  <Dialog v-model:visible="keys.modalSend" header="Send token" modal class="!w-[340px]">
    <CreatePin @on-hide="keys.pinNeeded = true" @on-show="keys.pinNeeded = false" />

    <form @submit.prevent="onSend" class="space-y-4" v-if="!keys.pinNeeded">
      <div class="flex flex-col gap-1">
        <label for="">PIN</label>
        <InputOtp v-model="stForm.pin" :length="6" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Blockchain</label>
        <Select v-model="stForm.blockchain" :options="tokens" option-label="label" option-value="key" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">From address</label>
        <InputText v-model="stForm.tokenAddress" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Destination address</label>
        <InputText v-model="stForm.to" />
      </div>
      <div class="flex flex-col gap-1">
        <label for="">Amount</label>
        <InputText v-model="stForm.amount" />
      </div>

      <Button type="submit" label="Send funds" fluid />
    </form>
  </Dialog>




  <!-- Chnage PIN -->
  <Dialog v-model:visible="keys.modalPin" header="Your security PIN" modal class="!w-[340px]">
    <form @submit.prevent="onCreatePin" class="space-y-4">
      <div class="flex flex-col gap-1">
        <label for="">Old PIN</label>
        <InputOtp v-model="pinForm.oldPin" :length="6" />
      </div>

      <div class="flex flex-col gap-1">
        <label for="">New PIN</label>
        <InputOtp v-model="pinForm.newPin" :length="6" />
      </div>

      <Button type="submit" label="Create PIN" fluid />
    </form>
  </Dialog>

</template>


<script setup lang="js">
import { onMounted, reactive, ref } from 'vue';
import { Button, Dialog, InputText, InputOtp, Select } from 'primevue'
import { $POST } from '@/scripts/utils';

import CreatePin from '@/components/CreatePin.vue';

const tokens = [
  { key: 'BTC', label: 'Bitcoin' },
  { key: 'ETH', label: 'Ethereum' },
]

const keys = reactive({ modal: false, modalSend: false, modalPin: false, pinNeeded: false })

const nwForm = ref({ pin: '', blockchain: 'BTC' })
const stForm = ref({ pin: '', blockchain: 'BTC', to: '', amount: 0, tokenAddress: '' })
const pinForm = ref({ oldPin: '', newPin: '' })


const onCreateWallet = async () => {
  const body = await $POST(nwForm.value, 'wallet/create')
  console.log(body)
}


const onSend = async () => {
  const body = await $POST(stForm.value, 'transfer/send')
  console.log(body)
}



const onCreatePin = async () => {
  const body = await $POST(pinForm.value, 'pin/change')
  console.log(body)
}


const onStart = () => {


}


onMounted(() => {
  onStart()

})

</script>

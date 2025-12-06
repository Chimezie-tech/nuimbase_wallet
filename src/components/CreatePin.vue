<template>
  <div class="fle" v-if="form.show">
    <form @submit.prevent="onCreatePin" class="space-y-4">
      <div class="flex flex-col gap-1">
        <label for="">Create PIN</label>
        <InputOtp v-model="form.pin" :length="6" />
      </div>
      <Button type="submit" label="Create PIN" fluid />
    </form>
  </div>
</template>

<script setup lang="js">
import { InputOtp, Button } from 'primevue';
import { onMounted, ref } from 'vue';

import { $POST } from '@/scripts/utils';

const form = ref({ pin: '', show: false });

const emits = defineEmits(['onHide', 'onShow'])

const onCreatePin = async () => {
  console.log('creating...')
  const body = await $POST({ pin: form.value.pin }, 'pin/create')

  if (!body?.error) {
    emits('onShow')
    form.value.show = false
  }
};


const onStart = async () => {
  const body = await $POST({}, 'pin/check')
  console.log(body)

  if (!body?.hasPin) {
    form.value.show = true
    emits('onHide')
  }
};

onMounted(() => onStart());

</script>

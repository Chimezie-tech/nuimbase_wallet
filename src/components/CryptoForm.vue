<template>
    <div class="p-3">
        <p class="text-muted small">Sending to: **@{{ recipientHandle }}**</p>

        <div class="field mb-3">
            <label for="asset" class="d-block mb-1">Asset</label>
            <Dropdown
                v-model="selectedAsset"
                :options="availableAssets"
                option-label="name"
                option-value="symbol"
                placeholder="Select Crypto Asset"
                class="w-100"
            />
        </div>

        <div class="field mb-3">
            <label for="amount" class="d-block mb-1">Amount ({{ selectedAsset }})</label>
            <InputNumber
                v-model="amount"
                inputId="amount"
                mode="decimal"
                :minFractionDigits="2"
                :maxFractionDigits="8"
                class="w-100"
            />
        </div>

        <div class="field mb-4">
            <label for="pin" class="d-block mb-1">Wallet PIN</label>
            <InputText
                v-model="pin"
                type="password"
                class="w-100"
            />
        </div>

        <div class="d-flex justify-content-end">
            <Button
                label="Cancel"
                icon="pi pi-times"
                @click="$emit('close')"
                class="p-button-text me-2"
            />
            <Button
                label="Confirm Send"
                icon="pi pi-wallet"
                :loading="loading"
                :disabled="!isValid"
                @click="sendPayment"
                class="p-button-warning"
            />
        </div>

        <Message v-if="successMessage" severity="success" class="mt-3">{{ successMessage }}</Message>
        <Message v-if="errorMessage" severity="error" class="mt-3">{{ errorMessage }}</Message>
    </div>
</template>

<script>
import { defineComponent, ref, computed } from 'vue';
// import walletService from '../scripts/walletServices'; // Assume this exists
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';

export default defineComponent({
  name: 'CryptoSendForm',
  components: { Dropdown, InputNumber, InputText, Button, Message },
  props: {
    recipientHandle: { type: String, required: true },
    recipientUuid: { type: String, required: true }
  },
  emits: ['payment-success', 'close'],
  setup(props, { emit }) {
    const loading = ref(false);
    const amount = ref(null);
    const selectedAsset = ref('ETH');
    const pin = ref('');
    const errorMessage = ref('');
    const successMessage = ref('');

    // Example assets - you should fetch this from your backend/wallet config
    const availableAssets = ref([
      { name: 'Ethereum', symbol: 'ETH' },
      { name: 'Bitcoin', symbol: 'BTC' },
      { name: 'Litecoin', symbol: 'LTC' }
    ]);

    const isValid = computed(() => amount.value > 0 && selectedAsset.value && pin.value.length > 3);

    const sendPayment = async () => {
      if (!isValid.value) return;

      loading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      try {
        // 1. Get Recipient Address (Assume this is linked to UUID in your customerWalletAddr table)
        const recipientAddress = await walletService.getRecipientAddress(props.recipientUuid, selectedAsset.value);
        if (!recipientAddress) throw new Error('Recipient wallet address not found.');

        // 2. Execute Transaction (Uses existing service logic)
        const txId = await walletService.executeCryptoTransfer({
            recipientAddress,
            amount: amount.value,
            asset: selectedAsset.value,
            pin: pin.value
        });

        successMessage.value = 'Payment sent successfully!';

        // 3. Notify Chat (Parent component)
        emit('payment-success', {
            txId: txId,
            amount: amount.value.toString(),
            asset: selectedAsset.value,
            type: 'crypto_tx' // Used by the chat component
        });

      } catch (e) {
        console.error('Crypto transfer failed:', e);
        errorMessage.value = e.message || 'Transaction failed. Check PIN or balance.';
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      amount,
      selectedAsset,
      pin,
      errorMessage,
      successMessage,
      availableAssets,
      isValid,
      sendPayment
    };
  }
});
</script>

<template>
  <div>
    <button
      v-if="status === 'not_connected'"
      class="btn btn-primary"
      :disabled="loading"
      @click="handleSendRequest"
    >
      <i v-if="loading" class="pi pi-spin pi-spinner me-2"></i>
      Connect
    </button>

    <div v-else-if="status === 'pending_received'" class="d-flex gap-2">
      <button
        class="btn btn-warning flex-grow-1"
        :disabled="loading"
        @click="handleAcceptRequest"
      >
        <i v-if="loading" class="pi pi-spin pi-spinner me-2"></i>
        Accept Request
      </button>
      <button
        class="btn btn-outline-secondary"
        :disabled="loading"
        @click="handleCancelRequest"
      >
        Decline
      </button>
    </div>

    <div v-else-if="status === 'pending_sent'" class="d-flex gap-2">
      <button
        class="btn btn-secondary flex-grow-1"
        :disabled="loading"
      >
        Request Sent
      </button>
      <button
        class="btn btn-outline-danger"
        :disabled="loading"
        @click="handleCancelRequest"
      >
        Cancel
      </button>
    </div>

    <button
      v-else-if="status === 'accepted'"
      class="btn btn-success"
      @click="$emit('start-chat')"
    >
      <i class="pi pi-comment me-2"></i>
      Message
    </button>

    <button
      v-else-if="status === 'blocked'"
      class="btn btn-danger"
      disabled
    >
      Blocked
    </button>

    <button
      v-else-if="status === 'loading'"
      class="btn btn-secondary"
      disabled
    >
      <i class="pi pi-spin pi-spinner me-2"></i> Loading...
    </button>

    <div v-if="errorMessage" class="text-danger mt-2 small">{{ errorMessage }}</div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import socialService from '@/scripts/socialService';

export default defineComponent({
  name: 'ConnectionButton',
  props: {
    status: {
      type: String,
      // Now expecting: 'not_connected', 'pending_sent', 'pending_received', 'accepted', 'blocked', 'loading'
      required: true
    },
    targetHandle: {
      type: String,
      required: true
    }
  },
  emits: ['update-status', 'start-chat'],
  setup(props, { emit }) {
    const loading = ref(false);
    const errorMessage = ref('');

    // Helper function to reset state and re-fetch status
    const updateStatus = () => {
      loading.value = false;
      errorMessage.value = '';
      emit('update-status');
    };

    // 1. Handles sending a new connection request
    const handleSendRequest = async () => {
      loading.value = true;
      errorMessage.value = '';
      try {
        await socialService.sendConnectionRequest(props.targetHandle);
        updateStatus();
      } catch (e) {
        errorMessage.value = e.message || 'Failed to send request.';
        loading.value = false;
      }
    };

    // 2. Handles accepting an incoming connection request
    const handleAcceptRequest = async () => {
      loading.value = true;
      errorMessage.value = '';
      try {
        await socialService.acceptConnectionRequest(props.targetHandle);
        updateStatus();
      } catch (e) {
        errorMessage.value = e.message || 'Failed to accept request.';
        loading.value = false;
      }
    };

    // 3. Handles declining an incoming request or canceling a sent request
    // NOTE: This requires adding a new `cancelConnectionRequest` function to socialService.js
    const handleCancelRequest = async () => {
      loading.value = true;
      errorMessage.value = '';
      try {
        // You will need to implement this function in your socialService.js
        await socialService.cancelConnectionRequest(props.targetHandle);
        updateStatus();
      } catch (e) {
        errorMessage.value = e.message || 'Failed to cancel/decline request.';
        loading.value = false;
      }
    };

    return {
      loading,
      errorMessage,
      handleSendRequest,
      handleAcceptRequest,
      handleCancelRequest
    };
  }
});
</script>

<template>
  <div class="chat-container card p-0 border-0 shadow-lg">
    <div class="chat-header p-3 border-bottom d-flex align-items-center bg-light">
      <i class="pi pi-arrow-left me-3 cursor-pointer" @click="$router.back()"></i>
      <div class="d-flex flex-column">
        <h5 class="mb-0">{{ targetProfile.fullName || 'Loading...' }}</h5>
        <small class="text-muted">@{{ targetHandle }}</small>
      </div>
    </div>

    <div ref="messageArea" class="chat-messages p-3 flex-grow-1">
      <div v-if="loading" class="text-center my-5">
        <i class="pi pi-spin pi-spinner text-xl"></i>
        <p class="text-muted mt-2">Loading messages...</p>
      </div>
      <div v-else-if="messages.length === 0" class="text-center my-5 text-muted">
        Start your conversation!
      </div>

      <div v-for="message in messages" :key="message.id" class="message-row mb-3">
        <div :class="['message-bubble p-2 rounded shadow-sm', message.isSender ? 'sender' : 'recipient']">
          <p v-if="message.type === 'text'" class="mb-0">{{ message.content }}</p>
          <div v-else-if="message.type === 'crypto_tx'" class="crypto-alert">
            <i class="pi pi-bolt me-2 text-warning"></i>
            <span class="fw-bold">{{ message.isSender ? 'You sent' : `${targetProfile.fullName} sent` }}:</span>
            <span class="text-success ms-1">{{ message.amount }} {{ message.asset }}</span>
            <small class="text-muted d-block mt-1">TX: {{ message.txId.substring(0, 10) }}...</small>
          </div>
        </div>
        <small class="message-timestamp text-muted d-block" :class="message.isSender ? 'text-end' : 'text-start'">
          {{ formatTime(message.createdAt) }}
        </small>
      </div>
    </div>

    <div class="chat-input p-3 border-top d-flex align-items-center bg-light">
      <InputText v-model="newMessage" placeholder="Type a message..." class="form-control me-2 flex-grow-1"
        @keyup.enter="sendMessage" />

      <Button
          icon="pi pi-send"
          :disabled="!newMessage.trim() || !isFollowed"  @click="sendMessage"
          class="p-button-success me-2"
      />
      <Button icon="pi pi-wallet" label="Send Crypto" @click="showCryptoModal = true" class="p-button-warning" />
    </div>

    <Dialog v-model="showCryptoModal" header="Send Crypto Payment" :modal="true" :style="{ width: '50vw' }">
      <CryptoSendForm :recipient-handle="targetHandle" :recipient-uuid="targetProfile.uuid"
        @payment-success="handlePaymentSuccess" @close="showCryptoModal = false" />
    </Dialog>


  </div>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import socialService from '../scripts/socialServices';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import CryptoSendForm from '../components/CryptoForm.vue'; // We define this next

export default defineComponent({
  name: 'ChatScreen',
  components: { InputText, Button, Dialog, CryptoSendForm },
  props: {
    targetHandle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const messages = ref([]);
    const newMessage = ref('');
    const targetProfile = ref({ fullName: '', uuid: '' });
    const currentCustomerUuid = ref(null);
    const loading = ref(true);
    const messageArea = ref(null); // Ref for scrolling
    const showCryptoModal = ref(false);
    let chatChannel = null; // Supabase Realtime channel
    const isFollowed = ref(false);

    // Helper to format time (you might move this to a utility file)
    const formatTime = (isoString) => {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Scrolls the message area to the bottom
    const scrollToBottom = () => {
      nextTick(() => {
        if (messageArea.value) {
          messageArea.value.scrollTop = messageArea.value.scrollHeight;
        }
      });
    };

    // ------------------------------------------
    // 1. Initial Setup & Data Fetching
    // ------------------------------------------

    const fetchInitialData = async () => {
      loading.value = true;
      try {
        const currentUser = await socialService.getCurrentUser();
        currentCustomerUuid.value = currentUser.id;

        const profileData = await socialService.getCustomerProfile(props.targetHandle);
        if (!profileData.data) throw new Error('Recipient profile not found.');
        targetProfile.value = profileData.data;

        // Following:
        isFollowed.value = await socialService.checkIfFollowing(currentCustomerUuid.value, targetProfile.value.uuid);

        // Fetch historical messages
        const { data: historicalMessages, error } = await socialService.getChatHistory(
          currentCustomerUuid.value,
          targetProfile.value.uuid
        );
        if (error) throw error;

        messages.value = historicalMessages.map(msg => ({
          ...msg,
          isSender: msg.senderId === currentCustomerUuid.value,
          // If type is crypto_tx, parse content to get amount/asset/txId
          ...(msg.messageType === 'crypto_tx' ? JSON.parse(msg.messageContent) : {})
        }));

        scrollToBottom();
      } catch (e) {
        console.error('Chat setup failed:', e);
        // Handle error display
      } finally {
        loading.value = false;
        setupRealtimeListener();
      }
    };

    // ------------------------------------------
    // 2. Realtime Listener
    // ------------------------------------------

    const setupRealtimeListener = () => {
      // Clean up previous channel if it exists
      if (chatChannel) supabase.removeChannel(chatChannel);

      // Unique channel name based on the two customer UUIDs
      const { userAId, userBId } = socialService.getCanonicalUserIds(
        currentCustomerUuid.value,
        targetProfile.value.uuid
      );
      const channelName = `chat:${userAId}_${userBId}`;

      chatChannel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chatMessages' },
          (payload) => {
            // Check if the new message is relevant to this chat
            const newMsg = payload.new;
            if ((newMsg.senderId === currentCustomerUuid.value || newMsg.senderId === targetProfile.value.uuid) &&
              (newMsg.recipientId === currentCustomerUuid.value || newMsg.recipientId === targetProfile.value.uuid)) {

              messages.value.push({
                ...newMsg,
                isSender: newMsg.senderId === currentCustomerUuid.value,
                // Parse content for crypto messages
                ...(newMsg.messageType === 'crypto_tx' ? JSON.parse(newMsg.messageContent) : {})
              });
              scrollToBottom();
            }
          }
        )
        .subscribe();
    };

    // ------------------------------------------
    // 3. Sending Messages
    // ------------------------------------------

    const sendMessage = async () => {
      if (!newMessage.value.trim() || loading.value) return;

      const content = newMessage.value.trim();
      newMessage.value = ''; // Clear input immediately

      try {
        await socialService.sendMessage({
          senderId: currentCustomerUuid.value,
          recipientId: targetProfile.value.uuid,
          content: content,
          type: 'text'
        });
      } catch (e) {
        console.error('Failed to send message:', e);
        // Implement rollback or error display
      }
    };

    // 4. Handling Crypto Payment Success
    const handlePaymentSuccess = async (paymentData) => {
      showCryptoModal.value = false;

      // Send a system message to the chat about the transaction
      await socialService.sendMessage({
        senderId: currentCustomerUuid.value,
        recipientId: targetProfile.value.uuid,
        content: JSON.stringify(paymentData), // paymentData: {txId, amount, asset}
        type: 'crypto_tx'
      });
    };

    // This is the prop that receives the 'id' parameter from the URL: /chats/:id
    // const props = defineProps({
    //   id: {
    //     type: String,
    //     required: true,
    //   },
    // });

    // Use the ID to fetch specific chat messages
    // const conversationId = props.id;
    onMounted(() => {
      fetchMessages(conversationId);
    });

    onMounted(fetchInitialData);

    onUnmounted(() => {
      if (chatChannel) {
        supabase.removeChannel(chatChannel);
      }
    });

    watch(messages, scrollToBottom, { deep: true });

    return {
      messages,
      newMessage,
      targetProfile,
      loading,
      messageArea,
      showCryptoModal,
      formatTime,
      sendMessage,
      handlePaymentSuccess
    };
  }
});
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Set a standard height for chat */
  max-width: 100px;
  margin: 0 auto;
  border-radius: 0;
}

@media (min-width: 768px) {
    .chat-container {
        height: 80vh;
        max-width: 800px;
        margin: 20px auto;
        border-radius: 8px;
    }
}
.chat-input {
    /* Ensures input area stays at the bottom and has consistent height */
    flex-shrink: 0;
}
.chat-messages {
  overflow-y: auto;
  flex-grow: 1;
  background-color: #f7f7f7;
}

.message-bubble {
  max-width: 70%;
  word-wrap: break-word;
}

.sender {
  background-color: var(--primary-color, #4CAF50);
  /* Green for sender */
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 0 !important;
}

.recipient {
  background-color: #ffffff;
  /* White/Light gray for recipient */
  color: #333;
  margin-right: auto;
  border: 1px solid #ddd;
  border-bottom-left-radius: 0 !important;
}

.crypto-alert {
  font-size: 0.9rem;
  padding: 5px;
  border-radius: 4px;
}

.message-timestamp {
  font-size: 0.7rem;
  margin-top: 2px;
}
</style>

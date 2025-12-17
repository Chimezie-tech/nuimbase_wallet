<template>
  <div class="conversations-list">
    <header class="header">
      <h2>Chats</h2>
      <button @click="startNewChat" class="new-chat-button">
        + New Chat
      </button>
    </header>

    <div v-if="loading" class="status-message">Loading conversations...</div>
    <div v-else-if="error" class="status-message error">
      Error loading chats: {{ error }}
    </div>
    <div v-else-if="conversations.length === 0" class="status-message empty">
      You have no active chats. Start a new one!
    </div>

    <ul v-else class="list">
      <li
        v-for="conv in conversations"
        :key="conv.id"
        @click="openChat(conv.id)"
        class="list-item"
      >
        <div class="avatar-container">
          <img :src="conv.partnerAvatar" alt="Partner Avatar" class="avatar" />
        </div>
        <div class="content">
          <div class="top-row">
            <span class="partner-name">{{ conv.partnerName }}</span>
            <span class="last-time">{{ formatTime(conv.lastMessageTime) }}</span>
          </div>
          <p class="last-message">
            {{ truncateMessage(conv.lastMessageText) }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Import your service for fetching chat data

const router = useRouter();
const conversations = ref([]);
const loading = ref(true);
const error = ref(null);

// --- 🎯 CORE LOGIC ---

// 1. Fetch Conversations (Mock Data for robustness)
const fetchConversations = async () => {
  loading.value = true;
  error.value = null;

  try {
    // In a real app, you would fetch from your API here:
    // const data = await tatumServices.getConversations();

    // Using Mock Data:
    const mockData = [
      {
        id: 'user123',
        partnerName: 'Alice',
        partnerAvatar: 'https://i.pravatar.cc/150?img=1',
        lastMessageText: 'The transaction is complete. Thanks!',
        lastMessageTime: Date.now() - 3600000
      },
      {
        id: 'user456',
        partnerName: 'Bob',
        partnerAvatar: 'https://i.pravatar.cc/150?img=2',
        lastMessageText: 'Can you confirm the receiving address?',
        lastMessageTime: Date.now() - 120000
      },
    ];

    conversations.value = mockData;

  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
};

// 2. Navigation to ChatScreen.vue
const openChat = (conversationId) => {
  // Use the router to navigate to the ChatScreen with the ID as a parameter
  router.push({ name: 'ChatScreen', params: { id: conversationId } });
};

// 3. Handlers
const startNewChat = () => {
  // Logic to search for a new contact or open a new chat window
  console.log('Open contact search/new chat UI');
};

// --- Helper Functions ---
const truncateMessage = (text) => {
  return text.length > 30 ? text.substring(0, 30) + '...' : text;
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(fetchConversations);
</script>

<style scoped>
/* Scoped styles for a clean, modern list view */
.conversations-list {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.new-chat-button {
  background-color: #3f51b5;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}

.status-message {
  padding: 20px;
  text-align: center;
  color: #666;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.avatar-container {
  margin-right: 15px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.content {
  flex-grow: 1;
  min-width: 0; /* Ensures content respects flex-grow */
}

.top-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.partner-name {
  font-weight: bold;
  color: #333;
}

.last-time {
  font-size: 0.8em;
  color: #999;
}

.last-message {
  margin: 0;
  font-size: 0.9em;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<template>
  <div class="card p-4 shadow-sm">
    <div class="d-flex flex-column align-items-center">
      <div class="profile-avatar mb-3">
        <i class="pi pi-user text-3xl" style="font-size: 3rem;"></i>
      </div>

      <h4 class="mb-1">{{ profile.fullName || 'Loading...' }}</h4>
      <p class="text-muted">@{{ customerHandle }}</p>

      <div class="d-flex justify-content-center gap-4 mt-3 mb-4">
        <div class="text-center">
          <h5 class="mb-0">{{ connectionCounts.following }}</h5>
          <small class="text-muted">Following</small>
        </div>
        <div class="text-center">
          <h5 class="mb-0">{{ connectionCounts.followers }}</h5>
          <small class="text-muted">Connections</small>
        </div>
      </div>

      <ConnectionButton
        v-if="profileStatus !== 'self' && profileStatus !== 'not_found'"
        :status="connectionStatus"
        :target-handle="customerHandle"
        @update-status="fetchStatusAndCounts"
        @start-chat="navigateToChat"
      />

      <div v-if="profileStatus === 'self'" class="mt-3">
        <p class="text-success">This is your profile.</p>
      </div>

    </div>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import socialService from '@/scripts/socialService';
import ConnectionButton from './ConnectionButton.vue'; // We define this next

export default defineComponent({
  name: 'UserProfileCard',
  components: { ConnectionButton },
  props: {
    customerHandle: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const profile = ref({ fullName: '', uuid: '' });
    const connectionCounts = ref({ followers: 0, following: 0 });
    const connectionStatus = ref('loading'); // Maps to ConnectionButton status
    const profileStatus = ref('loading'); // Maps to status returned by socialService (self, not_found, pending, accepted, etc.)

    // 1. Fetch Core Profile Details (Full Name)
    const fetchProfileDetails = async () => {
        try {
            // NOTE: You need a function in socialService or a general service
            // to fetch customer details by handle. We'll add a placeholder function
            // for now, but assume it fetches the full customer record.
            const { data } = await socialService.getCustomerProfile(props.customerHandle);
            if (data) {
                profile.value = data;
            } else {
                profileStatus.value = 'not_found';
            }
        } catch (e) {
            console.error('Error fetching profile details:', e);
            profileStatus.value = 'not_found';
        }
    };

    // 2. Fetch Connection Status and Counts
    const fetchStatusAndCounts = async () => {
      try {
        // Fetch the connection status for the button logic
        const statusData = await socialService.getConnectionStatus(props.customerHandle);
        connectionStatus.value = statusData.status;
        profileStatus.value = statusData.status; // For overall profile display logic

        // Fetch the symmetric connection count
        const counts = await socialService.getConnectionCounts(props.customerHandle);
        connectionCounts.value = counts;

      } catch (e) {
        console.error('Error fetching social data:', e);
      }
    };

    const navigateToChat = () => {
        // In a real application, this would use Vue Router:
        // router.push({ name: 'ChatScreen', params: { handle: props.customerHandle } });
        alert(`Navigating to chat with @${props.customerHandle}`);
    };

    // Watch for handle changes (if the user navigates between profiles)
    watch(() => props.customerHandle, () => {
      fetchProfileDetails();
      fetchStatusAndCounts();
    }, { immediate: true });

    return {
      profile,
      connectionCounts,
      connectionStatus,
      profileStatus,
      fetchStatusAndCounts,
      navigateToChat
    };
  }
});
</script>

<style scoped>
.profile-avatar {
  width: 90px;
  height: 90px;
  background-color: #f0f0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}
.card {
  max-width: 400px;
  margin: auto;
}
</style>

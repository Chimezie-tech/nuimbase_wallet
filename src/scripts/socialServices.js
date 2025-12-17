// scripts/socialService.js

import { createClient } from '@supabase/supabase-js';

// Configuration
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON);

// ------------------------------------------
// CORE HELPERS
// ------------------------------------------

/**
 * Helper function to get the current authenticated user.
 */
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  return user;
};

/**
 * Helper to determine the canonical order of user IDs for the userConnections table (userAId < userBId).
 */
const getCanonicalUserIds = (userIdA, userIdB) => {
  if (userIdA < userIdB) {
    return { userAId: userIdA, userBId: userIdB, isCurrentUserA: true };
  } else {
    return { userAId: userIdB, userBId: userIdA, isCurrentUserA: false };
  }
};

// ------------------------------------------
// PROFILE DATA
// ------------------------------------------

/**
 * Gets the basic profile data for a customer.
 * @param {string} customerHandle - The handle of the customer.
 */
const getCustomerProfile = async (customerHandle) => {
  const { data: profile, error } = await supabase
    .from('customers')
    .select('uuid, fullName, customerHandle') // Select the fields needed for the profile card
    .eq('customerHandle', customerHandle)
    .maybeSingle();

  if (error) throw error;

  return { data: profile };
};

// ------------------------------------------
// CONNECTION MANAGEMENT
// ------------------------------------------

/**
 * Sends a connection request from the current customer to a target customer.
 * @param {string} targetCustomerHandle - The handle of the customer to connect to.
 */
const sendConnectionRequest = async (targetCustomerHandle) => {
  const currentUser = await getCurrentUser();

  const { data: targetProfile, error: profileError } = await supabase
    .from('customers')
    .select('uuid')
    .eq('customerHandle', targetCustomerHandle)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!targetProfile) throw new Error(`Customer handle "${targetCustomerHandle}" not found.`);

  const targetUuid = targetProfile.uuid;
  const currentUuid = currentUser.id;

  if (targetUuid === currentUuid) throw new Error("Cannot connect to yourself.");

  const { userAId, userBId } = getCanonicalUserIds(currentUuid, targetUuid);

  const { data: existingConnection, error: checkError } = await supabase
    .from('userConnections')
    .select('*')
    .eq('userAId', userAId)
    .eq('userBId', userBId)
    .maybeSingle();

  if (checkError) throw checkError;

  if (existingConnection) {
    if (existingConnection.connectionStatus === 'accepted') {
      throw new Error('Already connected.');
    }
    if (existingConnection.connectionStatus === 'pending') {
      throw new Error('Request already pending or received.');
    }
    throw new Error('Connection status prevents a new request.');
  }

  const { error: insertError } = await supabase
    .from('userConnections')
    .insert({
      userAId,
      userBId,
      senderId: currentUuid,
      connectionStatus: 'pending'
    });

  if (insertError) throw insertError;
  return { success: true };
};

/**
 * Accepts a pending connection request.
 * @param {string} senderCustomerHandle - The handle of the customer who sent the request.
 */
const acceptConnectionRequest = async (senderCustomerHandle) => {
  const currentUser = await getCurrentUser();

  const { data: senderProfile } = await supabase
    .from('customers')
    .select('uuid')
    .eq('customerHandle', senderCustomerHandle)
    .maybeSingle();

  if (!senderProfile) throw new Error(`Sender handle "${senderCustomerHandle}" not found.`);

  const senderUuid = senderProfile.uuid;
  const currentUuid = currentUser.id;

  const { userAId, userBId } = getCanonicalUserIds(currentUuid, senderUuid);

  const { data: connection, error: updateError } = await supabase
    .from('userConnections')
    .update({ connectionStatus: 'accepted' })
    .eq('userAId', userAId)
    .eq('userBId', userBId)
    .eq('connectionStatus', 'pending')
    .select()
    .maybeSingle();

  if (updateError) throw updateError;
  if (!connection) throw new Error('No pending request found from this customer.');

  return { success: true };
};

/**
 * Cancels a pending request (sent by current customer) or declines an incoming request.
 * @param {string} targetCustomerHandle - The handle of the other customer.
 */
const cancelConnectionRequest = async (targetCustomerHandle) => {
    const currentUser = await getCurrentUser();

    const { data: targetProfile } = await supabase
      .from('customers')
      .select('uuid')
      .eq('customerHandle', targetCustomerHandle)
      .maybeSingle();

    if (!targetProfile) throw new Error(`Customer handle "${targetCustomerHandle}" not found.`);

    const targetUuid = targetProfile.uuid;
    const currentUuid = currentUser.id;

    const { userAId, userBId } = getCanonicalUserIds(currentUuid, targetUuid);

    const { error: deleteError, count } = await supabase
      .from('userConnections')
      .delete()
      .eq('userAId', userAId)
      .eq('userBId', userBId)
      .eq('connectionStatus', 'pending')
      .select({ count: 'exact' });

    if (deleteError) throw deleteError;
    if (count === 0) throw new Error('No pending connection found to delete.');

    return { success: true };
};


/**
 * Gets the current connection status and the target's UUID.
 * @param {string} targetCustomerHandle - The handle of the customer whose profile is being viewed.
 * @returns {Promise<{status: string, targetUuid: string}>}
 */
const getConnectionStatus = async (targetCustomerHandle) => {
  const currentUser = await getCurrentUser();

  const { data: targetProfile } = await supabase
    .from('customers')
    .select('uuid')
    .eq('customerHandle', targetCustomerHandle)
    .maybeSingle();

  if (!targetProfile) return { status: 'not_found' };

  const targetUuid = targetProfile.uuid;
  const currentUuid = currentUser.id;

  if (targetUuid === currentUuid) return { status: 'self' };

  const { userAId, userBId } = getCanonicalUserIds(currentUuid, targetUuid);

  const { data: connection, error } = await supabase
    .from('userConnections')
    .select('connectionStatus, senderId')
    .eq('userAId', userAId)
    .eq('userBId', userBId)
    .maybeSingle();

  if (error) throw error;

  if (!connection) {
    return { status: 'not_connected', targetUuid };
  }

  let status = connection.connectionStatus;

  if (status === 'pending') {
    if (connection.senderId === currentUuid) {
      status = 'pending_sent';
    } else {
      status = 'pending_received';
    }
  }

  return {
    status: status,
    targetUuid
  };
};

// ------------------------------------------
// CONNECTION STATS
// ------------------------------------------

/**
 * Gets the count of accepted connections for a given customer.
 * @param {string} customerHandle - The handle of the customer.
 * @returns {Promise<{followers: number, following: number}>}
 */
const getConnectionCounts = async (customerHandle) => {
  const { data: targetProfile } = await supabase
    .from('customers')
    .select('uuid')
    .eq('customerHandle', customerHandle)
    .maybeSingle();

  if (!targetProfile) return { followers: 0, following: 0 };

  const targetUuid = targetProfile.uuid;

  const { count, error } = await supabase
    .from('userConnections')
    .select('id', { count: 'exact', head: true })
    .eq('connectionStatus', 'accepted')
    .or(`userAId.eq.${targetUuid},userBId.eq.${targetUuid}`);

  if (error) {
    console.error("Error fetching connection count:", error);
    return { followers: 0, following: 0 };
  }

  return { followers: count, following: count };
};

// ------------------------------------------
// MESSAGING (NEW FUNCTIONS)
// ------------------------------------------

/**
 * Sends a new message (text or crypto transaction alert) to the chat.
 * @param {object} msgData - Message data.
 * @param {string} msgData.senderId - UUID of the sender.
 * @param {string} msgData.recipientId - UUID of the recipient.
 * @param {string} msgData.content - Message content (text or JSON string).
 * @param {string} msgData.type - 'text' or 'crypto_tx'.
 */
const sendMessage = async ({ senderId, recipientId, content, type = 'text' }) => {
    // Note: We don't use canonical IDs here because the chatMessages table
    // uses explicit senderId/recipientId columns to track message direction.

    const { error } = await supabase
        .from('chatMessages')
        .insert({
            senderId,
            recipientId,
            messageContent: content,
            messageType: type
        });

    if (error) throw error;
    return { success: true };
};

/**
 * Fetches the historical messages between two users.
 * @param {string} userAId - Current user UUID.
 * @param {string} userBId - Target user UUID.
 */
const getChatHistory = async (userAId, userBId) => {
    // Fetches messages where:
    // (sender=A AND recipient=B) OR (sender=B AND recipient=A)
    const { data, error } = await supabase
        .from('chatMessages')
        .select('id, senderId, recipientId, messageContent, messageType, createdAt')
        .or(`and(senderId.eq.${userAId},recipientId.eq.${userBId}),and(senderId.eq.${userBId},recipientId.eq.${userAId})`)
        .order('createdAt', { ascending: true });

    if (error) throw error;
    return { data, error };
};


// ------------------------------------------
// DEFAULT EXPORT
// ------------------------------------------

export default {
    // CORE HELPERS
    getCurrentUser,

    // PROFILE DATA
    getCustomerProfile,

    // CONNECTION MANAGEMENT
    sendConnectionRequest,
    acceptConnectionRequest,
    cancelConnectionRequest,
    getConnectionStatus,

    // CONNECTION STATS
    getConnectionCounts,

    // MESSAGING (NEW)
    sendMessage,        // <-- NEW
    getChatHistory      // <-- NEW
};

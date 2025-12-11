<template>
  <q-page class="account-select-page">
    <div class="select-container">
      <!-- Header -->
      <div class="header-section">
        <div class="welcome-text">
          <h1 class="welcome-title">Welcome, {{ userName }}</h1>
        </div>
      </div>

      <!-- Create New Account Link -->
      <div class="create-new-section">
        <a 
          href="#" 
          class="create-link"
          @click.prevent="createNewAccount"
          data-test="account-select-create"
        >
          Create a new account
        </a>
      </div>

      <!-- Account Cards -->
      <div class="accounts-grid">
        <div 
          v-for="account in accounts" 
          :key="account.id"
          class="account-card"
          :class="{ 'selected': selectedAccountId === account.id }"
          @click="selectAccount(account)"
          data-test="account-card"
        >
          <div class="card-content">
            <span class="account-name">{{ account.name }}</span>
          </div>
          
          <!-- Ellipsis Menu -->
          <q-btn
            flat
            round
            dense
            icon="more_vert"
            class="menu-btn"
            @click.stop
            data-test="account-menu-btn"
          >
            <q-menu anchor="bottom right" self="top right">
              <q-list style="min-width: 150px">
                <q-item 
                  clickable 
                  v-close-popup
                  @click="editAccount(account)"
                  data-test="account-edit"
                >
                  <q-item-section avatar>
                    <q-icon name="edit" color="primary" />
                  </q-item-section>
                  <q-item-section>Edit</q-item-section>
                </q-item>
                
                <q-item 
                  clickable 
                  v-close-popup
                  @click="confirmDelete(account)"
                  data-test="account-delete"
                >
                  <q-item-section avatar>
                    <q-icon name="delete" color="negative" />
                  </q-item-section>
                  <q-item-section class="text-negative">Delete</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>

      <!-- No Accounts Message -->
      <div v-if="accounts.length === 0" class="no-accounts">
        <q-icon name="account_balance" size="64px" color="grey-5" />
        <p>No accounts yet</p>
        <q-btn
          color="primary"
          label="Create Your First Account"
          @click="createNewAccount"
          data-test="account-select-create-first"
        />
      </div>

      <!-- Continue Button (shown when account selected) -->
      <div v-if="selectedAccountId && accounts.length > 0" class="continue-section">
        <q-btn
          color="primary"
          label="Continue"
          class="continue-btn"
          @click="continueWithAccount"
          data-test="account-select-continue"
        />
      </div>

      <!-- Logout Link -->
      <div class="logout-section">
        <a 
          href="#" 
          class="logout-link"
          @click.prevent="handleLogout"
          data-test="account-select-logout"
        >
          Sign out
        </a>
      </div>
    </div>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog" persistent>
      <q-card style="min-width: 300px">
        <q-card-section>
          <div class="text-h6">Delete Account</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete <strong>{{ accountToDelete?.name }}</strong>? 
          This action cannot be undone.
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn 
            flat 
            label="Delete" 
            color="negative" 
            @click="deleteAccount"
            data-test="account-delete-confirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
/**
 * AccountSelectPage.vue
 * 
 * Account selection screen shown after login.
 * Allows users to:
 * - Select an existing account
 * - Create a new account
 * - Edit an account (via ellipsis menu)
 * - Delete an account (via ellipsis menu)
 * 
 * data-test attributes provided for e2e testing.
 */

import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getSession, logout } from 'src/services/authStorage';

const router = useRouter();
const $q = useQuasar();

// State
const selectedAccountId = ref(null);
const showDeleteDialog = ref(false);
const accountToDelete = ref(null);

// Get current user
const session = getSession();
const userName = computed(() => session?.fullName || session?.email?.split('@')[0] || 'User');

// Mock accounts data - in real app, fetch from API
const accounts = ref([
  { id: 1, name: 'Main House', description: 'Primary residence', region: 'Durban' },
  { id: 2, name: 'Out Building', description: 'Granny flat', region: 'Durban' },
]);

// Load accounts on mount
onMounted(() => {
  loadAccounts();
});

function loadAccounts() {
  // Load accounts from localStorage or API
  const savedAccounts = localStorage.getItem('mycities_user_accounts');
  if (savedAccounts) {
    try {
      accounts.value = JSON.parse(savedAccounts);
    } catch (e) {
      console.error('Failed to parse accounts:', e);
    }
  }
  
  // Auto-select first account if only one exists
  if (accounts.value.length === 1) {
    selectedAccountId.value = accounts.value[0].id;
  }
}

function selectAccount(account) {
  selectedAccountId.value = account.id;
  
  // Save selected account to session and navigate directly
  localStorage.setItem('mycities_selected_account', account.id);
  
  $q.notify({
    type: 'positive',
    message: `Account "${account.name}" selected`,
    position: 'top',
  });
  
  router.push({ name: 'home' });
}

function continueWithAccount() {
  if (!selectedAccountId.value) return;
  
  // Save selected account to session
  localStorage.setItem('mycities_selected_account', selectedAccountId.value);
  
  $q.notify({
    type: 'positive',
    message: 'Account selected',
    position: 'top',
  });
  
  router.push({ name: 'home' });
}

function createNewAccount() {
  router.push({ name: 'account-new' });
}

function editAccount(account) {
  router.push({ name: 'account-edit', params: { accountId: account.id } });
}

function confirmDelete(account) {
  accountToDelete.value = account;
  showDeleteDialog.value = true;
}

function deleteAccount() {
  if (!accountToDelete.value) return;
  
  // Remove from accounts list
  accounts.value = accounts.value.filter(a => a.id !== accountToDelete.value.id);
  
  // Save to localStorage
  localStorage.setItem('mycities_user_accounts', JSON.stringify(accounts.value));
  
  // Clear selection if deleted account was selected
  if (selectedAccountId.value === accountToDelete.value.id) {
    selectedAccountId.value = null;
  }
  
  $q.notify({
    type: 'positive',
    message: `${accountToDelete.value.name} deleted`,
    position: 'top',
  });
  
  showDeleteDialog.value = false;
  accountToDelete.value = null;
}

function handleLogout() {
  logout();
  $q.notify({
    type: 'info',
    message: 'Signed out successfully',
    position: 'top',
  });
  router.push({ name: 'login' });
}
</script>

<style scoped>
.account-select-page {
  background: #f5f5f5;
  min-height: 100vh;
}

.select-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
}

.header-section {
  text-align: center;
  padding: 32px 0 24px;
}

.welcome-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin: 0;
}

.create-new-section {
  text-align: center;
  margin-bottom: 24px;
}

.create-link {
  color: #3294B8;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
}

.create-link:hover {
  text-decoration: underline;
}

.accounts-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.account-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 140px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.account-card:hover {
  border-color: #3294B8;
  box-shadow: 0 2px 8px rgba(50, 148, 184, 0.15);
}

.account-card.selected {
  border-color: #3294B8;
  background: rgba(50, 148, 184, 0.05);
}

.card-content {
  flex: 1;
}

.account-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.menu-btn {
  margin-left: 8px;
  color: #666;
}

.no-accounts {
  text-align: center;
  padding: 48px 16px;
  color: #666;
}

.no-accounts p {
  margin: 16px 0 24px;
  font-size: 16px;
}

.continue-section {
  margin-top: 32px;
  text-align: center;
}

.continue-btn {
  min-width: 200px;
  padding: 12px 32px;
}

.logout-section {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e0e0e0;
}

.logout-link {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.logout-link:hover {
  color: #333;
  text-decoration: underline;
}
</style>


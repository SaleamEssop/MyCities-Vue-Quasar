<template>
  <q-page class="accounts-list-page">
    <q-scroll-area class="page-scroll-area">
      <div class="page-content">
        <!-- Header -->
        <div class="page-header">
          <h1 class="page-title">Accounts</h1>
          <p class="page-subtitle">{{ accounts.length }} account{{ accounts.length !== 1 ? 's' : '' }}</p>
        </div>

        <!-- Add Account Button -->
        <q-btn
          color="primary"
          icon="add"
          label="Add Account"
          class="full-width q-mb-md"
          @click="addAccount"
          data-test="accounts-add"
        />

        <!-- Accounts List -->
        <q-list class="accounts-list" separator v-if="accounts.length > 0">
          <q-item
            v-for="account in accounts"
            :key="account.id"
            class="account-item"
          >
            <q-item-section avatar>
              <q-avatar :color="account.isDemo ? 'secondary' : 'primary'" text-color="white">
                {{ getInitials(account.fullName) }}
              </q-avatar>
            </q-item-section>
            
            <q-item-section>
              <q-item-label class="account-name">
                {{ account.fullName }}
                <q-badge v-if="account.isDemo" color="secondary" label="Demo" class="q-ml-sm" />
                <q-badge v-if="isCurrentAccount(account.id)" color="positive" label="Active" class="q-ml-sm" />
              </q-item-label>
              <q-item-label caption>{{ account.email }}</q-item-label>
              <q-item-label caption v-if="account.company">{{ account.company }}</q-item-label>
            </q-item-section>
            
            <q-item-section side>
              <div class="account-actions">
                <q-btn
                  flat
                  round
                  icon="visibility"
                  size="sm"
                  @click="viewAccount(account)"
                  data-test="account-view"
                >
                  <q-tooltip>View</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  icon="edit"
                  size="sm"
                  @click="editAccount(account)"
                  data-test="account-edit"
                >
                  <q-tooltip>Edit</q-tooltip>
                </q-btn>
                <q-btn
                  v-if="!account.isDemo"
                  flat
                  round
                  icon="delete"
                  size="sm"
                  color="negative"
                  @click="confirmDelete(account)"
                  data-test="account-delete"
                >
                  <q-tooltip>Delete</q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <q-icon name="people" size="64px" color="grey-5" />
          <p>No accounts yet</p>
          <q-btn
            color="primary"
            label="Create First Account"
            @click="addAccount"
          />
        </div>
      </div>
    </q-scroll-area>

    <!-- View Account Dialog -->
    <q-dialog v-model="showViewDialog">
      <q-card class="view-dialog" v-if="selectedAccount">
        <q-card-section class="row items-center">
          <div class="text-h6">Account Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="detail-row">
            <span class="detail-label">Full Name</span>
            <span class="detail-value">{{ selectedAccount.fullName }}</span>
          </div>
          <div class="detail-row" v-if="selectedAccount.company">
            <span class="detail-label">Company</span>
            <span class="detail-value">{{ selectedAccount.company }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ selectedAccount.email }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone</span>
            <span class="detail-value">{{ selectedAccount.phone }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Timezone</span>
            <span class="detail-value">{{ selectedAccount.timezone }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Created</span>
            <span class="detail-value">{{ formatDate(selectedAccount.createdAt) }}</span>
          </div>
          <div class="detail-row" v-if="selectedAccount.isDemo">
            <q-badge color="secondary" label="Demo Account" />
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Close" color="primary" v-close-popup />
          <q-btn flat label="Edit" color="primary" @click="editAccountFromView" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Confirmation Dialog -->
    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Delete Account?</div>
        </q-card-section>

        <q-card-section>
          <p>Are you sure you want to delete the account for <strong>{{ selectedAccount?.fullName }}</strong>?</p>
          <p class="text-negative">This action cannot be undone.</p>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="deleteAccountConfirmed" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { getAllAccounts, deleteAccount, getSession } from 'src/services/authStorage';

const router = useRouter();
const $q = useQuasar();

const accounts = ref([]);
const selectedAccount = ref(null);
const showViewDialog = ref(false);
const showDeleteDialog = ref(false);

const loadAccounts = () => {
  accounts.value = getAllAccounts();
};

const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const isCurrentAccount = (accountId) => {
  const session = getSession();
  return session && session.accountId === accountId;
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'Unknown';
  return new Date(dateStr).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const addAccount = () => {
  router.push({ name: 'account-setup' });
};

const viewAccount = (account) => {
  selectedAccount.value = account;
  showViewDialog.value = true;
};

const editAccount = (account) => {
  router.push({ name: 'account-edit', params: { accountId: account.id } });
};

const editAccountFromView = () => {
  showViewDialog.value = false;
  if (selectedAccount.value) {
    editAccount(selectedAccount.value);
  }
};

const confirmDelete = (account) => {
  selectedAccount.value = account;
  showDeleteDialog.value = true;
};

const deleteAccountConfirmed = () => {
  if (!selectedAccount.value) return;
  
  const deleted = deleteAccount(selectedAccount.value.id);
  
  if (deleted) {
    $q.notify({
      type: 'positive',
      message: 'Account deleted',
      position: 'top',
    });
    loadAccounts();
  } else {
    $q.notify({
      type: 'negative',
      message: 'Failed to delete account',
      position: 'top',
    });
  }
  
  showDeleteDialog.value = false;
  selectedAccount.value = null;
};

onMounted(() => {
  loadAccounts();
});
</script>

<style scoped>
.accounts-list-page {
  background: #f5f5f5;
}

.page-scroll-area {
  height: 100%;
}

.page-content {
  padding: 16px;
  max-width: 480px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #3294B8;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.accounts-list {
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.account-item {
  padding: 16px;
}

.account-name {
  font-weight: 600;
  display: flex;
  align-items: center;
}

.account-actions {
  display: flex;
  gap: 4px;
}

.empty-state {
  text-align: center;
  padding: 64px 24px;
  color: #666;
}

.empty-state p {
  margin: 16px 0 24px;
  font-size: 16px;
}

.view-dialog {
  min-width: 320px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  color: #666;
  font-size: 14px;
}

.detail-value {
  font-weight: 500;
}
</style>




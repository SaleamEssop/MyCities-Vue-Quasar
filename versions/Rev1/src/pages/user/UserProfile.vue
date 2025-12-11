<template>
  <q-page class="bg-grey-2">
    <div class="container q-pa-md">
      <!-- Profile Header -->
      <q-card flat class="q-mb-md">
        <q-card-section class="text-center">
          <q-avatar size="80px" color="primary" text-color="white">
            <span class="text-h4">{{ initials }}</span>
          </q-avatar>
          <div class="text-h6 q-mt-md">{{ user.name }}</div>
          <div class="text-body2 text-grey-6">{{ user.email }}</div>
        </q-card-section>
      </q-card>

      <!-- Account Info -->
      <q-card flat class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Account Information</div>
        </q-card-section>
        <q-list>
          <q-item>
            <q-item-section avatar>
              <q-icon name="badge" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Account Number</q-item-label>
              <q-item-label>{{ user.accountNumber }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="location_on" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Address</q-item-label>
              <q-item-label>{{ user.address }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section avatar>
              <q-icon name="phone" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label caption>Phone</q-item-label>
              <q-item-label>{{ user.phone }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <!-- Settings -->
      <q-card flat class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 text-weight-bold q-mb-sm">Settings</div>
        </q-card-section>
        <q-list>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="notifications" color="grey-7" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Notifications</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="notifications" color="primary" />
            </q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="email" color="grey-7" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Email Alerts</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="emailAlerts" color="primary" />
            </q-item-section>
          </q-item>
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="dark_mode" color="grey-7" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Dark Mode</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-toggle v-model="darkMode" color="primary" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>

      <!-- Logout Button -->
      <q-btn
        color="negative"
        outline
        label="Logout"
        icon="logout"
        class="full-width q-mt-md"
        @click="handleLogout"
      />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Mock user data - will be replaced with API calls
const user = ref({
  name: 'John Doe',
  email: 'john.doe@email.com',
  accountNumber: 'ACC-2024-001',
  address: '123 Main Street, City, 1234',
  phone: '+27 12 345 6789',
});

const notifications = ref(true);
const emailAlerts = ref(true);
const darkMode = ref(false);

const initials = computed(() => {
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
});

const handleLogout = () => {
  // TODO: Clear auth state
  router.push({ path: '/auth/login' });
};
</script>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
}
</style>




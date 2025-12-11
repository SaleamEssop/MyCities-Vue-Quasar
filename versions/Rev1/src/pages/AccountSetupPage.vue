<template>
  <q-page class="account-setup-page">
    <div class="setup-container">
      <!-- Header -->
      <div class="header-section">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="white"
          @click="goBack"
          data-test="setup-back"
        />
        <h1 class="page-title">{{ isEditMode ? 'Edit Account' : 'Create Account' }}</h1>
        <div style="width: 40px"></div>
      </div>

      <!-- Form Card -->
      <q-card class="setup-card">
        <q-card-section>
          <!-- Error Message -->
          <q-banner 
            v-if="errorMessage" 
            class="bg-negative text-white q-mb-md"
            rounded
            data-test="setup-error"
          >
            {{ errorMessage }}
          </q-banner>

          <q-form @submit.prevent="handleSubmit" class="setup-form">
            <!-- Full Name -->
            <q-input
              v-model="form.fullName"
              label="Full Name *"
              outlined
              :rules="[val => !!val || 'Full name is required']"
              data-test="setup-fullname"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <!-- Company (Optional) -->
            <q-input
              v-model="form.company"
              label="Company (Optional)"
              outlined
              data-test="setup-company"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="business" />
              </template>
            </q-input>

            <!-- Phone -->
            <q-input
              v-model="form.phone"
              label="Phone Number *"
              outlined
              :rules="[val => !!val || 'Phone number is required']"
              data-test="setup-phone"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="phone" />
              </template>
            </q-input>

            <!-- Email -->
            <q-input
              v-model="form.email"
              type="email"
              label="Email *"
              outlined
              :rules="[val => !!val || 'Email is required', val => isValidEmail(val) || 'Invalid email format']"
              :disable="isEditMode && editAccount?.isDemo"
              data-test="setup-email"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <!-- Timezone -->
            <q-select
              v-model="form.timezone"
              :options="timezoneOptions"
              label="Preferred Timezone *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Timezone is required']"
              data-test="setup-timezone"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" />
              </template>
            </q-select>

            <!-- Password (not shown in edit mode for demo account) -->
            <template v-if="!isEditMode || !editAccount?.isDemo">
              <q-input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                :label="isEditMode ? 'New Password (leave blank to keep current)' : 'Password *'"
                outlined
                :rules="isEditMode ? [] : [val => !!val || 'Password is required', val => val.length >= 6 || 'Password must be at least 6 characters']"
                data-test="setup-password"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                  />
                </template>
              </q-input>

              <!-- Confirm Password -->
              <q-input
                v-model="form.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :label="isEditMode ? 'Confirm New Password' : 'Confirm Password *'"
                outlined
                :rules="isEditMode && !form.password ? [] : [val => val === form.password || 'Passwords do not match']"
                data-test="setup-confirm-password"
                class="q-mb-md"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </q-input>
            </template>

            <!-- Submit Button -->
            <q-btn
              type="submit"
              color="primary"
              :label="isEditMode ? 'Save Changes' : 'Create Account'"
              class="full-width q-mb-md"
              :loading="isLoading"
              data-test="setup-submit"
            />

            <!-- Cancel Button -->
            <q-btn
              flat
              color="grey"
              label="Cancel"
              class="full-width"
              @click="goBack"
              data-test="setup-cancel"
            />
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { 
  createAccount, 
  updateAccount, 
  getAccountById, 
  login, 
  isValidEmail 
} from 'src/services/authStorage';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const editAccount = ref(null);

const isEditMode = computed(() => !!route.params.accountId);

const form = reactive({
  fullName: '',
  company: '',
  phone: '',
  email: '',
  timezone: 'Africa/Johannesburg',
  password: '',
  confirmPassword: '',
});

const timezoneOptions = [
  { label: 'South Africa (SAST)', value: 'Africa/Johannesburg' },
  { label: 'UK (GMT/BST)', value: 'Europe/London' },
  { label: 'US Eastern (EST/EDT)', value: 'America/New_York' },
  { label: 'US Pacific (PST/PDT)', value: 'America/Los_Angeles' },
  { label: 'Australia Eastern (AEST)', value: 'Australia/Sydney' },
];

onMounted(() => {
  if (isEditMode.value) {
    loadAccountForEdit();
  }
});

const loadAccountForEdit = () => {
  const accountId = route.params.accountId;
  const account = getAccountById(accountId);
  
  if (!account) {
    $q.notify({
      type: 'negative',
      message: 'Account not found',
      position: 'top',
    });
    router.back();
    return;
  }
  
  editAccount.value = account;
  form.fullName = account.fullName || '';
  form.company = account.company || '';
  form.phone = account.phone || '';
  form.email = account.email || '';
  form.timezone = account.timezone || 'Africa/Johannesburg';
  // Don't prefill password
};

const handleSubmit = async () => {
  errorMessage.value = '';
  
  // Validate required fields
  if (!form.fullName || !form.phone || !form.email || !form.timezone) {
    errorMessage.value = 'Please fill in all required fields';
    return;
  }
  
  if (!isValidEmail(form.email)) {
    errorMessage.value = 'Please enter a valid email address';
    return;
  }
  
  // Password validation for new accounts
  if (!isEditMode.value) {
    if (!form.password) {
      errorMessage.value = 'Password is required';
      return;
    }
    if (form.password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters';
      return;
    }
    if (form.password !== form.confirmPassword) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
  }
  
  // Password validation for edit mode (if password provided)
  if (isEditMode.value && form.password) {
    if (form.password.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters';
      return;
    }
    if (form.password !== form.confirmPassword) {
      errorMessage.value = 'Passwords do not match';
      return;
    }
  }
  
  isLoading.value = true;
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (isEditMode.value) {
      // Update existing account
      const updates = {
        fullName: form.fullName,
        company: form.company,
        phone: form.phone,
        email: form.email,
        timezone: form.timezone,
      };
      
      // Only update password if provided
      if (form.password) {
        updates.password = form.password;
      }
      
      updateAccount(route.params.accountId, updates);
      
      $q.notify({
        type: 'positive',
        message: 'Account updated successfully',
        position: 'top',
      });
      
      router.back();
    } else {
      // Create new account
      const newAccount = createAccount({
        fullName: form.fullName,
        company: form.company,
        phone: form.phone,
        email: form.email,
        timezone: form.timezone,
        password: form.password,
      });
      
      // Auto-login after account creation
      login(newAccount.email, form.password);
      
      $q.notify({
        type: 'positive',
        message: 'Account created! Welcome to MyCities.',
        position: 'top',
      });
      
      router.push({ name: 'home' });
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'login' });
  }
};
</script>

<style scoped>
.account-setup-page {
  background: linear-gradient(135deg, #3294B8 0%, #1a5a6e 100%);
  min-height: 100vh;
}

.setup-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
}

.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  color: white;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.setup-card {
  border-radius: 16px;
}

.setup-form {
  padding: 8px 0;
}
</style>



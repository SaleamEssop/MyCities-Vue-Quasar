<template>
  <q-page class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <div class="logo-section">
            <q-icon name="admin_panel_settings" size="48px" color="deep-purple-9" />
            <h1 class="app-title">MyCities</h1>
            <q-badge color="warning" text-color="black" class="q-ml-sm">Admin</q-badge>
          </div>
          <p class="subtitle">Administrator Portal</p>
        </div>

        <!-- Login Form -->
        <q-form @submit.prevent="handleLogin" class="login-form">
          <q-input
            v-model="email"
            type="email"
            label="Admin Email"
            outlined
            dense
            class="q-mb-md"
            :error="!!errors.email"
            :error-message="errors.email"
            data-test="admin-email-input"
          >
            <template v-slot:prepend>
              <q-icon name="email" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            outlined
            dense
            class="q-mb-md"
            :error="!!errors.password"
            :error-message="errors.password"
            data-test="admin-password-input"
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

          <q-btn
            type="submit"
            color="deep-purple-9"
            class="full-width q-mb-md"
            label="Sign In as Admin"
            :loading="loading"
            data-test="admin-login-btn"
          />

          <q-btn
            flat
            color="deep-purple"
            class="full-width q-mb-md"
            label="Use Demo Admin Account"
            :loading="demoLoading"
            @click="handleDemoLogin"
            data-test="admin-demo-btn"
          />
        </q-form>

        <!-- Error Message -->
        <q-banner v-if="loginError" class="bg-negative text-white q-mb-md" rounded>
          <template v-slot:avatar>
            <q-icon name="error" />
          </template>
          {{ loginError }}
        </q-banner>

        <!-- Demo Credentials Info -->
        <div class="demo-info">
          <q-icon name="info" color="grey-6" size="sm" />
          <span>Demo Admin: admin@mycities.co.za / admin123</span>
        </div>

        <!-- Back to User Login -->
        <div class="text-center q-mt-lg">
          <router-link to="/login" class="text-deep-purple">
            ← Back to User Login
          </router-link>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import * as dataService from 'src/services/dataService';

const router = useRouter();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const loading = ref(false);
const demoLoading = ref(false);
const loginError = ref('');
const errors = reactive({
  email: '',
  password: '',
});

const validateForm = () => {
  let valid = true;
  errors.email = '';
  errors.password = '';

  if (!email.value) {
    errors.email = 'Email is required';
    valid = false;
  } else if (!dataService.validators.isValidEmail(email.value)) {
    errors.email = 'Please enter a valid email';
    valid = false;
  }

  if (!password.value) {
    errors.password = 'Password is required';
    valid = false;
  }

  return valid;
};

const handleLogin = async () => {
  loginError.value = '';
  
  if (!validateForm()) {
    return;
  }

  loading.value = true;
  
  try {
    const session = await dataService.login(email.value, password.value);
    
    if (session.role !== 'admin') {
      loginError.value = 'This account does not have admin privileges';
      return;
    }
    
    router.push({ name: 'admin-dashboard' });
  } catch (error) {
    loginError.value = error.message || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleDemoLogin = async () => {
  loginError.value = '';
  demoLoading.value = true;
  
  try {
    await dataService.loginDemoAdmin();
    router.push({ name: 'admin-dashboard' });
  } catch (error) {
    loginError.value = error.message || 'Demo login failed. Please try again.';
  } finally {
    demoLoading.value = false;
  }
};
</script>

<style lang="scss" scoped>
.admin-login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #311b92 0%, #512da8 50%, #673ab7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.app-title {
  font-size: 28px;
  font-weight: 700;
  color: #311b92;
  margin: 0;
}

.subtitle {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.login-form {
  margin-bottom: 16px;
}

.demo-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: #999;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}
</style>


<template>
  <q-page class="login-page" data-test="login-page">
    <!-- Header Bar -->
    <div class="header-bar">
      <span>MyCities</span>
    </div>

    <div class="login-container">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-icon">
          <q-icon name="water_drop" size="64px" />
        </div>
        <h1 class="app-title">MyCities</h1>
        <p class="app-subtitle">Water & Electricity Meter Reading</p>
      </div>

      <!-- Login Form -->
      <div class="login-form-container">
        <!-- Error Message -->
        <div v-if="errorMessage" class="error-banner" data-test="login-error">
          {{ errorMessage }}
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="form-field">
            <label class="field-label">Email</label>
            <input
              v-model="email"
              type="email"
              class="field-input"
              placeholder="Enter your email"
              data-test="login-email"
            />
          </div>

          <!-- Password -->
          <div class="form-field">
            <label class="field-label">Password</label>
            <div class="password-field">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="Enter your password"
                data-test="login-password"
              />
              <button 
                type="button" 
                class="toggle-password"
                @click="showPassword = !showPassword"
              >
                <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" />
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <button 
            type="submit" 
            class="btn-primary"
            :disabled="isLoading"
            data-test="login-submit"
          >
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Demo Login -->
        <button 
          class="btn-secondary"
          :disabled="isDemoLoading"
          @click="handleDemoLogin"
          data-test="login-demo"
        >
          {{ isDemoLoading ? 'Loading...' : 'Use Demo Account' }}
        </button>

        <!-- Forgot Password Link -->
        <div class="forgot-password">
          <a href="#" @click.prevent="goToForgotPassword" data-test="login-forgot-password">
            Forgot Password?
          </a>
        </div>

        <!-- Create Account Link -->
        <div class="create-account">
          <span>Don't have an account?</span>
          <a href="#" @click.prevent="goToRegister" data-test="login-create-account">
            Create Account
          </a>
        </div>
      </div>

      <!-- Demo Hint -->
      <div class="demo-hint">
        <p>Demo: demo@mycities.co.za / demo123</p>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { login, loginDemo, isAuthenticated, isValidEmail } from 'src/services/authStorage';

const router = useRouter();
const $q = useQuasar();

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const isLoading = ref(false);
const isDemoLoading = ref(false);
const errorMessage = ref('');

// Redirect if already authenticated
onMounted(() => {
  if (isAuthenticated()) {
    router.replace({ name: 'account-select' });
  }
});

const handleLogin = async () => {
  errorMessage.value = '';
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return;
  }
  
  if (!isValidEmail(email.value)) {
    errorMessage.value = 'Please enter a valid email address';
    return;
  }
  
  isLoading.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    login(email.value, password.value);
    
    $q.notify({
      type: 'positive',
      message: 'Welcome back!',
      position: 'top',
    });
    
    router.push({ name: 'account-select' });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const handleDemoLogin = async () => {
  errorMessage.value = '';
  isDemoLoading.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    loginDemo();
    
    $q.notify({
      type: 'positive',
      message: 'Welcome to the demo!',
      position: 'top',
    });
    
    router.push({ name: 'account-select' });
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isDemoLoading.value = false;
  }
};

const goToRegister = () => {
  router.push({ name: 'register' });
};

const goToForgotPassword = () => {
  router.push({ name: 'forgot-password' });
};
</script>

<style lang="scss" scoped>
$primary: #3294B8;
$primary-dark: #2a7a9a;
$dark-bg: #1a1a1a;
$border: #e0e0e0;
$text-secondary: #666666;

.login-page {
  background: linear-gradient(180deg, $primary 0%, $primary-dark 100%);
  min-height: 100vh;
}

.header-bar {
  background: #E0E0E0;
  color: #000000;
  padding: 12px 16px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
}

.login-container {
  padding: 24px 16px;
  max-width: 400px;
  margin: 0 auto;
}

.logo-section {
  text-align: center;
  padding: 32px 0;
  color: white;
}

.logo-icon {
  margin-bottom: 16px;
}

.app-title {
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px;
}

.app-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.login-form-container {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.error-banner {
  background: #ffebee;
  color: #c62828;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.form-field {
  margin-bottom: 16px;
}

.field-label {
  display: block;
  font-size: 13px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.field-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid $border;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
  
  &:focus {
    border-color: $primary;
  }
  
  &::placeholder {
    color: #999;
  }
}

.password-field {
  position: relative;
  
  .field-input {
    padding-right: 44px;
  }
  
  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 4px;
  }
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: $primary;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  
  &:hover:not(:disabled) {
    background: $primary-dark;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.divider {
  display: flex;
  align-items: center;
  margin: 20px 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: $border;
  }
  
  span {
    padding: 0 12px;
    color: #999;
    font-size: 13px;
  }
}

.btn-secondary {
  width: 100%;
  padding: 14px;
  background: white;
  color: $primary;
  border: 2px solid $primary;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: rgba($primary, 0.05);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.forgot-password {
  text-align: center;
  margin-top: 16px;
  
  a {
    color: $primary;
    text-decoration: none;
    font-size: 13px;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.create-account {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  
  span {
    color: #666;
  }
  
  a {
    color: $primary;
    text-decoration: none;
    font-weight: 500;
    margin-left: 4px;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.demo-hint {
  text-align: center;
  margin-top: 24px;
  
  p {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    margin: 0;
  }
}
</style>

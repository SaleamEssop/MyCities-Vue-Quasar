<template>
  <q-page class="register-page">
    <div class="register-container">
      <!-- Header -->
      <div class="header-section">
        <q-btn
          flat
          round
          icon="arrow_back"
          color="white"
          @click="goBack"
          data-test="register-back"
        />
        <h1 class="page-title">Create Account</h1>
        <div style="width: 40px"></div>
      </div>

      <!-- Form Card -->
      <q-card class="register-card">
        <q-card-section>
          <!-- Logo/Brand -->
          <div class="brand-section">
            <div class="brand-logo">
              <q-icon name="water_drop" size="48px" color="primary" />
            </div>
            <h2 class="brand-title">MyCities</h2>
            <p class="brand-subtitle">Track your utility usage</p>
          </div>

          <!-- Error Message -->
          <q-banner 
            v-if="errorMessage" 
            class="bg-negative text-white q-mb-md"
            rounded
            data-test="register-error"
          >
            {{ errorMessage }}
          </q-banner>

          <q-form @submit.prevent="handleSubmit" class="register-form">
            <!-- Full Name -->
            <q-input
              v-model="form.fullName"
              label="Full Name *"
              outlined
              :rules="[val => !!val || 'Full name is required']"
              data-test="register-fullname"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="person" />
              </template>
            </q-input>

            <!-- Phone Number -->
            <q-input
              v-model="form.phone"
              label="Phone Number *"
              outlined
              type="tel"
              :rules="[val => !!val || 'Phone number is required']"
              data-test="register-phone"
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
              data-test="register-email"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="email" />
              </template>
            </q-input>

            <!-- Password -->
            <q-input
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password *"
              outlined
              :rules="[val => !!val || 'Password is required', val => val.length >= 6 || 'Password must be at least 6 characters']"
              data-test="register-password"
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
              label="Confirm Password *"
              outlined
              :rules="[val => val === form.password || 'Passwords do not match']"
              data-test="register-confirm-password"
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

            <!-- Terms and Conditions -->
            <q-checkbox
              v-model="form.agreeToTerms"
              class="q-mb-md"
              data-test="register-terms"
            >
              <span class="terms-text">
                I agree to the 
                <a href="#" @click.prevent="showTerms" class="terms-link">Terms of Service</a>
                and
                <a href="#" @click.prevent="showPrivacy" class="terms-link">Privacy Policy</a>
              </span>
            </q-checkbox>

            <!-- Submit Button -->
            <q-btn
              type="submit"
              color="primary"
              label="Create Account"
              class="full-width q-mb-md"
              :loading="isLoading"
              :disable="!form.agreeToTerms"
              data-test="register-submit"
            />

            <!-- Divider -->
            <div class="divider q-mb-md">
              <span>or</span>
            </div>

            <!-- Sign In Link -->
            <div class="signin-link">
              Already have an account?
              <router-link :to="{ name: 'login' }" class="link">Sign In</router-link>
            </div>

            <!-- Forgot Password Link -->
            <div class="forgot-password-link q-mt-md">
              <router-link :to="{ name: 'forgot-password' }" class="link">Forgot Password?</router-link>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
/**
 * RegisterPage.vue
 * 
 * User registration screen for MyCities app.
 * Fields: Full Name, Phone, Email, Password, Confirm Password, Agree to Terms
 * 
 * data-test attributes provided for e2e testing.
 */

import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { createAccount, login, isValidEmail } from 'src/services/authStorage';

const router = useRouter();
const $q = useQuasar();

// Loading state
const isLoading = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// Form data
const form = reactive({
  fullName: '',
  phone: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false,
});

// Handle form submission
async function handleSubmit() {
  errorMessage.value = '';
  
  // Validate required fields
  if (!form.fullName || !form.phone || !form.email) {
    errorMessage.value = 'Please fill in all required fields';
    return;
  }
  
  if (!isValidEmail(form.email)) {
    errorMessage.value = 'Please enter a valid email address';
    return;
  }
  
  if (!form.password || form.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return;
  }
  
  if (form.password !== form.confirmPassword) {
    errorMessage.value = 'Passwords do not match';
    return;
  }
  
  if (!form.agreeToTerms) {
    errorMessage.value = 'You must agree to the Terms of Service and Privacy Policy';
    return;
  }
  
  isLoading.value = true;
  
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Create account
    const newAccount = createAccount({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      password: form.password,
    });
    
    // Auto-login after account creation
    login(newAccount.email, form.password);
    
    $q.notify({
      type: 'positive',
      message: 'Account created! Welcome to MyCities.',
      position: 'top',
    });
    
    // Navigate to account setup to configure their first account
    router.push({ name: 'account-new' });
  } catch (error) {
    errorMessage.value = error.message || 'An error occurred during registration';
  } finally {
    isLoading.value = false;
  }
}

// Show Terms of Service
function showTerms() {
  $q.dialog({
    title: 'Terms of Service',
    message: 'By using MyCities, you agree to our terms of service. This includes responsible use of the application for tracking your utility consumption and understanding that all data is stored locally on your device unless you choose to sync with our servers.',
    ok: 'Close',
  });
}

// Show Privacy Policy
function showPrivacy() {
  $q.dialog({
    title: 'Privacy Policy',
    message: 'MyCities respects your privacy. We collect only the information necessary to provide our services. Your meter readings and consumption data are stored locally on your device. We do not share your personal information with third parties without your consent.',
    ok: 'Close',
  });
}

// Navigate back
function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push({ name: 'login' });
  }
}
</script>

<style scoped>
.register-page {
  background: linear-gradient(135deg, #3294B8 0%, #1a5a6e 100%);
  min-height: 100vh;
}

.register-container {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  padding-bottom: 32px;
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

.register-card {
  border-radius: 16px;
}

.brand-section {
  text-align: center;
  margin-bottom: 24px;
}

.brand-logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  background: linear-gradient(135deg, #e8f4f8 0%, #d0e8f0 100%);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-title {
  font-size: 24px;
  font-weight: 700;
  color: #3294B8;
  margin: 0 0 4px 0;
}

.brand-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.register-form {
  padding: 8px 0;
}

.terms-text {
  font-size: 13px;
  color: #666;
}

.terms-link {
  color: #3294B8;
  text-decoration: none;
  font-weight: 500;
}

.terms-link:hover {
  text-decoration: underline;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #ddd;
}

.divider span {
  padding: 0 12px;
}

.signin-link {
  text-align: center;
  font-size: 14px;
  color: #666;
}

.signin-link .link {
  color: #3294B8;
  text-decoration: none;
  font-weight: 600;
}

.signin-link .link:hover {
  text-decoration: underline;
}

.forgot-password-link {
  text-align: center;
  font-size: 14px;
}

.forgot-password-link .link {
  color: #3294B8;
  text-decoration: none;
}

.forgot-password-link .link:hover {
  text-decoration: underline;
}
</style>


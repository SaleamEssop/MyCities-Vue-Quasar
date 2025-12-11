<template>
  <q-page class="auth-page">
    <!-- Header with Logo -->
    <div class="auth-header">
      <img src="~assets/MyCity.png" alt="MyCities" class="auth-logo" />
      <div class="auth-tagline">Manage your municipal account</div>
    </div>
    
    <!-- Login Card -->
    <div class="auth-content">
      <q-card class="auth-card" flat>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey-7 bg-grey-2"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          switch-indicator
          active-bg-color="white"
        >
          <q-tab name="login" label="Sign in" />
          <q-tab name="register" label="Sign up" />
        </q-tabs>

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login" class="q-pa-none">
            <AuthComponent :tab="tab" />
          </q-tab-panel>

          <q-tab-panel name="register" class="q-pa-none">
            <AuthComponent :tab="tab" />
            <div class="q-ma-sm text-caption text-grey-7">
              <b>Note:</b> By signing up you agree to our terms of use and privacy policy
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import AuthComponent from "components/AuthComponent";
import { defineComponent, ref } from "vue";
export default defineComponent({
  components: { AuthComponent },
  name: "AuthPage",
  setup() {
    const tab = ref("login");
    return {
      tab,
    };
  },
});
</script>

<style lang="scss" scoped>
.auth-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #FFFFFF;
}

.auth-header {
  background: $primary;
  padding: 40px 20px 48px;
  text-align: center;
}

.auth-logo {
  height: auto;
  width: 180px;
  max-width: 250px;
  margin-bottom: 12px;
  filter: brightness(0) invert(1); // Make logo white
}

.auth-tagline {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  font-weight: 400;
}

.auth-content {
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 16px;
  margin-top: -24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

@media only screen and (max-width: 480px) {
  .auth-card {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
  
  .auth-header {
    padding: 32px 20px 40px;
  }
  
  .auth-logo {
    width: 150px;
  }
}
</style>

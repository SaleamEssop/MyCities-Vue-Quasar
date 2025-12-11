<template>
  <q-page class="about-page">
    <q-scroll-area class="page-scroll-area">
      <div class="page-content">
        <!-- Header -->
        <div class="page-header">
          <div class="app-logo">
            <q-icon name="water_drop" size="64px" color="primary" />
          </div>
          <h1 class="app-name">MyCities</h1>
          <p class="app-tagline">Water Meter Reading App</p>
        </div>

        <!-- About Content -->
        <q-card class="about-card">
          <q-card-section>
            <h2 class="section-title">About</h2>
            <p class="section-text">
              MyCities is a water meter reading application that helps you track and manage your water consumption.
            </p>
          </q-card-section>

          <q-card-section>
            <h2 class="section-title">Version</h2>
            <p class="section-text">1.0.0</p>
          </q-card-section>

          <q-card-section>
            <h2 class="section-title">Features</h2>
            <ul class="features-list">
              <li>Easy meter reading entry</li>
              <li>Reading history tracking</li>
              <li>Offline data storage</li>
              <li>Accessible interface</li>
            </ul>
          </q-card-section>

          <q-card-section>
            <h2 class="section-title">Data Storage</h2>
            <p class="section-text">
              All readings are stored locally on your device. To sync with a backend server,
              replace the localStorage service with your API endpoints.
            </p>
          </q-card-section>
        </q-card>

        <!-- Back Button -->
        <div class="actions">
          <q-btn
            color="primary"
            label="Back to Settings"
            icon="arrow_back"
            @click="goBack"
          />
        </div>
      </div>
    </q-scroll-area>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>

<style scoped>
.about-page {
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
  padding: 32px 16px;
}

.app-logo {
  margin-bottom: 16px;
}

.app-name {
  font-size: 32px;
  font-weight: 700;
  color: #3294B8;
  margin: 0 0 8px 0;
}

.app-tagline {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.about-card {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #000;
  margin: 0 0 12px 0;
}

.section-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.section-text:last-child {
  margin-bottom: 0;
}

.features-list {
  margin: 0;
  padding-left: 20px;
  color: #666;
  line-height: 1.8;
}

.features-list li {
  margin-bottom: 8px;
}

.actions {
  padding: 16px 0;
}
</style>



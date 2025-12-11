<template>
  <div class="app-wrapper">
    <div class="phone-container">
      <q-layout view="hHh Lpr fFf">
        <q-page-container>
          <router-view />
        </q-page-container>
      </q-layout>
    </div>
  </div>
</template>

<script setup>
/**
 * AuthLayout - Mobile App View Container
 * 
 * Wraps ALL pages in a phone-sized container to simulate
 * mobile app experience even on desktop browsers.
 * 
 * On actual mobile devices (< 430px), fills the full screen.
 */
</script>

<style lang="scss">
// App wrapper - centers the phone container on desktop
.app-wrapper {
  min-height: 100vh;
  background: #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  
  // On actual mobile devices, remove padding and fill screen
  @media (max-width: 430px) {
    padding: 0;
    background: #ffffff;
  }
}

// Phone container - constrains app to mobile dimensions
.phone-container {
  width: 100%;
  max-width: 390px; // iPhone 14 Pro width
  height: 844px;    // iPhone 14 Pro height
  background: #ffffff;
  border-radius: 32px;
  overflow: hidden;
  box-shadow: 
    0 0 0 10px #2a2a2a,
    0 0 0 12px #3a3a3a,
    0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  
  // On actual mobile devices, fill the screen
  @media (max-width: 430px) {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    height: 100dvh; // Dynamic viewport height for mobile browsers
    border-radius: 0;
    box-shadow: none;
  }
  
  // Ensure Quasar layout fills container
  .q-layout {
    min-height: 100%;
    height: 100%;
  }
  
  .q-page-container {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
  
  .q-page {
    min-height: 100%;
  }
}

// Custom scrollbar inside phone container
.phone-container {
  ::-webkit-scrollbar {
    width: 4px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.15);
    border-radius: 2px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.25);
  }
}

// Ensure all pages respect the mobile constraint
.q-page {
  max-width: 100%;
  overflow-x: hidden;
}
</style>

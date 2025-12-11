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
        <h1 class="page-title">{{ isEditMode ? 'Edit Account' : 'Account Setup' }}</h1>
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
            
            <!-- Section: Region & Tariff -->
            <div class="section-title">Region & Tariff</div>
            
            <!-- Region Selection -->
            <q-select
              v-model="form.regionId"
              :options="regionOptions"
              label="Region *"
              outlined
              emit-value
              map-options
              :loading="loadingRegions"
              :rules="[val => !!val || 'Region is required']"
              @update:model-value="onRegionChange"
              data-test="setup-region"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="location_city" />
              </template>
            </q-select>

            <!-- Tariff Template Selection -->
            <q-select
              v-model="form.tariffId"
              :options="tariffOptions"
              label="Tariff Template *"
              outlined
              emit-value
              map-options
              :loading="loadingTariffs"
              :disable="!form.regionId"
              :rules="[val => !!val || 'Tariff template is required']"
              @update:model-value="onTariffChange"
              data-test="setup-tariff"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="receipt_long" />
              </template>
            </q-select>

            <!-- Section: Account Details -->
            <div class="section-title">Account Details</div>

            <!-- Account Description -->
            <q-input
              v-model="form.accountDescription"
              label="Account Description *"
              outlined
              hint="E.g., Main House, Granny Flat, Shop"
              :rules="[val => !!val || 'Account description is required']"
              data-test="setup-account-description"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="home" />
              </template>
            </q-input>

            <!-- Address (Google Places) -->
            <q-input
              v-model="form.address"
              label="Address *"
              outlined
              ref="addressInput"
              :rules="[val => !!val || 'Address is required']"
              data-test="setup-address"
              class="q-mb-md"
              @focus="initGooglePlaces"
            >
              <template v-slot:prepend>
                <q-icon name="place" />
              </template>
              <template v-slot:append>
                <q-icon 
                  v-if="form.address" 
                  name="close" 
                  class="cursor-pointer"
                  @click="form.address = ''"
                />
              </template>
            </q-input>

            <!-- Section: Billing Dates -->
            <div class="section-title">Billing Schedule</div>

            <!-- Billing Day -->
            <q-select
              v-model="form.billingDay"
              :options="billingDayOptions"
              label="Billing Day *"
              outlined
              emit-value
              map-options
              :rules="[val => !!val || 'Billing day is required']"
              @update:model-value="onBillingDayChange"
              data-test="setup-billing-day"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="event" />
              </template>
            </q-select>

            <!-- Read Day (Auto-calculated) -->
            <q-input
              v-model="form.readDay"
              label="Read Day (Auto-calculated)"
              outlined
              readonly
              disable
              hint="Automatically set to 5 days before billing day"
              data-test="setup-read-day"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="schedule" />
              </template>
            </q-input>

            <!-- Section: Contact Emails -->
            <div class="section-title">Contact Emails</div>

            <!-- Water Email -->
            <q-input
              v-model="form.waterEmail"
              type="email"
              label="Water Department Email"
              outlined
              :hint="isEthekwini ? 'Auto-filled for Ethekwini region' : 'Email for water queries'"
              data-test="setup-water-email"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="water_drop" color="blue" />
              </template>
            </q-input>

            <!-- Electricity Email -->
            <q-input
              v-model="form.electricityEmail"
              type="email"
              label="Electricity Department Email"
              outlined
              :hint="isEthekwini ? 'Auto-filled for Ethekwini region' : 'Email for electricity queries'"
              data-test="setup-electricity-email"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="bolt" color="amber" />
              </template>
            </q-input>

            <!-- Section: Customer Costs (Editable) -->
            <template v-if="customerCosts.length > 0">
              <div class="section-title">
                Customer Costs
                <span class="section-hint">(Editable - changes won't affect past bills)</span>
              </div>
              
              <div 
                v-for="(cost, index) in customerCosts" 
                :key="index"
                class="cost-item q-mb-sm"
              >
                <q-input
                  v-model="cost.title"
                  :label="'Description'"
                  outlined
                  dense
                  class="cost-title"
                  data-test="setup-cost-title"
                />
                <q-input
                  v-model.number="cost.value"
                  type="number"
                  prefix="R"
                  :label="'Amount'"
                  outlined
                  dense
                  class="cost-value"
                  data-test="setup-cost-value"
                />
              </div>
            </template>

            <!-- Section: Bill Details -->
            <div class="section-title">Bill Details</div>
            
            <!-- Name as per Bill -->
            <q-input
              v-model="form.nameAsPerBill"
              label="Name as per Bill *"
              outlined
              hint="Enter the name exactly as it appears on your utility bill"
              :rules="[val => !!val || 'Name as per bill is required']"
              data-test="setup-name-as-per-bill"
              class="q-mb-md"
            >
              <template v-slot:prepend>
                <q-icon name="badge" />
              </template>
            </q-input>

            <!-- Bill Preview -->
            <template v-if="billPreview">
              <div class="section-title">Bill Preview</div>
              <q-card flat bordered class="bill-preview q-mb-md">
                <q-card-section>
                  <div class="preview-row">
                    <span>Water:</span>
                    <span>R{{ billPreview.water?.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="preview-row">
                    <span>Electricity:</span>
                    <span>R{{ billPreview.electricity?.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="preview-row">
                    <span>Fixed Costs:</span>
                    <span>R{{ billPreview.fixed_costs?.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="preview-row">
                    <span>Customer Costs:</span>
                    <span>R{{ billPreview.customer_costs?.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="preview-row">
                    <span>VAT ({{ billPreview.vat?.percentage || 15 }}%):</span>
                    <span>R{{ billPreview.vat?.amount?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <div class="preview-row">
                    <span>Rates:</span>
                    <span>R{{ billPreview.rates?.net?.toFixed(2) || '0.00' }}</span>
                  </div>
                  <q-separator class="q-my-sm" />
                  <div class="preview-row total">
                    <span>Estimated Total:</span>
                    <span>R{{ billPreview.total?.toFixed(2) || '0.00' }}</span>
                  </div>
                </q-card-section>
              </q-card>
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
/**
 * AccountSetupPage.vue
 * 
 * Account setup screen for MyCities app.
 * Allows users to:
 * - Select region and tariff template
 * - Enter address using Google Places autocomplete
 * - Set billing schedule
 * - Configure contact emails (auto-filled for Ethekwini)
 * - Edit customer-specific costs
 * 
 * data-test attributes provided for e2e testing.
 */

import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import setupApi from 'src/services/setupApi';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

// Loading states
const isLoading = ref(false);
const loadingRegions = ref(false);
const loadingTariffs = ref(false);
const loadingTariffDetails = ref(false);

// UI states
const errorMessage = ref('');
const addressInput = ref(null);
const googlePlacesInitialized = ref(false);

// Edit mode
const isEditMode = computed(() => !!route.params.accountId);

// Data
const regions = ref([]);
const tariffs = ref([]);
const tariffDetails = ref(null);
const billPreview = ref(null);
const customerCosts = ref([]);

// Form data
const form = reactive({
  // Region & Tariff
  regionId: null,
  tariffId: null,
  
  // Account details
  accountDescription: '',
  address: '',
  addressLat: null,
  addressLng: null,
  
  // Billing schedule
  billingDay: 20,
  readDay: 15,
  
  // Contact emails
  waterEmail: '',
  electricityEmail: '',
  
  // Bill details
  nameAsPerBill: '',
});

// Check if selected region is Ethekwini (Durban)
const isEthekwini = computed(() => {
  const selectedRegion = regions.value.find(r => r.id === form.regionId);
  if (!selectedRegion) return false;
  const name = selectedRegion.name.toLowerCase();
  return name.includes('ethekwini') || name.includes('durban');
});

// Options
const regionOptions = computed(() => 
  regions.value.map(r => ({
    label: r.name,
    value: r.id,
  }))
);

const tariffOptions = computed(() => 
  tariffs.value.map(t => ({
    label: t.template_name,
    value: t.id,
  }))
);

const billingDayOptions = Array.from({ length: 28 }, (_, i) => ({
  label: `${i + 1}${getDaySuffix(i + 1)} of each month`,
  value: i + 1,
}));

// Helper function for day suffix
function getDaySuffix(day) {
  if (day >= 11 && day <= 13) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

// Load regions on mount
onMounted(async () => {
  await loadRegions();
  
  if (isEditMode.value) {
    await loadAccountForEdit();
  }
});

// Load regions from API
async function loadRegions() {
  loadingRegions.value = true;
  try {
    const response = await setupApi.getRegions();
    if (response.success) {
      regions.value = response.data;
    } else {
      console.error('Failed to load regions:', response.error);
      // Use fallback data for demo
      regions.value = [
        { id: 1, name: 'Durban (Ethekwini)', water_email: 'water@durban.gov.za', electricity_email: 'electricity@durban.gov.za' },
        { id: 2, name: 'Cape Town', water_email: '', electricity_email: '' },
        { id: 3, name: 'Johannesburg', water_email: '', electricity_email: '' },
      ];
    }
  } catch (error) {
    console.error('Error loading regions:', error);
    // Use fallback data
    regions.value = [
      { id: 1, name: 'Durban (Ethekwini)', water_email: 'water@durban.gov.za', electricity_email: 'electricity@durban.gov.za' },
    ];
  } finally {
    loadingRegions.value = false;
  }
}

// Handle region change
async function onRegionChange(regionId) {
  form.tariffId = null;
  tariffs.value = [];
  tariffDetails.value = null;
  billPreview.value = null;
  customerCosts.value = [];
  
  // Auto-fill emails for Ethekwini
  const selectedRegion = regions.value.find(r => r.id === regionId);
  if (selectedRegion) {
    if (isEthekwini.value) {
      form.waterEmail = selectedRegion.water_email || 'water@durban.gov.za';
      form.electricityEmail = selectedRegion.electricity_email || 'electricity@durban.gov.za';
    } else {
      form.waterEmail = selectedRegion.water_email || '';
      form.electricityEmail = selectedRegion.electricity_email || '';
    }
  }
  
  // Load tariffs for region
  if (regionId) {
    await loadTariffsForRegion(regionId);
  }
}

// Load tariffs for selected region
async function loadTariffsForRegion(regionId) {
  loadingTariffs.value = true;
  try {
    const response = await setupApi.getTariffsForRegion(regionId);
    if (response.success) {
      tariffs.value = response.data.tariffs || [];
    } else {
      console.error('Failed to load tariffs:', response.error);
      // Use fallback for demo
      tariffs.value = [
        { id: 10, template_name: 'DurbanTariff', billing_day: 20, read_day: 15 },
      ];
    }
  } catch (error) {
    console.error('Error loading tariffs:', error);
    tariffs.value = [];
  } finally {
    loadingTariffs.value = false;
  }
}

// Handle tariff change
async function onTariffChange(tariffId) {
  if (!tariffId) {
    tariffDetails.value = null;
    billPreview.value = null;
    customerCosts.value = [];
    return;
  }
  
  await loadTariffDetails(tariffId);
}

// Load full tariff details
async function loadTariffDetails(tariffId) {
  loadingTariffDetails.value = true;
  try {
    const response = await setupApi.getTariffDetails(tariffId);
    if (response.success) {
      tariffDetails.value = response.data;
      
      // Set billing/read days from tariff
      form.billingDay = response.data.billing_day || 20;
      form.readDay = response.data.calculated_read_day || 15;
      
      // Load customer-editable costs
      customerCosts.value = (response.data.customer_costs || []).map(c => ({
        title: c.title || c.description || '',
        value: c.value || c.amount || 0,
      }));
      
      // Load bill preview
      await loadBillPreview(tariffId);
    }
  } catch (error) {
    console.error('Error loading tariff details:', error);
  } finally {
    loadingTariffDetails.value = false;
  }
}

// Load bill preview
async function loadBillPreview(tariffId) {
  try {
    const response = await setupApi.previewBill(tariffId, {
      customer_costs: customerCosts.value,
    });
    if (response.success) {
      billPreview.value = response.data;
    }
  } catch (error) {
    console.error('Error loading bill preview:', error);
  }
}

// Handle billing day change
function onBillingDayChange(billingDay) {
  // Auto-calculate read day (5 days before billing)
  form.readDay = setupApi.calculateReadDay(billingDay);
}

// Watch customer costs for changes and update preview
watch(customerCosts, async () => {
  if (form.tariffId) {
    await loadBillPreview(form.tariffId);
  }
}, { deep: true });

// Initialize Google Places Autocomplete
async function initGooglePlaces() {
  if (googlePlacesInitialized.value) return;
  
  // Check if Google Maps API is loaded
  if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
    // Load Google Maps API dynamically
    // API key should be set in quasar.config.js env or .env file
    const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.VUE_APP_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Places API key not configured. Address autocomplete disabled.');
      return;
    }
    
    await loadGoogleMapsScript(apiKey);
  }
  
  await nextTick();
  
  // Get the native input element
  const inputEl = addressInput.value?.$el?.querySelector('input');
  if (!inputEl) return;
  
  try {
    const autocomplete = new google.maps.places.Autocomplete(inputEl, {
      componentRestrictions: { country: 'za' }, // Restrict to South Africa
      fields: ['formatted_address', 'geometry', 'address_components'],
    });
    
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        form.address = place.formatted_address;
      }
      if (place.geometry?.location) {
        form.addressLat = place.geometry.location.lat();
        form.addressLng = place.geometry.location.lng();
      }
    });
    
    googlePlacesInitialized.value = true;
  } catch (error) {
    console.error('Failed to initialize Google Places:', error);
  }
}

// Load Google Maps script dynamically
function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (typeof google !== 'undefined' && google.maps) {
      resolve();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Load account for editing
async function loadAccountForEdit() {
  // TODO: Implement loading existing account data
  $q.notify({
    type: 'info',
    message: 'Edit mode - loading account data...',
    position: 'top',
  });
}

// Handle form submission
async function handleSubmit() {
  errorMessage.value = '';
  
  // Validate required fields
  if (!form.regionId || !form.tariffId) {
    errorMessage.value = 'Please select a region and tariff template';
    return;
  }
  
  if (!form.accountDescription || !form.address) {
    errorMessage.value = 'Please fill in account description and address';
    return;
  }
  
  if (!form.billingDay) {
    errorMessage.value = 'Please select a billing day';
    return;
  }
  
  if (!form.nameAsPerBill) {
    errorMessage.value = 'Please enter the name as it appears on your bill';
    return;
  }
  
  isLoading.value = true;
  
  try {
    const accountData = {
      tariff_template_id: form.tariffId,
      account_name: form.accountDescription,
      name_as_per_bill: form.nameAsPerBill,
      billing_day: form.billingDay,
      site_title: form.accountDescription,
      site_address: form.address,
      address_lat: form.addressLat,
      address_lng: form.addressLng,
      water_email: form.waterEmail,
      electricity_email: form.electricityEmail,
      customer_costs: customerCosts.value,
    };
    
    const response = isEditMode.value 
      ? await setupApi.updateAccount({ account_id: route.params.accountId, ...accountData })
      : await setupApi.createAccount(accountData);
    
    if (response.success) {
      $q.notify({
        type: 'positive',
        message: isEditMode.value ? 'Account updated successfully!' : 'Account created successfully!',
        position: 'top',
      });
      
      router.push({ name: 'home' });
    } else {
      errorMessage.value = response.error || 'Failed to save account';
    }
  } catch (error) {
    console.error('Error saving account:', error);
    errorMessage.value = error.message || 'An error occurred while saving';
  } finally {
    isLoading.value = false;
  }
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
.account-setup-page {
  background: linear-gradient(135deg, #3294B8 0%, #1a5a6e 100%);
  min-height: 100vh;
}

.setup-container {
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

.setup-card {
  border-radius: 16px;
}

.setup-form {
  padding: 8px 0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #3294B8;
  margin-bottom: 12px;
  margin-top: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-title:first-child {
  margin-top: 0;
}

.section-hint {
  font-size: 11px;
  font-weight: 400;
  color: #666;
  text-transform: none;
  letter-spacing: 0;
}

.cost-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.cost-title {
  flex: 2;
}

.cost-value {
  flex: 1;
  min-width: 120px;
}

.bill-preview {
  background: #f5f5f5;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 14px;
}

.preview-row.total {
  font-weight: 700;
  font-size: 16px;
  color: #3294B8;
}
</style>

<template>
  <q-page class="component-demo-page">
    <div class="demo-container">
      <h2 class="demo-title">MyCities UI Components Demo</h2>
      
      <!-- BillHeader Demo -->
      <div class="demo-section">
        <h3>1. BillHeader Component</h3>
        <BillHeader
          :current-date="currentDate"
          :days-until-due="17"
          period-start="10 Apr 2025"
          period-end="10 May 2025"
          :amount="6700"
          :show-amount="true"
          @prev="handlePrev"
          @next="handleNext"
        />
      </div>
      
      <!-- BillHeader with Title -->
      <div class="demo-section">
        <h3>2. BillHeader with Title</h3>
        <BillHeader
          :current-date="currentDate"
          :days-until-due="3"
          period-start="10 Apr 2025"
          period-end="10 May 2025"
          title="ENTER READINGS"
          :show-title="true"
          @prev="handlePrev"
          @next="handleNext"
        />
      </div>
      
      <!-- MeterBar with Stats -->
      <div class="demo-section">
        <h3>3. MeterBar with Statistics</h3>
        <MeterBar
          type="water"
          name="Water"
          icon="water_drop"
          :stats="waterStats"
          :show-stats="true"
        />
      </div>
      
      <!-- MeterBar with Name -->
      <div class="demo-section">
        <h3>4. MeterBar with Name Only</h3>
        <MeterBar
          type="water"
          name="Water"
          icon="water_drop"
          :show-stats="false"
        />
        <MeterBar
          type="electricity"
          name="Electricity"
          icon="bolt"
          :show-stats="false"
        />
      </div>
      
      <!-- ActionLinks Demo -->
      <div class="demo-section">
        <h3>5. ActionLinks Component</h3>
        <ActionLinks
          :links="actionLinks"
          @click="handleActionClick"
        />
      </div>
      
      <!-- MeterReadingEntry Demo -->
      <div class="demo-section">
        <h3>6. MeterReadingEntry Component</h3>
        <MeterReadingEntry
          meter-number="132452"
          :readings="waterReadings"
          :cooldown-active="false"
          meter-type="water"
          @add="handleAddReading"
          @edit="handleEditReading"
        />
      </div>
      
      <!-- MeterReadingEntry with Cooldown -->
      <div class="demo-section">
        <h3>7. MeterReadingEntry with Cooldown</h3>
        <MeterReadingEntry
          meter-number="132452"
          :readings="waterReadings"
          :cooldown-active="true"
          :cooldown-hours="17"
          :cooldown-minutes="20"
          meter-type="water"
          @add="handleAddReading"
          @edit="handleEditReading"
        />
      </div>
      
      <!-- MeterUsageCard Demo -->
      <div class="demo-section">
        <h3>8. MeterUsageCard (Water)</h3>
        <MeterUsageCard
          meter-type="water"
          meter-name="Water"
          icon="water_drop"
          :stats="waterStats"
          :charges="waterCharges"
          :projected="3000"
          @enter-reading="showWaterKeypad = true"
        />
      </div>
      
      <div class="demo-section">
        <h3>9. MeterUsageCard (Electricity)</h3>
        <MeterUsageCard
          meter-type="electricity"
          meter-name="Electricity"
          icon="bolt"
          :stats="elecStats"
          :charges="elecCharges"
          :projected="2200"
          @enter-reading="showElecKeypad = true"
        />
      </div>
      
      <!-- ReadingKeypad Demo -->
      <div class="demo-section">
        <h3>10. ReadingKeypad Component</h3>
        <q-btn
          color="primary"
          label="Open Water Keypad"
          @click="showWaterKeypad = true"
          class="q-mb-md"
        />
        <q-btn
          color="primary"
          label="Open Electricity Keypad"
          @click="showElecKeypad = true"
        />
      </div>
      
      <!-- Keypads -->
      <ReadingKeypad
        v-model="showWaterKeypad"
        meter-type="water"
        initial-value="09653-25"
        @enter="handleKeypadEnter"
        @cancel="showWaterKeypad = false"
      />
      
      <ReadingKeypad
        v-model="showElecKeypad"
        meter-type="electricity"
        initial-value="764351"
        @enter="handleKeypadEnter"
        @cancel="showElecKeypad = false"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';
import {
  BillHeader,
  MeterBar,
  ActionLinks,
  ReadingKeypad,
  MeterReadingEntry,
  MeterUsageCard
} from 'components/ui';

export default defineComponent({
  name: 'ComponentDemo',
  
  components: {
    BillHeader,
    MeterBar,
    ActionLinks,
    ReadingKeypad,
    MeterReadingEntry,
    MeterUsageCard
  },
  
  setup() {
    const $q = useQuasar();
    const currentDate = ref(new Date());
    const showWaterKeypad = ref(false);
    const showElecKeypad = ref(false);
    
    const waterStats = [
      { label: 'Daily Usage', value: '1290 L' },
      { label: 'Total Usage', value: '33.90 kl' },
      { label: 'Daily Cost', value: 'R 77.90' }
    ];
    
    const elecStats = [
      { label: 'Daily Usage', value: '30 kW' },
      { label: 'Daily Cost', value: 'R 77.90' }
    ];
    
    const actionLinks = [
      { label: 'Enter reading', action: 'enter-reading', active: true },
      { label: 'Show Details', action: 'show-details', highlight: true }
    ];
    
    const waterReadings = [
      { label: 'Start Reading 10th April', value: { black: '09140', red: '45' } },
      { label: 'Final Estimated', value: { black: '09653', red: '25' }, date: '17th April', editable: true }
    ];
    
    const waterCharges = [
      { label: 'Consumption Charges', amount: 1200 },
      { label: 'Discharge charges', amount: 600 },
      { label: 'Infrastructure Surcharge', amount: 200 }
    ];
    
    const elecCharges = [
      { label: 'Consumption Charges', amount: 2200 }
    ];
    
    const handlePrev = () => {
      $q.notify({ message: 'Previous period clicked', type: 'info' });
    };
    
    const handleNext = () => {
      $q.notify({ message: 'Next period clicked', type: 'info' });
    };
    
    const handleActionClick = (action) => {
      $q.notify({ message: `Action clicked: ${action}`, type: 'info' });
    };
    
    const handleAddReading = () => {
      $q.notify({ message: 'Add reading clicked', type: 'info' });
    };
    
    const handleEditReading = (reading, index) => {
      $q.notify({ message: `Edit reading ${index} clicked`, type: 'info' });
    };
    
    const handleKeypadEnter = (value) => {
      $q.notify({ 
        message: `Reading entered: ${value}`, 
        type: 'positive',
        timeout: 2000
      });
    };
    
    return {
      currentDate,
      showWaterKeypad,
      showElecKeypad,
      waterStats,
      elecStats,
      actionLinks,
      waterReadings,
      waterCharges,
      elecCharges,
      handlePrev,
      handleNext,
      handleActionClick,
      handleAddReading,
      handleEditReading,
      handleKeypadEnter
    };
  }
});
</script>

<style lang="scss" scoped>
.component-demo-page {
  background: #f5f5f5;
  padding: 20px;
}

.demo-container {
  max-width: 428px;
  margin: 0 auto;
  background: #FFFFFF;
  padding: 20px;
  border-radius: 8px;
}

.demo-title {
  text-align: center;
  color: $primary;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
}

.demo-section {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #666;
    margin-bottom: 16px;
  }
}
</style>




# MyCities UI Components

Reusable Quasar components extracted from the Figma design for consistent UI across the application.

## Components

### BillHeader
Header component with date, navigation arrows, due date badge, and period information.

**Props:**
- `currentDate` (Date) - Current date to display
- `daysUntilDue` (Number) - Days until final reading is due
- `periodStart` (String) - Start date of billing period
- `periodEnd` (String) - End date of billing period
- `amount` (Number) - Optional total amount to display
- `showAmount` (Boolean) - Show/hide amount
- `title` (String) - Optional page title
- `showTitle` (Boolean) - Show/hide title
- `canGoPrev` (Boolean) - Enable/disable previous navigation
- `canGoNext` (Boolean) - Enable/disable next navigation

**Events:**
- `prev` - Emitted when previous arrow is clicked
- `next` - Emitted when next arrow is clicked

**Usage:**
```vue
<BillHeader
  :current-date="new Date()"
  :days-until-due="17"
  period-start="10 Apr 2025"
  period-end="10 May 2025"
  :amount="6700"
  :show-amount="true"
  @prev="handlePrev"
  @next="handleNext"
/>
```

### MeterBar
Teal bar component displaying meter icon and either name or statistics.

**Props:**
- `type` (String) - 'water' or 'electricity'
- `name` (String) - Meter name (when not showing stats)
- `icon` (String) - Quasar icon name
- `stats` (Array) - Array of {label, value} objects
- `showStats` (Boolean) - Show statistics instead of name

**Usage:**
```vue
<MeterBar
  type="water"
  name="Water"
  icon="water_drop"
  :stats="[
    { label: 'Daily Usage', value: '1290 L' },
    { label: 'Total Usage', value: '33.90 kl' },
    { label: 'Daily Cost', value: 'R 77.90' }
  ]"
  :show-stats="true"
/>
```

### ActionLinks
Tab-like links component for "Enter reading" and "Show Details" actions.

**Props:**
- `links` (Array) - Array of {label, action, active?, highlight?} objects

**Events:**
- `click` - Emitted with action string when link is clicked

**Usage:**
```vue
<ActionLinks
  :links="[
    { label: 'Enter reading', action: 'enter-reading', active: true },
    { label: 'Show Details', action: 'show-details', highlight: true }
  ]"
  @click="handleAction"
/>
```

### ReadingKeypad
Bottom sheet dialog with numeric keypad for entering meter readings.

**Props:**
- `modelValue` (Boolean) - Control visibility
- `meterType` (String) - 'water' or 'electricity'
- `initialValue` (String) - Initial reading value

**Events:**
- `update:modelValue` - Visibility change
- `enter` - Emitted with reading value when ENTER is pressed
- `cancel` - Emitted when CANCEL is pressed
- `change` - Emitted on each digit change

**Usage:**
```vue
<ReadingKeypad
  v-model="showKeypad"
  meter-type="water"
  initial-value="09653-25"
  @enter="handleEnter"
  @cancel="handleCancel"
/>
```

### MeterReadingEntry
Component displaying meter number, reading history, and add/edit links.

**Props:**
- `meterNumber` (String) - Meter number to display
- `readings` (Array) - Array of reading objects {label, value, date?, editable?}
- `showAddLink` (Boolean) - Show "Add new reading" link
- `cooldownActive` (Boolean) - Show cooldown warning
- `cooldownHours` (Number) - Hours remaining in cooldown
- `cooldownMinutes` (Number) - Minutes remaining in cooldown
- `meterType` (String) - 'water' or 'electricity'

**Events:**
- `add` - Emitted when "Add new reading" is clicked
- `edit` - Emitted with reading object and index when Edit is clicked

**Usage:**
```vue
<MeterReadingEntry
  meter-number="132452"
  :readings="[
    { label: 'Start Reading 10th April', value: { black: '09140', red: '45' } },
    { label: 'Final Estimated', value: { black: '09653', red: '25' }, date: '17th April', editable: true }
  ]"
  :cooldown-active="true"
  :cooldown-hours="17"
  :cooldown-minutes="20"
  meter-type="water"
  @add="handleAdd"
  @edit="handleEdit"
/>
```

### MeterUsageCard
Complete card component for bill summary showing meter stats and projected charges.

**Props:**
- `meterType` (String) - 'water' or 'electricity'
- `meterName` (String) - Display name
- `icon` (String) - Quasar icon name
- `stats` (Array) - Statistics array
- `charges` (Array) - Charge breakdown array
- `projected` (Number) - Projected charges amount
- `showEnterReading` (Boolean) - Show "Enter reading" link

**Events:**
- `enter-reading` - Emitted when "Enter reading" is clicked

**Usage:**
```vue
<MeterUsageCard
  meter-type="water"
  meter-name="Water"
  icon="water_drop"
  :stats="waterStats"
  :charges="waterCharges"
  :projected="3000"
  @enter-reading="goToReadings"
/>
```

## Complete Example

```vue
<template>
  <q-page>
    <BillHeader
      :current-date="currentDate"
      :days-until-due="daysUntilDue"
      :period-start="periodStart"
      :period-end="periodEnd"
      :amount="total"
      :show-amount="true"
      @prev="prevPeriod"
      @next="nextPeriod"
    />
    
    <MeterUsageCard
      meter-type="water"
      meter-name="Water"
      icon="water_drop"
      :stats="waterStats"
      :charges="waterCharges"
      :projected="waterProjected"
      @enter-reading="showWaterKeypad = true"
    />
    
    <MeterUsageCard
      meter-type="electricity"
      meter-name="Electricity"
      icon="bolt"
      :stats="elecStats"
      :charges="elecCharges"
      :projected="elecProjected"
      @enter-reading="showElecKeypad = true"
    />
    
    <ReadingKeypad
      v-model="showWaterKeypad"
      meter-type="water"
      @enter="handleWaterEnter"
      @cancel="showWaterKeypad = false"
    />
  </q-page>
</template>
```



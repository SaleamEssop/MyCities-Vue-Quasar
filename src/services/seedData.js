/**
 * Seed Data Service
 * 
 * Provides realistic billing data for the MyCities app using DurbanTariff rates.
 * All amounts are in South African Rand (ZAR).
 * 
 * Water tiers are in Litres, costs are per KL (kiloliter).
 * Electricity tiers are in kWh.
 */

const STORAGE_KEYS = {
  BILLING_PERIODS: 'mycities_billing_periods',
  WATER_READINGS: 'mycities_water_readings',
  ELECTRICITY_READINGS: 'mycities_electricity_readings',
  METERS: 'mycities_meters',
  TARIFFS: 'mycities_tariffs',
  ACCOUNT: 'mycities_account',
  SEEDED: 'mycities_seeded',
};

// DurbanTariff rates (matching Laravel backend)
const DURBAN_TARIFF = {
  id: 10,
  name: 'DurbanTariff',
  region: 'Durban',
  billingDay: 15,
  readDay: 10,
  
  // Water In tiers (min/max in Litres, cost per KL)
  waterIn: [
    { min: 0, max: 6000, cost: 20 },       // 0-6 KL: R20/KL
    { min: 6000, max: 15000, cost: 30 },   // 6-15 KL: R30/KL
    { min: 15000, max: 45000, cost: 50 },  // 15-45 KL: R50/KL
    { min: 45000, max: 100000, cost: 70 }, // 45+ KL: R70/KL
  ],
  waterInAdditional: [
    { title: 'Infrastructure Surcharge', cost: 1.50, percentage: 100 },
  ],
  
  // Water Out (sewage) - 95% of water in
  waterOut: [
    { min: 0, max: 100000, cost: 15, percentage: 95 },
  ],
  waterOutAdditional: [
    { title: 'Sewage Disposal Charge', cost: 1.50, percentage: 95 },
  ],
  
  // Electricity tiers (in kWh)
  electricity: [
    { min: 0, max: 50, cost: 1.50 },       // 0-50 kWh: R1.50/kWh
    { min: 50, max: 350, cost: 2.00 },     // 50-350 kWh: R2.00/kWh
    { min: 350, max: 600, cost: 2.50 },    // 350-600 kWh: R2.50/kWh
    { min: 600, max: 100000, cost: 3.00 }, // 600+ kWh: R3.00/kWh
  ],
  
  // Fixed costs (charged every month)
  fixedCosts: [
    { name: 'Service Charge', value: 150 },
    { name: 'Meter Rental', value: 50 },
  ],
  
  // Customer editable costs
  customerCosts: [
    { name: 'Rates', value: 1200 },
    { name: 'Refuse Removal', value: 350 },
  ],
  
  vatPercentage: 15,
};

// Demo account info
const DEMO_ACCOUNT = {
  id: 'demo-account-1',
  name: 'Main House',
  nameAsPerBill: 'Saleam Essop',
  address: '123 Smith Street, Durban North, 4051',
  region: 'Durban',
  tariffId: 10,
  tariffName: 'DurbanTariff',
  billingDay: 15,
  readDay: 10,
};

// Seed data for meters
const METERS = {
  water: {
    id: 'WM-132452',
    number: '132452',
    type: 'water',
    location: '123 Smith Street, Durban North',
  },
  electricity: {
    id: 'EM-98736',
    number: '98736',
    type: 'electricity',
    location: '123 Smith Street, Durban North',
  },
};

// Generate 4 months of billing periods (Sep, Oct, Nov, Dec 2025)
const BILLING_PERIODS = [
  {
    id: 'period-2025-12',
    startDate: '2025-12-10',
    endDate: '2026-01-10',
    readingDueDate: '2025-12-15',
    status: 'current',
  },
  {
    id: 'period-2025-11',
    startDate: '2025-11-10',
    endDate: '2025-12-10',
    readingDueDate: '2025-11-15',
    status: 'closed',
  },
  {
    id: 'period-2025-10',
    startDate: '2025-10-10',
    endDate: '2025-11-10',
    readingDueDate: '2025-10-15',
    status: 'closed',
  },
  {
    id: 'period-2025-09',
    startDate: '2025-09-10',
    endDate: '2025-10-10',
    readingDueDate: '2025-09-15',
    status: 'closed',
  },
];

// Generate realistic water readings (~5 per month, ~1KL per day average)
// Starting meter reading: 100.000 KL (100000 Litres)
const WATER_READINGS = [
  // December 2025 (current period) - 5 readings so far
  { id: 'wr-2025-12-10', periodId: 'period-2025-12', date: '2025-12-10', redValue: '222', blackValue: '500', kiloliters: 222.500, type: 'start' },
  { id: 'wr-2025-12-12', periodId: 'period-2025-12', date: '2025-12-12', redValue: '224', blackValue: '200', kiloliters: 224.200, type: 'reading' },
  { id: 'wr-2025-12-15', periodId: 'period-2025-12', date: '2025-12-15', redValue: '226', blackValue: '800', kiloliters: 226.800, type: 'reading' },
  { id: 'wr-2025-12-18', periodId: 'period-2025-12', date: '2025-12-18', redValue: '229', blackValue: '100', kiloliters: 229.100, type: 'reading' },
  { id: 'wr-2025-12-20', periodId: 'period-2025-12', date: '2025-12-20', redValue: '231', blackValue: '000', kiloliters: 231.000, type: 'reading' },
  // No end reading yet (current period)
  
  // November 2025 - 5 readings
  { id: 'wr-2025-11-10', periodId: 'period-2025-11', date: '2025-11-10', redValue: '192', blackValue: '000', kiloliters: 192.000, type: 'start' },
  { id: 'wr-2025-11-15', periodId: 'period-2025-11', date: '2025-11-15', redValue: '196', blackValue: '500', kiloliters: 196.500, type: 'reading' },
  { id: 'wr-2025-11-20', periodId: 'period-2025-11', date: '2025-11-20', redValue: '201', blackValue: '200', kiloliters: 201.200, type: 'reading' },
  { id: 'wr-2025-11-25', periodId: 'period-2025-11', date: '2025-11-25', redValue: '206', blackValue: '800', kiloliters: 206.800, type: 'reading' },
  { id: 'wr-2025-11-30', periodId: 'period-2025-11', date: '2025-11-30', redValue: '212', blackValue: '300', kiloliters: 212.300, type: 'reading' },
  { id: 'wr-2025-12-10-end', periodId: 'period-2025-11', date: '2025-12-10', redValue: '222', blackValue: '500', kiloliters: 222.500, type: 'end' },
  
  // October 2025 - 5 readings
  { id: 'wr-2025-10-10', periodId: 'period-2025-10', date: '2025-10-10', redValue: '163', blackValue: '500', kiloliters: 163.500, type: 'start' },
  { id: 'wr-2025-10-15', periodId: 'period-2025-10', date: '2025-10-15', redValue: '167', blackValue: '200', kiloliters: 167.200, type: 'reading' },
  { id: 'wr-2025-10-20', periodId: 'period-2025-10', date: '2025-10-20', redValue: '171', blackValue: '800', kiloliters: 171.800, type: 'reading' },
  { id: 'wr-2025-10-26', periodId: 'period-2025-10', date: '2025-10-26', redValue: '177', blackValue: '000', kiloliters: 177.000, type: 'reading' },
  { id: 'wr-2025-10-31', periodId: 'period-2025-10', date: '2025-10-31', redValue: '182', blackValue: '500', kiloliters: 182.500, type: 'reading' },
  { id: 'wr-2025-11-10-end', periodId: 'period-2025-10', date: '2025-11-10', redValue: '192', blackValue: '000', kiloliters: 192.000, type: 'end' },
  
  // September 2025 - 5 readings
  { id: 'wr-2025-09-10', periodId: 'period-2025-09', date: '2025-09-10', redValue: '135', blackValue: '000', kiloliters: 135.000, type: 'start' },
  { id: 'wr-2025-09-14', periodId: 'period-2025-09', date: '2025-09-14', redValue: '138', blackValue: '500', kiloliters: 138.500, type: 'reading' },
  { id: 'wr-2025-09-20', periodId: 'period-2025-09', date: '2025-09-20', redValue: '144', blackValue: '200', kiloliters: 144.200, type: 'reading' },
  { id: 'wr-2025-09-26', periodId: 'period-2025-09', date: '2025-09-26', redValue: '150', blackValue: '800', kiloliters: 150.800, type: 'reading' },
  { id: 'wr-2025-09-30', periodId: 'period-2025-09', date: '2025-09-30', redValue: '155', blackValue: '000', kiloliters: 155.000, type: 'reading' },
  { id: 'wr-2025-10-10-end', periodId: 'period-2025-09', date: '2025-10-10', redValue: '163', blackValue: '500', kiloliters: 163.500, type: 'end' },
];

// Generate realistic electricity readings (~5 per month, ~15-20 kWh per day average)
// Starting meter reading: 50000 kWh
const ELECTRICITY_READINGS = [
  // December 2025 (current period) - 5 readings so far
  { id: 'er-2025-12-10', periodId: 'period-2025-12', date: '2025-12-10', value: '51850', kwh: 51850, type: 'start' },
  { id: 'er-2025-12-12', periodId: 'period-2025-12', date: '2025-12-12', value: '51885', kwh: 51885, type: 'reading' },
  { id: 'er-2025-12-15', periodId: 'period-2025-12', date: '2025-12-15', value: '51940', kwh: 51940, type: 'reading' },
  { id: 'er-2025-12-18', periodId: 'period-2025-12', date: '2025-12-18', value: '51995', kwh: 51995, type: 'reading' },
  { id: 'er-2025-12-20', periodId: 'period-2025-12', date: '2025-12-20', value: '52035', kwh: 52035, type: 'reading' },
  // No end reading yet (current period)
  
  // November 2025 - 5 readings
  { id: 'er-2025-11-10', periodId: 'period-2025-11', date: '2025-11-10', value: '51300', kwh: 51300, type: 'start' },
  { id: 'er-2025-11-15', periodId: 'period-2025-11', date: '2025-11-15', value: '51390', kwh: 51390, type: 'reading' },
  { id: 'er-2025-11-20', periodId: 'period-2025-11', date: '2025-11-20', value: '51485', kwh: 51485, type: 'reading' },
  { id: 'er-2025-11-25', periodId: 'period-2025-11', date: '2025-11-25', value: '51580', kwh: 51580, type: 'reading' },
  { id: 'er-2025-11-30', periodId: 'period-2025-11', date: '2025-11-30', value: '51680', kwh: 51680, type: 'reading' },
  { id: 'er-2025-12-10-end', periodId: 'period-2025-11', date: '2025-12-10', value: '51850', kwh: 51850, type: 'end' },
  
  // October 2025 - 5 readings
  { id: 'er-2025-10-10', periodId: 'period-2025-10', date: '2025-10-10', value: '50780', kwh: 50780, type: 'start' },
  { id: 'er-2025-10-15', periodId: 'period-2025-10', date: '2025-10-15', value: '50865', kwh: 50865, type: 'reading' },
  { id: 'er-2025-10-20', periodId: 'period-2025-10', date: '2025-10-20', value: '50955', kwh: 50955, type: 'reading' },
  { id: 'er-2025-10-26', periodId: 'period-2025-10', date: '2025-10-26', value: '51060', kwh: 51060, type: 'reading' },
  { id: 'er-2025-10-31', periodId: 'period-2025-10', date: '2025-10-31', value: '51150', kwh: 51150, type: 'reading' },
  { id: 'er-2025-11-10-end', periodId: 'period-2025-10', date: '2025-11-10', value: '51300', kwh: 51300, type: 'end' },
  
  // September 2025 - 5 readings
  { id: 'er-2025-09-10', periodId: 'period-2025-09', date: '2025-09-10', value: '50250', kwh: 50250, type: 'start' },
  { id: 'er-2025-09-14', periodId: 'period-2025-09', date: '2025-09-14', value: '50320', kwh: 50320, type: 'reading' },
  { id: 'er-2025-09-20', periodId: 'period-2025-09', date: '2025-09-20', value: '50430', kwh: 50430, type: 'reading' },
  { id: 'er-2025-09-26', periodId: 'period-2025-09', date: '2025-09-26', value: '50545', kwh: 50545, type: 'reading' },
  { id: 'er-2025-09-30', periodId: 'period-2025-09', date: '2025-09-30', value: '50620', kwh: 50620, type: 'reading' },
  { id: 'er-2025-10-10-end', periodId: 'period-2025-09', date: '2025-10-10', value: '50780', kwh: 50780, type: 'end' },
];

/**
 * Initialize seed data in localStorage
 * @param {boolean} force - If true, reset all data to defaults
 */
export function initializeSeedData(force = false) {
  const isSeeded = localStorage.getItem(STORAGE_KEYS.SEEDED);
  
  if (isSeeded && !force) {
    return false;
  }
  
  localStorage.setItem(STORAGE_KEYS.TARIFFS, JSON.stringify(DURBAN_TARIFF));
  localStorage.setItem(STORAGE_KEYS.METERS, JSON.stringify(METERS));
  localStorage.setItem(STORAGE_KEYS.BILLING_PERIODS, JSON.stringify(BILLING_PERIODS));
  localStorage.setItem(STORAGE_KEYS.WATER_READINGS, JSON.stringify(WATER_READINGS));
  localStorage.setItem(STORAGE_KEYS.ELECTRICITY_READINGS, JSON.stringify(ELECTRICITY_READINGS));
  localStorage.setItem(STORAGE_KEYS.ACCOUNT, JSON.stringify(DEMO_ACCOUNT));
  localStorage.setItem(STORAGE_KEYS.SEEDED, 'true');
  
  // Also save user accounts for account selection
  localStorage.setItem('mycities_user_accounts', JSON.stringify([
    { id: 1, name: 'Main House', description: 'Primary residence', region: 'Durban' },
  ]));
  
  return true;
}

/**
 * Reset all seed data to defaults (clears and re-initializes)
 */
export function resetSeedData() {
  clearSeedData();
  return initializeSeedData(true);
}

/**
 * Get tariffs
 */
export function getTariffs() {
  const stored = localStorage.getItem(STORAGE_KEYS.TARIFFS);
  return stored ? JSON.parse(stored) : DURBAN_TARIFF;
}

/**
 * Get account
 */
export function getAccount() {
  const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNT);
  return stored ? JSON.parse(stored) : DEMO_ACCOUNT;
}

/**
 * Get meters
 */
export function getMeters() {
  const stored = localStorage.getItem(STORAGE_KEYS.METERS);
  return stored ? JSON.parse(stored) : METERS;
}

/**
 * Get all billing periods
 */
export function getBillingPeriods() {
  const stored = localStorage.getItem(STORAGE_KEYS.BILLING_PERIODS);
  return stored ? JSON.parse(stored) : BILLING_PERIODS;
}

/**
 * Get billing period by ID
 */
export function getBillingPeriodById(id) {
  const periods = getBillingPeriods();
  return periods.find(p => p.id === id) || null;
}

/**
 * Get current billing period
 */
export function getCurrentBillingPeriod() {
  const periods = getBillingPeriods();
  return periods.find(p => p.status === 'current') || periods[0];
}

/**
 * Get all water readings
 */
export function getWaterReadings() {
  const stored = localStorage.getItem(STORAGE_KEYS.WATER_READINGS);
  return stored ? JSON.parse(stored) : WATER_READINGS;
}

/**
 * Get water readings for a period
 */
export function getWaterReadingsForPeriod(periodId) {
  const readings = getWaterReadings();
  return readings.filter(r => r.periodId === periodId).sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get latest water reading
 */
export function getLatestWaterReading() {
  const readings = getWaterReadings();
  return readings.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
}

/**
 * Save a new water reading
 */
export function saveWaterReading(reading) {
  const readings = getWaterReadings();
  const newReading = {
    ...reading,
    id: reading.id || `wr-${Date.now()}`,
    date: reading.date || new Date().toISOString().split('T')[0],
    meterId: METERS.water.id,
  };
  readings.unshift(newReading);
  localStorage.setItem(STORAGE_KEYS.WATER_READINGS, JSON.stringify(readings));
  return newReading;
}

/**
 * Get all electricity readings
 */
export function getElectricityReadings() {
  const stored = localStorage.getItem(STORAGE_KEYS.ELECTRICITY_READINGS);
  return stored ? JSON.parse(stored) : ELECTRICITY_READINGS;
}

/**
 * Get electricity readings for a period
 */
export function getElectricityReadingsForPeriod(periodId) {
  const readings = getElectricityReadings();
  return readings.filter(r => r.periodId === periodId).sort((a, b) => new Date(a.date) - new Date(b.date));
}

/**
 * Get latest electricity reading
 */
export function getLatestElectricityReading() {
  const readings = getElectricityReadings();
  return readings.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
}

/**
 * Save a new electricity reading
 */
export function saveElectricityReading(reading) {
  const readings = getElectricityReadings();
  const newReading = {
    ...reading,
    id: reading.id || `er-${Date.now()}`,
    date: reading.date || new Date().toISOString().split('T')[0],
    meterId: METERS.electricity.id,
  };
  readings.unshift(newReading);
  localStorage.setItem(STORAGE_KEYS.ELECTRICITY_READINGS, JSON.stringify(readings));
  return newReading;
}

/**
 * Calculate water charges using DurbanTariff tiered rates
 * Water tiers are in Litres, cost is per KL
 */
export function calculateWaterCharges(periodId) {
  const readings = getWaterReadingsForPeriod(periodId);
  let tariff = getTariffs();
  
  // Ensure tariff has waterIn array (handle old data format)
  if (!tariff.waterIn || !Array.isArray(tariff.waterIn)) {
    // Reset to new format if old data detected
    console.log('Old tariff format detected, resetting seed data...');
    clearSeedData();
    initializeSeedData(true);
    tariff = DURBAN_TARIFF; // Use default directly
  }
  
  const startReading = readings.find(r => r.type === 'start');
  const endReading = readings.find(r => r.type === 'end');
  const latestReading = readings[readings.length - 1];
  
  if (!startReading) {
    return {
      usage: 0,
      usageLitres: 0,
      waterInCharges: 0,
      waterInAdditional: 0,
      waterOutCharges: 0,
      waterOutAdditional: 0,
      total: 0,
      breakdown: [],
    };
  }
  
  // Use end reading if available, otherwise use latest reading
  const endKl = endReading ? endReading.kiloliters : latestReading.kiloliters;
  const usageKl = endKl - startReading.kiloliters;
  const usageLitres = usageKl * 1000;
  
  // Calculate Water In charges (tiered)
  let waterInCharges = 0;
  const breakdown = [];
  let remainingLitres = usageLitres;
  
  for (const tier of tariff.waterIn) {
    if (remainingLitres <= 0) break;
    
    const tierCapacity = tier.max - tier.min;
    const litresInTier = Math.min(remainingLitres, tierCapacity);
    const klInTier = litresInTier / 1000;
    const tierCharge = klInTier * tier.cost;
    
    waterInCharges += tierCharge;
    breakdown.push({
      tier: `${tier.min / 1000}-${tier.max / 1000} KL`,
      litres: litresInTier,
      kl: klInTier,
      rate: tier.cost,
      charge: tierCharge,
    });
    
    remainingLitres -= litresInTier;
  }
  
  // Calculate Water In Additional charges
  let waterInAdditional = 0;
  for (const additional of tariff.waterInAdditional) {
    const charge = usageKl * additional.cost * (additional.percentage / 100);
    waterInAdditional += charge;
  }
  
  // Calculate Water Out charges (95% of usage)
  let waterOutCharges = 0;
  for (const tier of tariff.waterOut) {
    const effectiveUsageLitres = usageLitres * (tier.percentage / 100);
    const effectiveKl = effectiveUsageLitres / 1000;
    waterOutCharges += effectiveKl * tier.cost;
  }
  
  // Calculate Water Out Additional charges
  let waterOutAdditional = 0;
  for (const additional of tariff.waterOutAdditional) {
    const effectiveKl = usageKl * (additional.percentage / 100);
    const charge = effectiveKl * additional.cost;
    waterOutAdditional += charge;
  }
  
  const total = waterInCharges + waterInAdditional + waterOutCharges + waterOutAdditional;
  
  return {
    usage: parseFloat(usageKl.toFixed(2)),
    usageLitres: Math.round(usageLitres),
    waterInCharges: parseFloat(waterInCharges.toFixed(2)),
    waterInAdditional: parseFloat(waterInAdditional.toFixed(2)),
    waterOutCharges: parseFloat(waterOutCharges.toFixed(2)),
    waterOutAdditional: parseFloat(waterOutAdditional.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    breakdown,
  };
}

/**
 * Calculate water charges for a given usage amount (in KL)
 * Used for projections
 */
export function calculateWaterChargesForUsage(usageKl) {
  const tariff = getTariffs();
  const usageLitres = usageKl * 1000;
  
  // Calculate Water In charges (tiered)
  let waterInCharges = 0;
  let remainingLitres = usageLitres;
  
  for (const tier of tariff.waterIn || []) {
    if (remainingLitres <= 0) break;
    const tierCapacity = tier.max - tier.min;
    const litresInTier = Math.min(remainingLitres, tierCapacity);
    const klInTier = litresInTier / 1000;
    waterInCharges += klInTier * tier.cost;
    remainingLitres -= litresInTier;
  }
  
  // Calculate Water In Additional charges (Infrastructure)
  let waterInAdditional = 0;
  for (const additional of tariff.waterInAdditional || []) {
    waterInAdditional += usageKl * additional.cost * (additional.percentage / 100);
  }
  
  // Calculate Water Out charges (Discharge - 95% of usage)
  let waterOutCharges = 0;
  for (const tier of tariff.waterOut || []) {
    const effectiveKl = usageKl * (tier.percentage / 100);
    waterOutCharges += effectiveKl * tier.cost;
  }
  
  // Calculate Water Out Additional charges
  let waterOutAdditional = 0;
  for (const additional of tariff.waterOutAdditional || []) {
    const effectiveKl = usageKl * (additional.percentage / 100);
    waterOutAdditional += effectiveKl * additional.cost;
  }
  
  const total = waterInCharges + waterInAdditional + waterOutCharges + waterOutAdditional;
  
  return {
    usageKl: parseFloat(usageKl.toFixed(2)),
    consumption: parseFloat(waterInCharges.toFixed(2)),      // Water In
    discharge: parseFloat(waterOutCharges.toFixed(2)),        // Water Out
    infrastructure: parseFloat((waterInAdditional + waterOutAdditional).toFixed(2)), // Additional charges
    total: parseFloat(total.toFixed(2)),
  };
}

/**
 * Calculate electricity charges for a given usage amount (in kWh)
 * Used for projections
 */
export function calculateElectricityChargesForUsage(usageKwh) {
  const tariff = getTariffs();
  
  let consumptionCharges = 0;
  let remainingKwh = usageKwh;
  
  for (const tier of tariff.electricity || []) {
    if (remainingKwh <= 0) break;
    const tierCapacity = tier.max - tier.min;
    const kwhInTier = Math.min(remainingKwh, tierCapacity);
    consumptionCharges += kwhInTier * tier.cost;
    remainingKwh -= kwhInTier;
  }
  
  return {
    usageKwh: Math.round(usageKwh),
    consumption: parseFloat(consumptionCharges.toFixed(2)),
    total: parseFloat(consumptionCharges.toFixed(2)),
  };
}

/**
 * Calculate electricity charges using DurbanTariff tiered rates
 */
export function calculateElectricityCharges(periodId) {
  const readings = getElectricityReadingsForPeriod(periodId);
  const tariff = getTariffs();
  
  const startReading = readings.find(r => r.type === 'start');
  const endReading = readings.find(r => r.type === 'end');
  const latestReading = readings[readings.length - 1];
  
  if (!startReading) {
    return {
      usage: 0,
      consumptionCharges: 0,
      total: 0,
      breakdown: [],
    };
  }
  
  // Use end reading if available, otherwise use latest reading
  const endKwh = endReading ? endReading.kwh : latestReading.kwh;
  const usage = endKwh - startReading.kwh;
  
  // Calculate tiered charges
  let consumptionCharges = 0;
  const breakdown = [];
  let remainingKwh = usage;
  
  for (const tier of tariff.electricity) {
    if (remainingKwh <= 0) break;
    
    const tierCapacity = tier.max - tier.min;
    const kwhInTier = Math.min(remainingKwh, tierCapacity);
    const tierCharge = kwhInTier * tier.cost;
    
    consumptionCharges += tierCharge;
    breakdown.push({
      tier: `${tier.min}-${tier.max} kWh`,
      kwh: kwhInTier,
      rate: tier.cost,
      charge: tierCharge,
    });
    
    remainingKwh -= kwhInTier;
  }
  
  return {
    usage,
    consumptionCharges: parseFloat(consumptionCharges.toFixed(2)),
    total: parseFloat(consumptionCharges.toFixed(2)),
    breakdown,
  };
}

/**
 * Calculate total bill for a period using DurbanTariff
 */
export function calculateTotalBill(periodId) {
  let tariff = getTariffs();
  
  // Ensure tariff has the required arrays
  if (!tariff.fixedCosts || !Array.isArray(tariff.fixedCosts)) {
    clearSeedData();
    initializeSeedData(true);
    tariff = DURBAN_TARIFF;
  }
  
  const waterCharges = calculateWaterCharges(periodId);
  const electricityCharges = calculateElectricityCharges(periodId);
  
  // Fixed costs
  const fixedCostsTotal = (tariff.fixedCosts || []).reduce((sum, c) => sum + (c.value || 0), 0);
  
  // Customer costs (Rates, Refuse, etc.)
  const customerCostsTotal = (tariff.customerCosts || []).reduce((sum, c) => sum + (c.value || 0), 0);
  
  // Subtotal before VAT
  const subtotal = waterCharges.total + electricityCharges.total + fixedCostsTotal;
  
  // VAT on consumption and fixed costs (not on rates/customer costs)
  const vatAmount = subtotal * (tariff.vatPercentage / 100);
  
  // Total
  const total = subtotal + vatAmount + customerCostsTotal;
  
  return {
    water: waterCharges,
    electricity: electricityCharges,
    fixedCosts: {
      items: tariff.fixedCosts,
      total: fixedCostsTotal,
    },
    customerCosts: {
      items: tariff.customerCosts,
      total: customerCostsTotal,
    },
    subtotal: parseFloat(subtotal.toFixed(2)),
    vat: {
      percentage: tariff.vatPercentage,
      amount: parseFloat(vatAmount.toFixed(2)),
    },
    total: parseFloat(total.toFixed(2)),
  };
}

/**
 * Calculate daily average and monthly projection
 * 
 * CALCULATION LOGIC:
 * 1. Daily average = Total usage / Days between first and last reading
 *    - Uses ACTUAL reading dates, not period start or today's date
 *    - Example: 5 KL used from Jan 15 to Jan 20 = 5 days = 1 KL/day
 * 
 * 2. Projected usage = Daily average × Days in billing period
 *    - Example: 1 KL/day × 31 days = 31 KL projected
 * 
 * ESTIMATION & RECONCILIATION (handled by backend BillingEngine):
 * - When readings span multiple periods, the backend estimates period-end readings
 * - END of one period = START of next period (bridging)
 * - When actual reading arrives after estimates, adjustment shown on current bill
 * - Past bills are never re-adjusted
 * 
 * @param {string} periodId - The billing period ID
 * @returns {object} Projection data including daily averages and projected costs
 */
export function calculateDailyAverageAndProjection(periodId) {
  const period = getBillingPeriodById(periodId);
  const waterReadings = getWaterReadingsForPeriod(periodId);
  const electricityReadings = getElectricityReadingsForPeriod(periodId);
  
  if (!period) return null;
  
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);
  
  // Days in full period
  const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  // Water calculations - use ACTUAL reading dates, not today's date
  const waterStart = waterReadings.find(r => r.type === 'start');
  const waterLatest = waterReadings[waterReadings.length - 1];
  const waterUsageKl = waterLatest && waterStart ? waterLatest.kiloliters - waterStart.kiloliters : 0;
  const waterUsageLitres = waterUsageKl * 1000;
  
  // Calculate days elapsed based on actual reading dates
  let waterDaysElapsed = 1;
  if (waterStart && waterLatest && waterStart.date !== waterLatest.date) {
    const waterStartDate = new Date(waterStart.date);
    const waterLatestDate = new Date(waterLatest.date);
    waterDaysElapsed = Math.max(1, Math.ceil((waterLatestDate - waterStartDate) / (1000 * 60 * 60 * 24)));
  }
  
  // Daily average in Litres (based on actual reading span)
  const waterDailyAvgLitres = waterDaysElapsed > 0 ? waterUsageLitres / waterDaysElapsed : 0;
  
  // Monthly projection (for full period)
  const waterProjectedUsageLitres = waterDailyAvgLitres * daysInPeriod;
  const waterProjectedUsageKl = waterProjectedUsageLitres / 1000;
  
  // Electricity calculations - use ACTUAL reading dates
  const elecStart = electricityReadings.find(r => r.type === 'start');
  const elecLatest = electricityReadings[electricityReadings.length - 1];
  const elecUsageKwh = elecLatest && elecStart ? elecLatest.kwh - elecStart.kwh : 0;
  
  // Calculate days elapsed based on actual reading dates
  let elecDaysElapsed = 1;
  if (elecStart && elecLatest && elecStart.date !== elecLatest.date) {
    const elecStartDate = new Date(elecStart.date);
    const elecLatestDate = new Date(elecLatest.date);
    elecDaysElapsed = Math.max(1, Math.ceil((elecLatestDate - elecStartDate) / (1000 * 60 * 60 * 24)));
  }
  
  // Daily average in kWh (based on actual reading span)
  const elecDailyAvgKwh = elecDaysElapsed > 0 ? elecUsageKwh / elecDaysElapsed : 0;
  
  // Monthly projection (for full period)
  const elecProjectedUsageKwh = elecDailyAvgKwh * daysInPeriod;
  
  // Calculate projected costs using proper tiered rates
  const waterProjectedCharges = calculateWaterChargesForUsage(waterProjectedUsageKl);
  const elecProjectedCharges = calculateElectricityChargesForUsage(elecProjectedUsageKwh);
  
  return {
    daysInPeriod,
    waterDaysElapsed,
    elecDaysElapsed,
    
    water: {
      currentUsageLitres: Math.round(waterUsageLitres),
      currentUsageKl: parseFloat(waterUsageKl.toFixed(2)),
      dailyAverageLitres: Math.round(waterDailyAvgLitres),
      projectedUsageLitres: Math.round(waterProjectedUsageLitres),
      projectedUsageKl: parseFloat(waterProjectedUsageKl.toFixed(2)),
      // Projected charges breakdown (using tiered rates)
      projectedConsumption: waterProjectedCharges.consumption,
      projectedDischarge: waterProjectedCharges.discharge,
      projectedInfrastructure: waterProjectedCharges.infrastructure,
      projectedCost: waterProjectedCharges.total,
    },
    
    electricity: {
      currentUsageKwh: elecUsageKwh,
      dailyAverageKwh: parseFloat(elecDailyAvgKwh.toFixed(1)),
      projectedUsageKwh: Math.round(elecProjectedUsageKwh),
      // Projected charges breakdown (using tiered rates)
      projectedConsumption: elecProjectedCharges.consumption,
      projectedCost: elecProjectedCharges.total,
    },
  };
}

/**
 * Get dashboard data for a period
 */
export function getDashboardData(periodId = null) {
  const period = periodId ? getBillingPeriodById(periodId) : getCurrentBillingPeriod();
  if (!period) return null;
  
  const account = getAccount();
  const meters = getMeters();
  const waterReadings = getWaterReadingsForPeriod(period.id);
  const electricityReadings = getElectricityReadingsForPeriod(period.id);
  const bill = calculateTotalBill(period.id);
  const projections = calculateDailyAverageAndProjection(period.id);
  
  // Calculate days
  const startDate = new Date(period.startDate);
  const endDate = new Date(period.endDate);
  const today = new Date();
  const dueDate = new Date(period.readingDueDate);
  
  const daysInPeriod = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
  const daysElapsed = Math.min(Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)), daysInPeriod);
  const daysUntilDue = Math.max(0, Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)));
  
  return {
    account,
    period: {
      id: period.id,
      startDate: period.startDate,
      endDate: period.endDate,
      readingDueDate: period.readingDueDate,
      status: period.status,
      daysInPeriod,
      daysElapsed,
      daysUntilDue,
    },
    meters,
    water: {
      meterNumber: meters.water.number,
      readings: waterReadings,
      startReading: waterReadings.find(r => r.type === 'start'),
      endReading: waterReadings.find(r => r.type === 'end'),
      latestReading: waterReadings[waterReadings.length - 1],
      usage: bill.water.usage,
      usageLitres: bill.water.usageLitres,
      dailyAverage: `${projections?.water.dailyAverageLitres || 0} L`,
      projectedUsage: `${projections?.water.projectedUsageKl || 0} KL`,
      charges: bill.water,
    },
    electricity: {
      meterNumber: meters.electricity.number,
      readings: electricityReadings,
      startReading: electricityReadings.find(r => r.type === 'start'),
      endReading: electricityReadings.find(r => r.type === 'end'),
      latestReading: electricityReadings[electricityReadings.length - 1],
      usage: bill.electricity.usage,
      dailyAverage: `${projections?.electricity.dailyAverageKwh || 0} kWh`,
      projectedUsage: `${projections?.electricity.projectedUsageKwh || 0} kWh`,
      charges: bill.electricity,
    },
    projections,
    bill,
  };
}

/**
 * Clear all seed data
 */
export function clearSeedData() {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  localStorage.removeItem('mycities_user_accounts');
}

export default {
  initializeSeedData,
  resetSeedData,
  getTariffs,
  getAccount,
  getMeters,
  getBillingPeriods,
  getBillingPeriodById,
  getCurrentBillingPeriod,
  getWaterReadings,
  getWaterReadingsForPeriod,
  getLatestWaterReading,
  saveWaterReading,
  getElectricityReadings,
  getElectricityReadingsForPeriod,
  getLatestElectricityReading,
  saveElectricityReading,
  calculateWaterCharges,
  calculateWaterChargesForUsage,
  calculateElectricityCharges,
  calculateElectricityChargesForUsage,
  calculateTotalBill,
  calculateDailyAverageAndProjection,
  getDashboardData,
  clearSeedData,
};

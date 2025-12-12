import { boot } from "quasar/wrappers";
import axios from "axios";

// Backend API base URL - points to Laravel server
// In development: http://localhost:8000
// In production: https://www.mycities.co.za (or window.location.origin)
const SERVER_URL = process.env.API_URL || 
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? window.location.origin 
    : "http://localhost:8000");

// Create axios instance - stores will be accessed inside the boot function
let api = null;
let userStoreInstance = null;

const getApi = () => {
  if (!api) {
    api = axios.create({ baseURL: `${SERVER_URL}/api` });
    api.interceptors.request.use((config) => {
      if (userStoreInstance) {
        config.headers["Authorization"] = `Bearer ${userStoreInstance.getToken}`;
      }
      return config;
    });
    api.interceptors.response.use((response) => {
      return response.data;
    });
  }
  return api;
};

const locationApi = axios.create({ baseURL: "https://geocode-api.arcgis.com" });

const GEOCODE_API_TOKEN =
  "AAPKc12c49d88ad5489486e82db8ebefb94aXNVU8kLARKQJ0rA5KFeUOYRjHqTU9l2phoZf1pFANCXNR-hkFOOQJmeFUYp4nnzQ";

const suggestLocation = async (text) => {
  return await locationApi.get(
    `/arcgis/rest/services/World/GeocodeServer/suggest?f=pjson&token=${GEOCODE_API_TOKEN}&text=${text}`
  );
};

const findAddressCandidates = async (singleLine, magicKey) => {
  return await locationApi.get(
    `/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson&token=${GEOCODE_API_TOKEN}&singleLine=${singleLine}&magicKey=${magicKey}&outSR=%7B%22wkid%22%3A102100%7D&countryCode=ZAF`
  );
};

const findEmailFromLocation = async (geometry) => {
  let request = {
    f: "json",
    returnGeometry: false,
    spatialRel: "esriSpatialRelIntersects",
    geometryType: "esriGeometryPoint",
    geometry: geometry,
    inSR: 102100,
    outFields: "*",
    outSR: 102100,
  };
  return await axios
    .create({
      baseURL: "https://services3.arcgis.com",
    })
    .get(
      "/HO0zfySJshlD6Twu/arcgis/rest/services/MeterReadingSuburbs/FeatureServer/0/query",
      {
        params: request,
      }
    );
};

// API Functions - these use getApi() to ensure the api instance exists
const userLogin = async (req) => {
  return await getApi().post("/v1/user/login", req);
};

const userSignUp = async (req) => {
  return await getApi().post("/v1/user/register", req);
};

const addSiteAndAccount = async (req) => {
  return await getApi().post("/v1/account/add", {
    user_id: userStoreInstance?.getUser?.id,
    ...req,
  });
};

const updateAccount = async (req) => {
  return await getApi().post("/v1/account/update", {
    user_id: userStoreInstance?.getUser?.id,
    ...req,
  });
};

const addMeterAndReading = async (req) => {
  return getApi().post("/v1/meter/add", req);
};

const getAllData = async () => {
  return await getApi().get(`/v1/all-data?user_id=${userStoreInstance?.getUser?.id}`);
};

const fetchMetersByAccountId = async (accountId) => {
  return await getApi().get(`/v1/meter/get?account_id=${accountId}`);
};

const addReadingInMeter = async (req) => {
  return await getApi().post("/v1/meter/add-readings", req);
};

const updateReadingInMeter = async (req) => {
  return await getApi().post("/v1/meter/update-readings", req);
};

const getAds = async () => {
  return await getApi().get("/v1/ads/get-categories");
};

// Delete Main account
const deleteMainAccount = async (req) => {
  return await getApi().post("/v1/account/delete", req);
};

// Delete Meter Account
const deleteMainMeter = async (req) => {
  return await getApi().post("/v1/meter/delete", req);
};

// Delete Meter Readings
const deleteMeterReadings = async (id) => {
  const formData = new FormData();
  if (id) {
    formData.append("reading_id", id.reading_id);
  }
  return await getApi().post("/v1/meter/delete-readings", formData);
};

// Get default Cost From Server
const defaultCost = async () => {
  return await getApi().get("/v1/default-cost/get");
};

// Get alarms from Server
const getAlarms = async () => {
  return await getApi().get("/v1/get-alarms");
};

// Get Tariff Templates From Server
const getTariffTemplates = async () => {
  return await getApi().get("/v1/tariff-templates");
};

// Forgot password verification
const forgotPasswordVerification = async (email) => {
  return await getApi().post("/v1/forgot-password/email-verification", email);
};

// Forgot password verification code
const forgotPasswordVerificationCode = async (payload) => {
  return await getApi().post("/v1/forgot-password/verify-code", payload);
};

// Reset new password
const resetNewPassword = async (payload) => {
  return await getApi().post("/v1/forgot-password/reset-password", payload);
};

const waterThumb =
  "https://media.istockphoto.com/vectors/water-faucet-icon-vector-vector-id604383296?k=20&m=604383296&s=612x612&w=0&h=rAPcq11vU1posV21tn1d6Tu6NeNIC0sGUwJ6gPZ8oW0=";
const electThumb =
  "https://cdn3.iconfinder.com/data/icons/wsd-power/512/power-09-512.png";

// This function needs store access - will be called after boot
let meterStoreInstance = null;
let readingStoreInstance = null;

const fetchAndSaveMeterOnAccount = (accountId) => {
  fetchMetersByAccountId(accountId).then(({ status, data }) => {
    if (status && meterStoreInstance && readingStoreInstance) {
      const metersSplit = data.reduce(
        (acc, meter) => {
          const singleMeter = meter;
          const decimal = singleMeter.meter_type_id == 2 ? 10.0 : 10000.0;

          const newReadings = meter.readings.map((reading) => {
            return {
              id: reading.id,
              meter: { id: reading.meter_id },
              time: new Date(reading.reading_date).getTime(),
              value: parseFloat(reading.reading_value) / decimal,
              valueInString: reading.reading_value,
            };
          });
          acc.readings.push(...newReadings);

          acc.meters.push({
            account: { id: singleMeter.account_id },
            id: singleMeter.id,
            number: singleMeter.meter_number,
            title: singleMeter.meter_title,
            type: {
              id: singleMeter.meter_type_id,
              title: singleMeter.meter_title,
              thumbnail:
                singleMeter.meter_type_id === 2 ? electThumb : waterThumb,
            },
          });
          delete meter.readings;
          return acc;
        },
        { meters: [], readings: [] }
      );
      meterStoreInstance.saveMeterByAccountId(metersSplit.meters, accountId);
      readingStoreInstance.saveReadings(metersSplit.readings);
    }
  });
};

export default boot(({ app }) => {
  try {
    console.log("[axios boot] Starting...");
    
    // Import stores inside boot function (Vue context is available)
    const { useUserStore } = require("src/stores/user");
    const { useMeterStore } = require("src/stores/meter");
    const { useReadingStore } = require("src/stores/reading");

    console.log("[axios boot] Stores imported");
    
    // Initialize store instances
    userStoreInstance = useUserStore();
    meterStoreInstance = useMeterStore();
    readingStoreInstance = useReadingStore();

    console.log("[axios boot] Stores initialized");
    
    // Initialize the API with the user store
    getApi();

    console.log("[axios boot] API initialized");
    
    // Make axios available globally in Vue components
    app.config.globalProperties.$axios = axios;
    app.config.globalProperties.$api = getApi();
    app.config.globalProperties.$locationApi = locationApi;
    
    console.log("[axios boot] Complete!");
  } catch (error) {
    console.error("[axios boot] ERROR:", error);
  }
});

export {
  getApi as api,
  locationApi,
  suggestLocation,
  findAddressCandidates,
  findEmailFromLocation,
  userLogin,
  userSignUp,
  addSiteAndAccount,
  updateAccount,
  getAllData,
  fetchAndSaveMeterOnAccount,
  addReadingInMeter,
  updateReadingInMeter,
  addMeterAndReading,
  getAds,
  deleteMainAccount,
  deleteMainMeter,
  defaultCost,
  SERVER_URL,
  getAlarms,
  forgotPasswordVerification,
  forgotPasswordVerificationCode,
  resetNewPassword,
  deleteMeterReadings,
  getTariffTemplates,
};

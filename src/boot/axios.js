import { boot } from "quasar/wrappers";
import axios from "axios";
import { useUserStore } from "src/stores/user";

import { useAccountStore } from "src/stores/account";
import { useMeterStore } from "src/stores/meter";
import { useReadingStore } from "src/stores/reading";

const userStore = useUserStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();
const readingStore = useReadingStore();

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

// const SERVER_URL = "";
// const SERVER_URL = "https://mycities.co.za"; // prod
//const SERVER_URL = "http://146.190.105.178";
// const SERVER_URL = "http://157.245.194.89"; // staging

// const SERVER_URL = "http://127.0.0.1:8000";
const SERVER_URL = process.env.API;

const api = axios.create({ baseURL: `${SERVER_URL}/api` });
api.interceptors.request.use((config) => {
  config.headers["Authorization"] = `Bearer ${userStore.getToken}`;
  return config;
});
api.interceptors.response.use((response) => {
  return response.data;
});

const locationApi = axios.create({ baseURL: "https://geocode-api.arcgis.com" });

const GEOCODE_API_TOKEN =
  "AAPKc12c49d88ad5489486e82db8ebefb94aXNVU8kLARKQJ0rA5KFeUOYRjHqTU9l2phoZf1pFANCXNR-hkFOOQJmeFUYp4nnzQ";

const suggestLocation = async (text) => {
  return await locationApi.get(
    `/arcgis/rest/services/World/GeocodeServer/suggest?f=pjson&countryCode=za&token=${GEOCODE_API_TOKEN}&text=${text}`
  );
};

const findAddressCandidates = async (singleLine, magicKey) => {
  // console.log(singleLine);
  return await locationApi.get(
    `/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?f=pjson&token=${GEOCODE_API_TOKEN}&singleLine=${singleLine}&magicKey=${magicKey}&outSR=%7B%22wkid%22%3A102100%7D&countryCode=ZAF`
  );
  //outSR=%7B%22wkid%22%3A102100%7D
};

const findEmailFromLocation = async (geometry) => {
  //console.log(geometry);
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

//SignUp

const userLogin = async (req) => {
  return await api.post("/v1/user/login", req);
};

const userSignUp = async (req) => {
  return await api.post("/v1/user/register", req);
};

const addSiteAndAccount = async (req) => {
  return await api.post("/v1/account/add", {
    user_id: userStore.getUser.id,
    ...req,
  });
};

const getAllRegion = async () => {
  return await api.get("/v1/regions/get");
};

const getAllAccount = async () => {
  return await api.get("/v1/accountType/get");
};
const regionsgetEmails = async (req) => {
  return await api.get(`/v1/regions/getEmails/${req}`);
};
const getAdditionalCost = async (accountId, regionId, accountTypeId) => {
  return await api.get(
    `/v1/regions/getAdditionalCost?account_id=${accountId}&region_id=${regionId}&account_type_id=${accountTypeId}`
  );
};

const getBillday = async (accountId) => {
  return await api.get(`/v1/regions/getBillday?account_id=${accountId}`);
};

const updateAccount = async (req) => {
  return await api.post("/v1/account/update", {
    user_id: userStore.getUser.id,
    ...req,
  });
};

const addMeterAndReading = async (req) => {
  return api.post("/v1/meter/add", req);
};

const getAllData = async () => {
  return await api.get(`/v1/all-data?user_id=${userStore.getUser?.id}`);
};
const getParticularMeterCost = (
  accountId,
  meter_id,
  type,
  start_date,
  end_date
) => {
  return api.get(
    `/v1/regions/getEastimateCost?account_id=${accountId}&meter_id=${meter_id}&type=${type}&start_date=${start_date}&end_date=${end_date}`
  );
};

const fetchMetersByAccountId = async (accountId) => {
  return await api.get(`/v1/meter/get?account_id=${accountId}`);
};

const addReadingInMeter = async (req) => {
  return await api.post("/v1/meter/add-readings", req);
};

const updateReadingInMeter = async (req) => {
  return await api.post("/v1/meter/update-readings", req);
};

// const getAds = async () => {
//   return await api.get("/v1/ads/get");
// };
const getAds = async () => {
  return await api.get("/v1/menu/get-categories");
};

// Delete Main account
const deleteMainAccount = async (req) => {
  return await api.post("/v1/account/delete", req);
};

const deleteMainSiteAccount = async (req) => {
  return await api.post("/v1/sites/delete", req);
};

// Delete Meter Account
const deleteMainMeter = async (req) => {
  return await api.post("/v1/meter/delete", req);
};

// Delete Meter Readings
const deleteMeterReadings = async (id) => {
  const formData = new FormData();
  if (id) {
    formData.append("reading_id", id.reading_id);
  }
  return await api.post("/v1/meter/delete-readings", formData);
};

//Get default Cost From Server
const defaultCost = async () => {
  return await api.get("/v1/default-cost/get");
};

//Get default Cost From Server
const getAlarms = async () => {
  return await api.get("/v1/get-alarms");
};

// Forgot password verification
const forgotPasswordVerification = async (email) => {
  return await api.post("/v1/forgot-password/email-verification", email);
};

// Forgot password verification code
const forgotPasswordVerificationCode = async (payload) => {
  return await api.post("/v1/forgot-password/verify-code", payload);
};

// reset new password
const resetNewPassword = async (payload) => {
  return await api.post("/v1/forgot-password/reset-password", payload);
};

const waterThumb =
  "https://media.istockphoto.com/vectors/water-faucet-icon-vector-vector-id604383296?k=20&m=604383296&s=612x612&w=0&h=rAPcq11vU1posV21tn1d6Tu6NeNIC0sGUwJ6gPZ8oW0=";
const electThumb =
  "https://cdn3.iconfinder.com/data/icons/wsd-power/512/power-09-512.png";

const fetchAndSaveMeterOnAccount = (accountId) => {
  fetchMetersByAccountId(accountId).then(({ status, data }) => {
    if (status) {
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
      meterStore.saveMeterByAccountId(metersSplit.meters, accountId);
      readingStore.saveReadings(metersSplit.readings);
    }
  });
};
export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  app.config.globalProperties.$locationApi = locationApi;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

export {
  api,
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
  getAllRegion,
  getAllAccount,
  regionsgetEmails,
  getParticularMeterCost,
  getAdditionalCost,
  getBillday,
  deleteMainSiteAccount,
};

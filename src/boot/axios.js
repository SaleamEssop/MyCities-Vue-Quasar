import { boot } from "quasar/wrappers";
import axios from "axios";
import { useUserStore } from "src/stores/user";

import { useAccountStore } from "src/stores/account";
import { useMeterStore } from "src/stores/meter";
import { useReadingStore } from "src/stores/reading";

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: "http://146.190.105.178/api" });
api.interceptors.response.use((response) => {
  return response.data;
});

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

//SignUp

const userStore = useUserStore();
const accountStore = useAccountStore();
const meterStore = useMeterStore();
const readingStore = useReadingStore();

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

const addMeterAndReading = async (req) => {
  return api.post("/v1/meter/add", req);
};

// const updateAccount = async (req) => {
//   return await api.post("/v1/account/add", {
//     user_id: userStore.getUser.id,
//     ...req,
//   });
// };

const getAllData = async () => {
  return await api.get(`/v1/all-data?user_id=${userStore.getUser.id}`);
};

const fetchMetersByAccountId = async (accountId) => {
  return await api.get(`/v1/meter/get?account_id=${accountId}`);
};

const addReadingInMeter = async (req) => {
  return await api.post("/v1/meter/add-readings");
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
              time: new Date(reading.updated_at).getTime(),
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
  getAllData,
  fetchAndSaveMeterOnAccount,
  addReadingInMeter,
  addMeterAndReading,
};

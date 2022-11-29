import { boot } from "quasar/wrappers";
import axios from "axios";

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

const userLogin = async (req) => {
  return api.post("/v1/user/login", req);
};

const userSignUp = async (req) => {
  return api.post("/v1/user/register", req);
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
};

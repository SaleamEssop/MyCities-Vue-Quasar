import { boot } from "quasar/wrappers";
import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LTileLayer } from "@vue-leaflet/vue-leaflet";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ app, router }) => {
  // LMap.install(app);
  // LGeoJson.install(app);
  app.component("LMap", LMap);
  app.component("LMarker", LMarker);
  app.component("LTileLayer", LTileLayer);

  app.config.globalProperties.$METER_TYPES = Object.freeze([
    {
      title: "Water",
      id: 1,
      thumbnail:
        "https://media.istockphoto.com/vectors/water-faucet-icon-vector-vector-id604383296?k=20&m=604383296&s=612x612&w=0&h=rAPcq11vU1posV21tn1d6Tu6NeNIC0sGUwJ6gPZ8oW0=",
    },
    {
      title: "Electricity",
      id: 2,
      thumbnail:
        "https://cdn3.iconfinder.com/data/icons/wsd-power/512/power-09-512.png",
    },
  ]);
  // something to do
});

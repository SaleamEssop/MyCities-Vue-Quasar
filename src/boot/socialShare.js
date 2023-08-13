import { boot } from "quasar/wrappers";
import VueSocialSharing from "vue-social-sharing";
export default boot(async ({ app }) => {
  app.use(VueSocialSharing)
});

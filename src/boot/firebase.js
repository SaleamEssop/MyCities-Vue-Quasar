import { boot } from "quasar/wrappers";

// Store instances - initialized in boot function
let userStore = null;
let siteStore = null;
let accountStore = null;
let adStore = null;
let defaultCostStore = null;
let alarmStore = null;

const updateAllData = () => {
  // Skip API calls if stores aren't ready
  if (!userStore || !userStore.getUser) {
    console.log("Skipping data fetch - user not logged in");
    return;
  }

  // Import API functions
  const { getAllData, getAds, defaultCost, getAlarms } = require("boot/axios");
  
  getAllData().then((response) => {
    const data = response?.data || response;
    if (!data || !siteStore || !accountStore) return;
    
    // Handle case where data is not an array
    if (!Array.isArray(data)) {
      console.log("getAllData response is not an array:", data);
      return;
    }
    
    const sitesSplit = data.reduce(
      (acc, site) => {
        acc.accounts = acc.accounts.concat(
          (site.account || []).map((account) => {
            return {
              title: account.account_name,
              id: account.id,
              number: account.account_number,
              option: account.optional_information,
              site: { id: account.site_id },
              tariff_template_id: account.tariff_template_id,
              fixedCosts: (account.fixed_costs || []).map((cost) => {
                return {
                  title: cost.title,
                  value: parseFloat(cost.value),
                  isApplicable: cost.is_active == 1,
                  isFromUser: true,
                  id: cost.id,
                };
              }),
              defaultFixedCost: account.default_fixed_costs,
            };
          })
        );
        site["latLng"] = { lat: site.lat, lng: site.lng };
        delete site.account;
        delete site.lat;
        delete site.lng;
        acc.sites.push(site);

        return acc;
      },
      { sites: [], accounts: [] }
    );
    siteStore.replace(sitesSplit.sites);
    accountStore.replace(sitesSplit.accounts);
  }).catch((err) => {
    console.log("Error fetching all data:", err);
  });
  
  getAds().then((response) => {
    const data = response?.data || response;
    if (adStore && data) {
      adStore.setAds(Array.isArray(data) ? data : []);
    }
  }).catch((err) => {
    console.log("Error fetching ads:", err);
  });
  
  defaultCost().then((response) => {
    const data = response?.data || response;
    if (defaultCostStore && data) {
      defaultCostStore.setDefaultCost(data);
    }
  }).catch((err) => {
    console.log("Error fetching default cost:", err);
  });
  
  getAlarms().then((response) => {
    const data = response?.data || response;
    if (alarmStore && data) {
      alarmStore.setAlarms(Array.isArray(data) ? data : []);
    }
  }).catch((err) => {
    console.log("Error fetching alarms:", err);
  });
};

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, app }) => {
  // Import stores inside boot function (Vue context is available)
  const { useUserStore } = require("src/stores/user");
  const { useSiteStore } = require("src/stores/site");
  const { useAccountStore } = require("src/stores/account");
  const { useAdStore } = require("src/stores/ads");
  const { useDefaultCostStore } = require("src/stores/defaultCost");
  const { useGetAlarmsStore } = require("src/stores/alarm");

  // Initialize store instances
  userStore = useUserStore();
  siteStore = useSiteStore();
  accountStore = useAccountStore();
  adStore = useAdStore();
  defaultCostStore = useDefaultCostStore();
  alarmStore = useGetAlarmsStore();

  // DON'T fetch data on boot - wait until user is logged in
  // updateAllData();

  // Navigation guard for authentication
  router.beforeEach((to, from, next) => {
    const user = userStore.getUser;
    
    // Check if route requires auth
    if (to.meta.requiresAuth && !user) {
      // Redirect to login if not authenticated
      next("/login");
    } else if (user && (to.path === "/auth/login" || to.path === "/login")) {
      // Redirect to home if already authenticated
      next("/");
    } else {
      next();
    }
  });
});

export { updateAllData };

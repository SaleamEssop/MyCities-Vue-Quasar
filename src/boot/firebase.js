import { boot } from "quasar/wrappers";
// import firebase from 'firebase'
// import { initializeApp, getCurrentUser } from "firebase/app";
// import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBm2iQusA8JG7sKxXU0aRj6YXqefMH7vps",
  authDomain: "essop-115c5.firebaseapp.com",
  projectId: "essop-115c5",
  storageBucket: "essop-115c5.appspot.com",
  messagingSenderId: "1002729962409",
  appId: "1:1002729962409:web:e6b9209a285f44965922b8",
};

import { useUserStore } from "src/stores/user";
import { useSiteStore } from "src/stores/site";
import { useAccountStore } from "src/stores/account";
import { useAdStore } from "src/stores/ads";

import { getAllData, getAds, defaultCost, SERVER_URL } from "boot/axios";
import { useDefaultCostStore } from "src/stores/defaultCost";

const userStore = useUserStore();
const siteStore = useSiteStore();
const accountStore = useAccountStore();
const adStore = useAdStore();
const defaultCostStore = useDefaultCostStore();

const updateAllData = () => {
  getAllData().then(({ status, data }) => {
    const sitesSplit = data.reduce(
      (acc, site) => {
        acc.accounts = acc.accounts.concat(
          site.account.map((account) => {
            return {
              title: account.account_name,
              id: account.id,
              number: account.account_number,
              option: account.optional_information,
              site: { id: account.site_id },
              fixedCosts: account.fixed_costs.map((cost) => {
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
  });
};

const updateAds = () => {
  getAds().then(({ status, data }) => {
    adStore.setAds(
      data
      // data.map((ad) => {
      //   ad.image = `${SERVER_URL}/${ad.image}`;
      //   return ad;
      // })
    );
  });
};

const updateDefaultCost = () => {
  defaultCost().then(({ status, data }) => {
    defaultCostStore.setDefaultCost(data);
  });
};

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, app }) => {
  updateAllData();
  updateAds();
  updateDefaultCost();

  router.beforeEach((to, from, next) => {
    const user = userStore.getUser;
    if (!user && to.path != "/auth/login") {
      next("/auth/login");
    } else if (user) {
      // if (!user.emailVerified && to.path != "/auth/verifyEmail" && to.path != "/auth/completeAccount") {
      //   next("/auth/verifyEmail");
      // } else
      if (
        to.path == "/auth/login" ||
        to.path == "/auth/verifyEmail" ||
        to.path == "/auth/completeAccount"
      ) {
        next("/");
      } else {
        next();
      }
    } else {
      next();
    }
  });
  // initializeApp(firebaseConfig);
  // const auth = getAuth();
  // router.beforeEach((to, from, next) => {
  //   return new Promise((resolve, reject) => {
  //     const unsubscribe = auth.onAuthStateChanged(function (user) {
  //       unsubscribe();
  //       if (!user && to.path != "/auth/login") {
  //         next("/auth/login");
  //       } else if (user) {
  //         // if (!user.emailVerified && to.path != "/auth/verifyEmail" && to.path != "/auth/completeAccount") {
  //         //   next("/auth/verifyEmail");
  //         // } else
  //         if (
  //           to.path == "/auth/login" ||
  //           to.path == "/auth/verifyEmail" ||
  //           to.path == "/auth/completeAccount"
  //         ) {
  //           next("/");
  //         } else {
  //           next();
  //         }
  //       } else {
  //         next();
  //       }
  //       resolve(user);
  //     }, reject);
  //   });
  // });
});

export { updateAllData };

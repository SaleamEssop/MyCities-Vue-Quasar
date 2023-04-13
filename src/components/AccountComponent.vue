<template>
  <q-card>
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Necessary Details</div>
    </q-card-section>
    <q-card-section>

      <q-select color="black" type="text" label="Enter a location address" use-input input-debounce="0"
        :options="siteOptions" @filter="filterFn" behavior="menu" v-model="site" option-label="address" emit-value
        map-options v-if="isNew" />
      <div v-else>
        {{ site?.address }}
      </div>

      <h6>Email {{ site?.email }}</h6>

      <q-select color="black" v-model="regionmodel" v-if="isNew" @update:model-value="onchangeRegion($event)"
        :options="regionOptions" label="Enter Region" option-value="id" option-label="name" />
      <div v-else>
        <q-select color="black" v-model="selectedAccount.region_id"
          @update:model-value="onchangeRegion($event, selectedAccount)" :options="regionOptions" map-options
          label="Enter Region" option-value="id" option-label="name" />
      </div>

      <q-select color="black" v-model="accountmodel" v-if="isNew" :options="accountOptions" label="Enter Account"
        option-value="id" option-label="type" />
      <div v-else>
        <q-select color="black" v-model="selectedAccount.account_type_id" :options="accountOptions" label="Enter Account"
          option-value="id" map-options option-label="type" />
      </div>
      <q-input color="black" type="text" v-model="water_email" v-if="isNew" label="Enter Water Email" />
      <div v-else>
        <q-input color="black" type="text" v-model="selectedAccount.water_email" label="Enter Water Email" />
      </div>

      <q-input color="black" type="text" v-model="electricity_email" v-if="isNew" label="Enter Electricity Email" />
      <div v-else>
        <q-input color="black" type="text" v-model="selectedAccount.electricity_email" label="Enter Electricity Email" />
      </div>
      <q-input color="black" type="text" label="Enter name - As per bill" v-if="isNew"
        v-model.trim="selectedAccount.title" />
      <div v-else>Name : -{{ selectedAccount.title }}</div>

      <q-input color="black" type="text" label="Enter account number - As per bill" v-if="isNew"
        v-model="selectedAccount.number" />
      <div v-else>Account :- {{ selectedAccount.number }}</div>
    </q-card-section>

    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Description under Account setup</div>
    </q-card-section>
    <q-card-section>
      <q-input color="black" type="text" label="Account description" v-model="selectedAccount.option" />
    </q-card-section>
    <!-- <q-card-section class="bg-primary">
      <div class="text-subtitle2">Fixed Cost - according to bill</div>
      <q-btn
        fab
        color="white"
        text-color="primary"
        icon="help"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-0%)"
      />
    </q-card-section> -->

    <!-- <q-card-actions align="center">
      <q-btn
        color="primary"
        text-color="black"
        icon="add"
        label="Add Fixed Cost"
        glossy
        @click="addFixedCostField"
      />
    </q-card-actions> -->
    <!-- Default cost from server -->
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Additional Data</div>
      <!-- <q-btn
        fab
        color="white"
        text-color="primary"
        icon="help"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-0%)"
      /> -->
    </q-card-section>

    <!-- v-for="(defaultCost, index) in selectedAccount.defaultCosts" -->
    <!-- edit update -->
    <!-- v-for="(defaultCost, index) in isNew ? selectedAccount.defaultCosts  : selectedAccount.defaultFixedCost" -->

    <template v-for="(defaultCost, index) in isNew
      ? selectedAccount.defaultCosts
      : selectedAccount.defaultFixedCost" :key="index">
      <q-separator />

      <q-card-section>
        <div class="flex justify-between items-center">
          <div v-if="defaultCost" class="text-h7">
            {{ isNew ? defaultCost.title : defaultCost.fixed_cost.title }}
            <!-- {{ defaultCost.title }} -->
          </div>
          <q-toggle v-model="defaultCost.isApplicable" />
          <!-- :model-value="defaultCost.isApplicable" -->
        </div>
        <q-input v-if="isNew" :placeholder="
          defaultCost.title === 'Enter Your Billing Date'
            ? 'Enter Only Dates'
            : 'R0.00'
        " v-model.number="defaultCost.value" type="number" :disable="!defaultCost.isApplicable" />
        <!-- :readonly="
            defaultCost.title === 'Rates' ||
            defaultCost.title === 'Refuse Collection'
              ? false
              : true
          " -->
        <q-input v-else :placeholder="
          defaultCost.fixed_cost.title === 'Enter Your Billing Date'
            ? 'Enter Only Dates'
            : 'R0.00'
        " v-model.number="defaultCost.value" type="number" :disable="!defaultCost.isApplicable" />
        <!-- :readonly="
            defaultCost.fixed_cost.title === 'Rates' ||
            defaultCost.fixed_cost.title === 'Refuse Collection'
              ? false
              : true
          " -->
      </q-card-section>
    </template>

    <q-separator />
    <q-space />
    <q-card-actions align="center">
      <q-btn color="red" v-if="!autoUpdate" text-color="white" class="q-my-none q-mx-none" label="Cancel" glossy
        @click="$emit('close')" />

      <q-btn color="primary" text-color="black" v-if="!autoUpdate" class="q-my-none q-mx-noe" label="Save" glossy
        @click="onSaveSelectAccount" />
    </q-card-actions>
  </q-card>
</template>
<script>
import { ref, reactive, watch, computed, defineComponent } from "vue";
import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";
import { useQuasar } from "quasar";
import { useDefaultCostStore } from "src/stores/defaultCost";
import { getProxyData } from "src/utils";
import { getAllRegion, getAllAccount, regionsgetEmails } from "boot/axios";

import {
  locationApi,
  suggestLocation,
  findAddressCandidates,
  findEmailFromLocation,
  addSiteAndAccount,
  updateAccount,
} from "boot/axios";

//import { updateAllData } from "boot/firebase";

const nullAccount = {
  id: Date.now(),
  title: null,
  number: null,
  option: null,
  site: { id: null, email: null },
  fixedCosts: [],
  defaultCosts: []
  // fixedCosts: [
  //   {
  //     id: Date.now(),
  //     title: "Rates",
  //     value: null,
  //     isApplicable: false,
  //     isFromServer: true,
  //     isFromUser: false,
  //   },
  //   {
  //     id: Date.now(),
  //     title: "Refuse Collection",
  //     value: null,
  //     isApplicable: false,
  //     isFromServer: true,
  //     isFromUser: false,
  //   },
  // ],
};
const defaultCostStore = useDefaultCostStore();
// const getDefaultCost = computed(() => defaultCostStore.getDefaultCost);

export default defineComponent({
  name: "AccountComponent",
  props: {
    account: Object,
    autoUpdate: { type: Boolean, default: false }
  },

  methods: {
    onchangeRegion(val, selectedAccount) {
      //console.log(site);
      if (selectedAccount && selectedAccount.region_id) {
        // for edit account
        regionsgetEmails(val.id).then((res) => {
          selectedAccount.water_email = res.water_email;
          selectedAccount.electricity_email = res.water_email;
        });
      } else {
        regionsgetEmails(val.id).then((res) => {
          this.water_email = res.water_email;
          this.electricity_email = res.electricity_email;
        });
      }

    }
  },
  emits: ["update:account"],
  setup(props, { emit }) {

    const accountOptions = ref([])
    const regionsOptions = ref([])
    const regionmodel = ref([])
    const accountmodel = ref([])
    const water_email = ref()
    const electricity_email = ref()

    const initialState = {
      site: null,
      selectedAccount: JSON.parse(JSON.stringify(props.account || nullAccount)),
    };

    // get Account Type
    let response = getAllAccount().then((res) => {
      res.data.forEach(item => {
        accountOptions.value = res.data;
      });
    });

    // get Regions Type
    let region = getAllRegion().then((res) => {
      res.data.forEach(item => {
        regionsOptions.value = res.data;
      });
    });

    initialState["selectedAccount"]["defaultCosts"] =
      defaultCostStore.getDefaultCost.map((_cost) => {
        if (_cost.title === "Rates Rebate") {
          _cost["isApplicable"] = false;
        } else {
          _cost["isApplicable"] = true;
        }
        return _cost;
      });

    const siteStore = useSiteStore();
    const accountStore = useAccountStore();

    const $q = useQuasar();
    const selectedAccount = ref(initialState.selectedAccount);

    selectedAccount.value.defaultFixedCost?.map((_cost) => {
      if (_cost.is_active === 1) {
        _cost["isApplicable"] = true;
      } else {
        _cost["isApplicable"] = false;
      }
      return _cost;
    });

    const checkIdFromDB = accountStore.getAccountById(
      selectedAccount?.value?.id
    )?.id;
    console.log(checkIdFromDB);
    const isNew = computed(
      () =>
        !(
          checkIdFromDB != null &&
          checkIdFromDB != undefined &&
          checkIdFromDB > 0
        )
    );

    const site = ref(
      isNew.value ? null : siteStore.getSiteById(selectedAccount.value.site.id)
    );

    const ms = ref(
      isNew.value ? null : accountStore.getAccountById(checkIdFromDB)
    );
    console.log(ms);

    // const selectedAccount = props.autoUpdate
    //   ? ref(props.account)
    //   : props.account
    //   ? ref(JSON.parse(JSON.stringify(props.account)))
    //   : ref(nullAccount);
    const siteOptions = ref(siteStore.allSites);

    // const waterEmail = ref("");
    // const electricityEmail = ref("");

    let resetInstance = () => {
      site.value = initialState.site;
      selectedAccount.value = initialState.selectedAccount;
      //accountOptions.value = initialState.accountOptions;
    };

    // const addFixedCostField = () => {
    //   selectedAccount.value.fixedCosts.push({
    //     id: Date.now(),
    //     title: "",
    //     value: 0,
    //     isApplicable: false,
    //     isFromServer: false,
    //     isFromUser: true,
    //   });
    // };

    console.log(site);
    const onSaveSelectAccount = async () => {

      if (site.value == null || site.value.email == null) {
        $q.notify({
          message:
            "Invalid address. You need to select a valid location from the suggestions given by the app. Begin typing your address again.",
        });
        return;
      }
      if (site.value.id) {
        if (selectedAccount.value.region_id && selectedAccount.value.region_id.id == null) {
          $q.notify({
            message:
              "Please select regions",
          });
          return;
        }
        if (selectedAccount.value.account_type_id && selectedAccount.value.account_type_id.id == null) {
          $q.notify({
            message:
              "Please select account type",
          });
          return;
        }
        if (selectedAccount.value.water_email && selectedAccount.value.water_email == null) {
          $q.notify({
            message:
              "Please enter water email",
          });
          return;
        }
        if (selectedAccount.value.electricity_email && selectedAccount.value.electricity_email == null) {
          $q.notify({
            message:
              "Please enter electricity email",
          });
          return;
        }

      } else {
        if (regionmodel.value.id == null) {
          $q.notify({
            message:
              "Please select regions",
          });
          return;
        }
        if (accountmodel.value.id == null) {
          $q.notify({
            message:
              "Please select account type",
          });
          return;
        }
        if (water_email.value == null) {
          $q.notify({
            message:
              "Please enter water email",
          });
          return;
        }
        if (electricity_email.value == null) {
          $q.notify({
            message:
              "Please enter electricity email",
          });
          return;
        }
      }

      if (
        selectedAccount.value == null ||
        !(selectedAccount.value.title && selectedAccount.value.number)
      ) {
        $q.notify({
          message: "Fill valid name and number details",
        });
        return;
      }

      if (isNew.value) {
        if (site.value.newSite) {
          if (site.value.latLng) {
            //first will save site
            //site.value.id = Date.now();
            delete site.value["newSite"];
            // siteStore.addSite(site.value);
            //add site and account
            const siteValue = site.value;
            const accountValue = selectedAccount.value;
            const default_cost = accountValue.defaultCosts
              // .filter((cost) => cost.isApplicable)
              .map((cost) => {
                return {
                  name: cost.title,
                  id: cost.id,
                  value: cost.value,
                  is_active: cost.isApplicable ? 1 : 0,
                };
              })
              .filter((cost) => cost !== null);
            addSiteAndAccount({
              address: siteValue.address,
              email: siteValue.email,
              lat: siteValue.latLng.lat,
              lng: siteValue.latLng.lng,
              title: siteValue.email,
              account_name: accountValue.title,
              account_number: accountValue.number,
              optional_information: accountValue.option,
              default_fixed_cost: default_cost,
              region_id: regionmodel.value.id,
              account_type_id: accountmodel.value.id,
              water_email: water_email.value,
              electricity_email: electricity_email.value
            }).then(({ status, code, msg, data }) => {
              console.log(data);

              if (status) {
                siteStore.addSite({
                  id: data.site_id,
                  address: siteValue.address,
                  email: siteValue.email,
                  latLng: {
                    lat: siteValue.latLng.lat,
                    lng: siteValue.latLng.lng,
                  },
                  title: data.title,
                  user_id: data.user_id,
                  region_id: regionmodel.value.id,
                  account_type_id: accountmodel.value.id,
                  water_email: water_email.value,
                  electricity_email: electricity_email.value
                });
                accountStore.addAccount({
                  id: data.id,
                  defaultFixedCost: data.default_fixed_costs,
                  // defaultCosts: data.default_fixed_costs.map((cost) => {
                  //   return {
                  //     title: cost.title,
                  //     value: parseFloat(cost.value),
                  //     isApplicable: cost.is_active ? 1 : 0,
                  //     isFromUser: true,
                  //     id: cost.id,
                  //   };
                  // }),
                  number: accountValue.number,
                  option: accountValue.option,
                  site: { id: data.site_id },
                  title: accountValue.title,
                  region_id: regionmodel.value.id,
                  account_type_id: accountmodel.value.id,
                  water_email: water_email.value,
                  electricity_email: electricity_email.value
                });
              }
            });
          } else {
            alert({ message: "There is no site contact to developer" });
            return;
          }
        } else {
          const accountValue = selectedAccount.value;
          const default_cost = accountValue.defaultCosts
            // .filter((cost) => cost.isApplicable)
            .map((cost) => {
              return {
                name: cost.title,
                value: cost.value,
                id: cost.id,
                is_active: cost.isApplicable ? 1 : 0,
              };
            })
            .filter((cost) => cost !== null);
          addSiteAndAccount({
            site_id: site.value.id,
            account_name: accountValue.title,
            account_number: accountValue.number,
            optional_information: accountValue.option,
            default_fixed_cost: default_cost,
            region_id: regionmodel.value.id,
            account_type_id: accountmodel.value.id,
            water_email: water_email.value,
            electricity_email: electricity_email.value
          }).then(({ status, code, msg, data }) => {
            if (status) {
              accountStore.addAccount({
                id: data.id,
                defaultFixedCost: data.default_fixed_costs,
                // defaultCosts: data.default_fixed_costs.map((cost) => {
                //   return {
                //     value: parseFloat(cost.value),
                //     isApplicable: cost.is_active ? 0 : 1,
                //     isFromUser: true,
                //     id: cost.id,
                //   };
                // }),
                number: accountValue.number,
                option: accountValue.option,
                site: { id: data.site_id },
                title: accountValue.title,
                region_id: regionmodel.value.id,
                account_type_id: accountmodel.value.id,
                water_email: water_email.value,
                electricity_email: electricity_email.value
              });
            }
          });
        }
      } else {
        const accountValue = selectedAccount.value;
        const default_cost = accountValue.defaultFixedCost
          .map((cost) => {
            let id = cost.id;
            const accountCost = accountValue.defaultFixedCost.find(
              (_cost) => _cost.fixed_cost.id === cost.id
            );
            if (accountCost) {
              id = accountCost.id;
            }
            return {
              name: cost.title,
              value: cost.value,
              is_active: cost.isApplicable ? 1 : 0,
              id: id,
            };
          })
          .filter((cost) => cost !== null);

        updateAccount({
          site_id: site.value.id,
          account_name: accountValue.title,
          account_number: accountValue.number,
          optional_information: accountValue.option,
          default_fixed_cost: default_cost,
          account_id: accountValue.id,
          region_id: selectedAccount.value.region_id.id,
          account_type_id: selectedAccount.value.account_type_id.id,
          water_email: selectedAccount.value.water_email,
          electricity_email: selectedAccount.value.electricity_email

        }).then(({ status, code, msg, data }) => {
          if (status) {
            accountStore.update({
              id: data.id,
              defaultFixedCost: data.default_fixed_costs,
              // defaultCosts: data.default_fixed_costs.map((cost) => {
              //   return {
              //     value: parseFloat(cost.value),
              //     isApplicable: cost.is_active ? 0 : 1,
              //     isFromUser: true,
              //     id: cost.id,
              //   };
              // }),
              number: accountValue.number,
              option: accountValue.option,
              site: { id: data.site_id },
              title: accountValue.title,
              region_id: selectedAccount.value.region_id.id,
              account_type_id: selectedAccount.value.account_type_id.id,
              water_email: selectedAccount.value.water_email,
              electricity_email: selectedAccount.value.electricity_email
            });
          }
        });
        // addSiteAndAccount({
        //   site_id: site.value.id,
        //   account_name: accountValue.title,
        //   account_number: accountValue.number,
        //   optional_information: accountValue.option,
        //   default_fixed_cost: new_default_cost,
        // }).then(({ status, code, msg, data }) => {
        //   if (status) {
        //     accountStore.addAccount({
        //       id: data.id,
        //       defaultFixedCost: data.default_fixed_costs,
        //       number: accountValue.number,
        //       option: accountValue.option,
        //       site: { id: data.site_id },
        //       title: accountValue.title,
        //     });
        //   }
        // });
      }
      // emit("update:account", selectedAccount.value);
      emit("save");
    };

    let searchTimeCallBack;
    const filterFn = (val, update) => {

      if (val === "") {
        update(() => {
          siteOptions.value = siteStore.allSites;
        });
        return;
      }

      const needle = val.toLowerCase();
      const findItems = siteStore.allSites.filter(
        (v) => v.address.toLowerCase().indexOf(needle) > -1
      );

      if (findItems.length == 0) {
        if (searchTimeCallBack) {
          clearTimeout(searchTimeCallBack);
        }
        searchTimeCallBack = setTimeout(() => {
          searchByAddress(val).then((address) => {
            update(() => {
              siteOptions.value = address;
            });
          });
        }, 2000);
      } else {
        update(() => {
          siteOptions.value = findItems;
        });
      }
    };

    const searchByAddress = async (singleLine) => {
      try {
        const locationResponse = await suggestLocation(singleLine);
        let suggestions = locationResponse.data.suggestions;
        suggestions = suggestions.map((item, index) => {
          return {
            id: `new-${index}`,
            title: "",
            latLng: null,
            magicKey: item.magicKey,
            address: item.text,
            newSite: true,
          };
        });
        return suggestions;
      } catch (_) { }
    };

    const finLatLngByMagicKey = async (singleLine, magicKey) => {
      try {
        const response = await findAddressCandidates(singleLine, magicKey);
        let address = response.data["candidates"].map((item, index) => {
          return {
            id: `new-${index}`,
            title: "",
            latLng: { lat: item.location.x, lng: item.location.y },
            address: singleLine,
            newSite: true,
          };
        });
        return address;
      } catch (_) { }
    };

    const watchSite = watch(site, async (newValue, oldValue) => {
      if (newValue?.magicKey) {
        try {
          let address = await finLatLngByMagicKey(
            newValue.address,
            newValue.magicKey
          );
          if (address.length == 1) {
            // console.log("address", address[0]);
            let { data } = await findEmailFromLocation({
              x: address[0].latLng.lat,
              y: address[0].latLng.lng,
            });
            const spatialData = data;
            // console.log(spatialData);
            address[0]["email"] =
              spatialData["features"][0]["attributes"]["MREMAIL"];
            site.value = address[0];
          } else {
            alert("Choose address");
          }
        } catch (E) {
          console.log(E);
        }
      }
    });

    function alert({ title, message }) {
      $q.dialog({
        dark: false,
        title: title,
        message: message,
        cancel: true,
        persistent: false,
      })
        .onOk((data) => {
          // console.log('>>>> OK, received', data)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }


    return {
      selectedAccount,
      // addFixedCostField,
      onSaveSelectAccount,
      getAllAccount,
      siteOptions,
      filterFn,
      site,
      searchByAddress,
      finLatLngByMagicKey,
      watchSite,
      isNew,
      alert,
      regionmodel,
      accountmodel,
      regionOptions: regionsOptions,
      accountOptions: accountOptions,
      water_email,
      electricity_email
    };
  },
});
</script>

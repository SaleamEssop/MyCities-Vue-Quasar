<template>
  <q-card>
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Necessary Details</div>
    </q-card-section>
    <q-card-section>
      <q-select
        color="black"
        type="text"
        label="Enter a location address"
        use-input
        input-debounce="0"
        :options="siteOptions"
        @filter="filterFn"
        behavior="menu"
        v-model="site"
        option-label="address"
        emit-value
        map-options
        v-if="isNew"
      />
      <div v-else>
        {{ site?.address }}
      </div>

      <h4>Email {{ site?.email }}</h4>

      <q-input
        color="black"
        type="text"
        label="Enter name - As per bill"
        v-if="isNew"
        v-model.trim="selectedAccount.title"
      />
      <div v-else>Name : -{{ selectedAccount.title }}</div>

      <q-input
        color="black"
        type="text"
        label="Enter account number - As per bill"
        v-if="isNew"
        v-model="selectedAccount.number"
      />
      <div v-else>Account :- {{ selectedAccount.number }}</div>
    </q-card-section>
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Optional Information</div>
    </q-card-section>
    <q-card-section>
      <q-input
        color="black"
        type="text"
        label="Optional Information"
        v-model="selectedAccount.option"
      />
    </q-card-section>
    <q-card-section class="bg-primary">
      <div class="text-subtitle2">Fixed Cost - according to bill</div>
      <q-btn
        fab
        color="white"
        text-color="primary"
        icon="help"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-0%)"
      />
    </q-card-section>
    <template
      v-for="(fixedCost, index) in selectedAccount.fixedCosts"
      :key="index"
    >
      <q-separator />
      <q-card-section>
        <div class="flex justify-between items-center">
          <div v-if="fixedCost.isFromServer" class="text-h7">
            {{ fixedCost.title }}
          </div>
          <div v-if="fixedCost.isFromUser">
            <q-input
              outlined
              dense
              label="FixedCost title"
              color="black"
              v-model="fixedCost.title"
              :disable="!fixedCost.isApplicable"
              :readonly="!fixedCost.isApplicable"
            />
          </div>
          <q-toggle v-model="fixedCost.isApplicable" />
        </div>
        <q-input
          placeholder="R0.00"
          v-model.number="fixedCost.value"
          type="number"
          :disable="!fixedCost.isApplicable"
          :readonly="!fixedCost.isApplicable"
        />
      </q-card-section>
    </template>

    <q-card-actions align="center">
      <q-btn
        color="primary"
        text-color="black"
        icon="add"
        label="Add Fixed Cost"
        glossy
        @click="addFixedCostField"
      />
    </q-card-actions>
    <q-separator />
    <q-space />
    <q-card-actions align="center">
      <q-btn
        color="red"
        v-if="!autoUpdate"
        text-color="white"
        class="q-my-none q-mx-none"
        label="Cancel"
        glossy
        @click="$emit('close')"
      />

      <q-btn
        color="primary"
        text-color="black"
        v-if="!autoUpdate"
        class="q-my-none q-mx-noe"
        label="Save"
        glossy
        @click="onSaveSelectAccount"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import { ref, reactive, watch, computed, defineComponent } from "vue";
import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";

import {
  locationApi,
  suggestLocation,
  findAddressCandidates,
  findEmailFromLocation,
} from "boot/axios";

const nullAccount = {
  id: Date.now(),
  title: null,
  number: null,
  option: null,
  site: { id: null, email: null },
  fixedCosts: [
    {
      id: Date.now(),
      title: "Rates",
      value: null,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
    {
      id: Date.now(),
      title: "Water Loss Levy",
      value: null,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
    {
      id: Date.now(),
      title: "Refuse Collection",
      value: null,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
    {
      id: Date.now(),
      title: "Infrastructure Levy",
      value: null,
      isApplicable: true,
      isFromServer: true,
      isFromUser: false,
    },
  ],
};
export default defineComponent({
  name: "AccountComponent",
  props: {
    account: Object,
    autoUpdate: { type: Boolean, default: false },
  },
  methods: {},
  emits: ["update:account"],
  setup(props, { emit }) {
    const initialState = {
      site: null,
      selectedAccount: JSON.parse(JSON.stringify(props.account || nullAccount)),
    };
    const siteStore = useSiteStore();
    const accountStore = useAccountStore();

    const selectedAccount = ref(initialState.selectedAccount);

    const checkIdFromDB = accountStore.getAccountById(
      selectedAccount?.value?.id
    )?.id;
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
    // const selectedAccount = props.autoUpdate
    //   ? ref(props.account)
    //   : props.account
    //   ? ref(JSON.parse(JSON.stringify(props.account)))
    //   : ref(nullAccount);
    const siteOptions = ref(siteStore.allSites);

    let resetInstance = () => {
      site.value = initialState.site;
      selectedAccount.value = initialState.selectedAccount;
    };

    const addFixedCostField = () => {
      selectedAccount.value.fixedCosts.push({
        id: Date.now(),
        title: "",
        value: 0,
        isApplicable: false,
        isFromServer: false,
        isFromUser: true,
      });
    };

    const onSaveSelectAccount = () => {
      if (isNew.value) {
        if (site.value.newSite) {
          if (site.value.latLng) {
            //first will save site
            site.value.id = Date.now();
            delete site.value["newSite"];
            siteStore.addSite(site.value);
          } else {
            alert("There is no site contact to developer");
            return;
          }
        }
        selectedAccount.value.site["id"] = site.value.id;
        accountStore.addAccount(selectedAccount.value);
      } else {
        accountStore.update(selectedAccount.value);
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
      } catch (_) {}
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
      } catch (_) {}
    };

    const watchSite = watch(site, async (newValue, oldValue) => {
      if (newValue?.magicKey) {
        try {
          let address = await finLatLngByMagicKey(
            newValue.address,
            newValue.magicKey
          );
          if (address.length == 1) {
            console.log("address", address[0]);
            let { data } = await findEmailFromLocation({
              x: address[0].latLng.lat,
              y: address[0].latLng.lng,
            });
            const spatialData = data;
            console.log(spatialData);
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
      addFixedCostField,
      onSaveSelectAccount,
      siteOptions,
      filterFn,
      site,
      searchByAddress,
      finLatLngByMagicKey,
      watchSite,
      isNew,
      alert,
    };
  },
});
</script>

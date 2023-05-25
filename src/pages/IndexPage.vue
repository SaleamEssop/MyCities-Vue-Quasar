<template>
  <q-page>
    <!-- <q-btn
      icon="settings_power"
      style="position: absolute; right: 10px; top: 10px"
      round
      @click="sureLogout = true"
    ></q-btn> -->

    <!-- <q-btn @click="isVoiceOverEnabled()"> isVoiceOverEnabled</q-btn>
    <q-btn @click="speak()">speak</q-btn> -->

    <div class="container">
      <div class="header">
        <div class="header-top-container d-flex align-items-center">
          <div class="logo-container">
            <img class="q-px-lg titleIcon" src="~assets/MyCity.png" />
            <!-- <div class="regionTitle">Ethekwini Region</div> -->
          </div>
          <div class="text-center">
            <q-btn
              @click="alarm = true"
              flat
              icon="notifications"
              class="col-xs-6 col-sm-6 q-my-xs adsBtn"
            >
              <q-badge floating color="red" rounded>
                {{ billingDate ? getAlarm.length + 1 : getAlarm.length }}
              </q-badge>
            </q-btn>
          </div>
          <q-btn icon="settings_power" round @click="sureLogout = true"></q-btn>
        </div>
        <!-- <q-separator color="grey" />
        <q-separator color="grey q-mt-xs" /> -->
        <q-separator color="grey q-mt-sm" size="2px" />

        <div class="ads_main">
          <div class="text-center">
            <q-btn-dropdown
              flat
              class="col-xs-6 col-sm-6 q-my-xs adsBtn"
              icon="menu"
            >
              <q-list v-for="ad in getAds" :key="ad.id">
                <q-item
                  v-show="ad.name !== 'LightsAndWater'"
                  clickable
                  v-close-popup
                  @click="onItemClick"
                >
                  <q-item-section>
                    <q-item-label
                      v-model="name"
                      @click="activeMenuItem(ad.name)"
                    >
                      {{ ad.name }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>

          <div class="text-center">
            <q-btn
              class="col-xs-6 col-sm-6 q-my-sm btn-light-green"
              rounded
              no-caps
              label="Light & Water"
              @click="
                activeMenuItem('LightsAndWater'), (lightAndWaterDialog = true)
              "
            />
          </div>
          <div class="text-center">
            <!-- <q-btn
              class="col-xs-6 col-sm-6 q-my-xs adsBtn"
              icon="facebook"
              flat
              @click="openFacebook()"
            /> -->
            <q-btn
              class="col-xs-6 col-sm-6 q-my-sm btn-light-green"
              no-caps
              rounded
              label="FoodBasket"
              @click="openFoodbasket()"
            />
          </div>
          <!-- <div class="text-center">
            <q-btn class="col-xs-6 col-sm-6 q-my-xs adsBtn" icon="smart_display" flat @click="openYoutube()" />
          </div> -->
          <!-- <div class="text-center">
            <q-btn class="col-xs-6 col-sm-6 q-my-xs adsBtn" icon="help" flat @click="activeMenuItem('Help')" />
          </div> -->
        </div>

        <q-separator color="grey" size="2px" />
        <!-- <q-separator color="grey q-mt-xs" /> -->
      </div>
      <!-- second menu section -->
      <div>
        <!-- <div class="row menuContain">
           <div class="text-center q-my-sm q-px-sm menuItem">
            <img
              class="col-xs-6 col-sm-6 q-my-sm enterMenu cursor-pointer"
              src="~assets/lightsandwater.png"
              alt="enter-menu"
              @click="
                activeMenuItem('LightsAndWater'), (lightAndWaterDialog = true)
              "
            />
          </div>
          <div class="text-center q-pt-xs menuItem">
            <q-btn class="col-xs-6 col-sm-6 q-my-sm" no-caps flat label="LightsandWater1" @click="activeMenuItem('LightsAndWater'), (lightAndWaterDialog = true)
              " />
          </div>
          <q-separator vertical inset />
          <div v-show="userStore?.user?.id === 44" class="text-center q-pt-xs menuItem">
            <q-btn class="col-xs-6 col-sm-6 q-my-sm" no-caps flat label="DataSet" @click="moveTo('data-set')" />
          </div>
          <q-separator v-show="userStore?.user?.id === 44" vertical inset />
          <div class="text-center q-pt-xs menuItem">
            <q-btn class="col-xs-6 col-sm-6 q-my-sm" no-caps flat label="News" @click="activeMenuItem('News')" />
          </div>
          <q-separator vertical inset />

          <div class="text-center q-pt-xs menuItem">
            <q-btn-dropdown no-caps label="Faults" class="col-xs-6 col-sm-6 q-my-sm" flat>
              <div style="width: 180px">
                <q-expansion-item label="Electricity Faults" :content-inset-level="0.3" group="accordion">
                  <q-list>
                    <q-item clickable v-close-popup @click="openMailOnFaults('electricity.faults@durban.gov.za')
                      ">
                      <q-item-section>
                        <q-item-label>Email</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="openChatOnWhatsApp('767912449')">
                      <q-item-section>
                        <q-item-label>WhatsApp</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="openDialCall('080 311 1111')">
                      <q-item-section>
                        <q-item-label>Call</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>

                <q-expansion-item group="accordion" label="Water Faults" :content-inset-level="0.3">
                  <q-list>
                    <q-item clickable v-close-popup @click="openMailOnFaults('eservices@durban.gov.za')">
                      <q-item-section>
                        <q-item-label>Email</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="openChatOnWhatsApp('731483477')">
                      <q-item-section>
                        <q-item-label>WhatsApp</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="openDialCall('080 1313013')">
                      <q-item-section>
                        <q-item-label>Call</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-expansion-item>
              </div>
            </q-btn-dropdown>
          </div>

          <q-separator vertical inset />
          <div class="text-center q-pt-xs menuItem">
            <q-btn class="col-xs-6 col-sm-6 q-my-sm" no-caps flat label="WhatsApp" @click="whatsapp = true" />
          </div>
        </div> -->

        <!-- <q-separator vertical inset /> -->
      </div>
      <!-- <q-separator color="grey q-mb-lg" size="2px" /> -->

      <div class="ads">
        <!-- q-pa-md -->
        <div>
          <!-- <div>
            <q-carousel
              v-model="slide"
              swipeable
              animated
              infinite
              :autoplay="autoplay"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
              transition-prev="slide-down"
              transition-next="slide-up"
              class="text-white shadow-1 rounded-borders imageHeight"
              height="2rem"
              vertical
            >
              <q-carousel-slide
                v-for="ad in getAdsWithCategory"
                :key="ad.id"
                :name="ad.id"
                :img-src="ad.image"
                class="addImage"
                role="link"
                @click="openAds(ad.url)"
              >
                <div v-show="ad.price > 0" class="add_description">
                  <div class="text-h6">{{ ad.name }}</div>
                  <div class="text-h6 text-bold">Price {{ ad.price }}</div>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div> -->

          <div class="adv-item" v-for="ad in getAdsWithCategory" :key="ad.id">
            <div class="q-px-md" v-html="ad.description"></div>

            <img
              :src="ad.image"
              alt="add-image"
              class="addImage"
              @click="openAds(ad.url)"
            />

            <!-- <q-img
              :src="ad.image"
              spinner-color="black"
              alt="add-image"
              class="addImage"
              @click="openAds(ad.url)"
            /> -->
            <!-- add_description_scroll -->
            <div
              v-show="ad.price > 0 || ad.name !== 'null'"
              class="add_description_scroll"
            >
              <div v-show="ad.price > 0" class="ads_price text-h6">
                R {{ ad.price }}
              </div>
              <div v-show="ad.name !== 'null'" class="text-subtitle1">
                {{ ad.name }}
              </div>
            </div>
            <!-- <q-separator color="grey-4" size="10px" class="bottomLine" /> -->
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <!-- Notification Dialog -->
  <q-dialog v-model="alarm" persistent>
    <q-card class="modalborder">
      <q-card-section style="min-width: 290px">
        <div v-if="getAlarm.length || billingDate">
          <div class="text-h6 text-center">Get Latest Notification</div>

          <div class="q-mt-lg">
            <div class="dueMessage" v-show="billingDate">
              "Your scheduled meter reading is due. Please read and submit."
            </div>
            <q-separator v-show="billingDate" color="grey" />
            <div class="" v-for="alarm in getAlarm" :key="alarm.id">
              <div class="row no-wrap">
                <div class="col text-subtitle1 q-py-sm">
                  {{ alarm.message }}
                </div>
                <div class="col-auto markAsread q-pl-lg">
                  <q-btn
                    flat
                    class="adsBtn"
                    icon="close"
                    @click="markAsRead(alarm.id)"
                  ></q-btn>
                </div>
              </div>
              <q-separator color="grey" />
            </div>
          </div>
        </div>
        <div v-else class="text-h6 text-center">No Latest Notification</div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn dense label="Done" v-close-popup />
        <!-- <q-btn dense label="Remind me later" v-close-popup /> -->
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- Add Custom NUmber Dialog -->
  <q-dialog v-model="whatsapp" persistent>
    <q-card class="modalborder">
      <q-card-section>
        <div>
          <div class="text-h6 text-center">
            Enter the number you want to Whatsapp
          </div>
          <div class="q-mt-lg">
            <q-input
              inputmode="numeric"
              color="black"
              class="q-mx-lg"
              mask="### ### ####"
              fill-mask
              v-model="phoneNumber"
              :input-style="{ fontSize: '24px', textAlign: 'center' }"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" no-caps v-close-popup />
        <q-btn
          flat
          label="Open WhatsApp"
          @click="openChatOnWhatsApp(phoneNumber)"
          no-caps
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <!-- lightsWater Ads Category -->
  <q-dialog
    v-model="lightAndWaterDialog"
    persistent
    :maximized="maximizedToggle"
  >
    <q-card>
      <div class="ads dialogAds">
        <div v-for="ad in getAdsWithCategory" :key="ad.id">
          <img
            :src="ad.image"
            alt="add-image"
            class="addImage"
            @click="openAds(ad.url)"
          />
          <!-- add_description_scroll -->
          <div
            v-show="ad.price > 0 || ad.name !== 'null'"
            class="add_description_scroll"
          >
            <div v-show="ad.price > 0" class="ads_price text-h6">
              R {{ ad.price }}
            </div>
            <div v-show="ad.name !== 'null'" class="text-subtitle1">
              {{ ad.name }}
            </div>
          </div>
          <q-separator
            v-show="getAdsWithCategory.length"
            color="grey-4"
            size="10px"
            class="bottomLine"
          />
        </div>
      </div>
      <div class="btnLightAndWater">
        <q-btn
          no-caps
          color="primary"
          rounded
          v-close-popup
          class="text-white fit-content"
          label="Home"
          @click="activeMenuItem('Home')"
          icon="arrow_back"
        />
        <q-btn
          icon-right="arrow_forward"
          no-caps
          color="primary"
          rounded
          class="text-white fit-content"
          label="My Manager"
          @click="moveTo('send_reading')"
        />
      </div>
    </q-card>
  </q-dialog>

  <!-- logout Dialog -->
  <q-dialog v-model="sureLogout" persistent>
    <q-card style="min-width: 280px">
      <q-card-section>
        <span class="text-h6">Logout</span>
        <!-- <q-avatar icon="question_mark" /> -->
        <!-- <div icon="question" class="text-h6">Logout</div> -->
        <div class="q-mt-sm">Are you sure you want to Logout?</div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Cancel" dense no-caps v-close-popup />
        <q-btn label="Logout" dense no-caps @click="logout" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { computed, onMounted, watch, ref } from "vue";

// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { onBeforeUpdate } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { useAdStore } from "src/stores/ads";
import { useGetAlarmsStore } from "src/stores/alarm";
import { useAccountStore } from "/src/stores/account";

import { date } from "quasar";
// import { Plugins } from "@capacitor/core";
// const { Accessibility, Modals } = Plugins;

// Accessibility.addListener("accessibilityScreenReaderStateChange", (state) => {
//   console.log("Accessibility", state.value);
// });

// const isVoiceOverEnabled = async () => {
//   var vo = await Accessibility.isScreenReaderEnabled();
//   // console.log("Value", vo.value);
//   alert("Voice over enabled? " + vo);
// };

// // async speak() {
// const speak = async () => {
//   var value = await Modals.prompt({
//     title: "Value to speak",
//     message: "Enter the value to speak",
//   });
//   // console.log("value", value);
//   Accessibility.speak({ value: value.value });
// };
const router = useRouter();
const userStore = useUserStore();
const adStore = useAdStore();
const alarm = ref(false);
const whatsapp = ref(false);
const message = ref(false);
const sureLogout = ref(false);
const lightAndWaterDialog = ref(false);
const maximizedToggle = ref(true);
const phoneNumber = ref("");
const accountStore = useAccountStore();
// const dueDate = ref(false);

const alaramStore = useGetAlarmsStore();
const getAlarm = computed(() => alaramStore.getAlarms);

const billingDate = computed(() => {
  let dueDate = false;
  accountStore.accounts[0]?.defaultFixedCost.map((_el) => {
    if (_el.fixed_cost?.title === "Enter Your Billing Date") {
      const monthDate = date.formatDate(new Date(), "DD");
      if (_el.value - 7 <= monthDate && monthDate <= _el.value - 5) {
        dueDate = true;
      }
    }
  });
  return dueDate;
});

// const getAlarm = computed(() => {
//   let alerm = null;
//   alerm = alaramStore.getAlarms;
//   accountStore.accounts[0].defaultFixedCost.map((_el) => {
//     if (_el.fixed_cost.title === "Enter Your Billing Date") {
//       const monthDate = date.formatDate(new Date(), "DD");
//       if (_el.value - 7 <= monthDate && monthDate <= _el.value - 5) {
//         alerm.push({
//           id: 0,
//           message:
//             "Your scheduled meter reading is due. Please read and submit.",
//         });
//       }
//     }
//   });
//   return alerm;
// });

const slide = ref(null);
const autoplay = ref(true);

const $q = useQuasar();
const email = ref("");
const name = ref("");
const selectCategory = ref(null);

const getAds = computed(() => adStore.getAds);

// onMounted(() => {
//   navigator.geolocation.getCurrentPosition((position) => {
//     var latitude = position.coords.latitude;
//     var longitude = position.coords.longitude;
//   });
// });

const openChatOnWhatsApp = (number) => {
  window.open(`https://api.whatsapp.com/send?phone=+27${number}&text=Hello`);
  phoneNumber.value = "";
};

const openFacebook = () => {
  window.open("https://www.facebook.com/groups/982841062697878");
};

const openFoodbasket = () => {
  window.open("http://167.172.65.248");
};

const openMailOnFaults = (mail) => {
  let emailUrl = "mailto:" + encodeURI(mail);
  window.open(emailUrl, "_blank");
};

const openDialCall = (number) => {
  let dialUrl = "tel:" + "+27" + encodeURI(number);
  window.open(dialUrl, "_blank");
};

const markAsRead = (id) => {
  let alarm = getAlarm.value.findIndex(({ id }) => {
    return id == id;
  });
  if (id > -1) {
    getAlarm.value.splice(alarm, 1);
  }
};

const openAds = (link) => {
  if (link === "www") {
    return;
  } else {
    if (!link.match(/^https?:\/\//i)) {
      link = "http://" + link;
    }
    return window.open(link, "_blank");
  }
};

const shareViaWebShare = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "MyCityApp",
        url: "https://play.google.com/store/apps/details?id=com.light.water.app",
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    let url =
      "https://play.google.com/store/apps/details?id=com.light.water.app";
    let shareUrl =
      "shareto://water.meter.power.meter/?title=" +
      encodeURI("MyCityApp") +
      "&msg=" +
      encodeURI(url);
    window.open(shareUrl);
  }
  // shareto:water.meter.power.meter/?title=Hello%20World&msg=https://www.google.co.in/
};

const activeMenuItem = (name) => {
  let data = getAds.value.filter((_el) => {
    return _el["name"] === name;
  });
  slide.value = data[0].ads[0]?.id;
  selectCategory.value = data[0]?.ads;
};

const formatPhoneNumber = (phoneNumberString) => {
  // alert();
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  // if (match) {
  console.log("match", match);
  return "(" + match?.[1] + ") " + match?.[2] + "-" + match?.[3];
  // }
  // return null;
};

const getAdsWithCategory = computed(() => {
  if (selectCategory.value !== null) {
    return selectCategory.value;
  } else {
    let defaultAds = getAds.value.filter((_el) => {
      return _el["name"] === "Home";
    });
    defaultAds.findIndex(({ ads }) => {
      slide.value = ads[0]?.id;
    });
    return defaultAds[0]?.ads;
  }
});

const logout = () => {
  // getAuth().signOut();
  // $q.loading.show();
  setTimeout(() => {
    userStore.signOut();
    router
      .push("/auth/login")
      .then(() => {
        $q.notify({ message: "Signed out" });
      })
      .catch((error) => console.log("error", error));
    timer = void 0;
    // $q.loading.hide();
  }, 1000);
};
const totalItems = ref([
  {
    title: "AppartmentMeter 409",
    icon: "water",
    type: { title: "Water", id: 1 },
  },
  {
    title: "AppartmentMeter 410",
    icon: "water",
    type: { title: "Water", id: 1 },
  },
]);

function log() {
  console.log(msg);
}
function moveTo(name) {
  router.push({ name: name });
}
</script>

<style scoped>
.dueMessage {
  font-style: italic;
  font-size: 16px;
  text-align: center;
  margin-bottom: 10px;
}

.q-dialog__inner--maximized > div {
  max-width: 480px !important;
}

.container {
  /* 97 if footer */
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  /* height: calc(100vh - 100%);
  min-height: calc(100vh - 100px); */
}

.header {
  padding-top: 12px !important;
}

.titleIcon {
  width: 100%;
  max-height: 70px;
  margin-top: -10px;
  object-fit: contain;
  /* margin-left: -15px; */
}

.logo-container .titleIcon {
  margin-top: 0;
  padding: 0;
}

.ads {
  overflow-y: auto;
  overflow-x: hidden;
  max-width: 480px;
  margin-top: -6px;
}

.imageHeight {
  width: 100vw;
  height: 100%;
  min-height: 100vw;
}

.shadow-1 {
  box-shadow: none !important;
}

.addImage {
  width: 100%;
  height: 100%;
  /* height: auto; */
}

.ads_main {
  display: flex;
  margin: auto;
  justify-content: flex-start;
  width: 100%;
  overflow-x: auto;
}

.q-item-type:hover {
  background: #ededed;
}

.adsBtn {
  color: #65666b;
  font-size: 18px !important;
}

.markAsread {
  /* background: rgb(198, 126, 126); */
  align-items: center;
  display: flex;
}

.enterMenu {
  width: 150px;
  height: 25px;
  /* padding-top: 1px; */
}

.manuButnPadding {
  padding-top: 10px !important;
}

.q-separator--vertical-inset {
  background-color: #4d7cc4b3 !important;
  width: 2px;
  margin-top: 20px;
  height: 20px;
}

.q-item {
  height: 40px !important;
  min-height: 40px !important;
}

.q-badge--rounded {
  position: absolute;
  top: 3px;
  right: 13px;
  cursor: inherit;
}

.menuContain {
  width: 100% !important;
  flex-wrap: nowrap !important;
  overflow-x: scroll !important;
  margin-top: -6px;
}

.regionTitle {
  text-align: center;
  font-size: 18px;
  font-weight: 300;
  margin-top: -8px;
}

.add_description_scroll {
  background: #fafafa;
  padding: 8px 16px;
  /* margin-bottom: 16px; */
  margin-top: -6px;
}

.ads_price {
  background: #e7e7e7;
  border-radius: 5px;
  padding: 4px 12px;
  width: fit-content;
  margin-bottom: 8px;
}

.bottomLine {
  margin-top: -6px;
}

.btnLightAndWater {
  display: flex;
  justify-content: space-evenly;
  /* background: #00000029; */
  position: absolute;
  width: 100%;
  top: 90%;
}

.header-top-container {
  justify-content: space-between;
  padding: 0 24px;
  display: flex;
  align-items: center;
}
.adv-item {
  margin-top: 15px;
}

@media only screen and (min-width: 480px) {
  .imageHeight {
    width: 480px !important;
    height: 480px !important;
    min-height: fit-content;
    margin: auto;
  }

  .addImage {
    /* height: 480px !important; */
    width: 480px !important;
  }
}

.dialogAds {
  height: 100vh;
  overflow-y: scroll;
}
</style>

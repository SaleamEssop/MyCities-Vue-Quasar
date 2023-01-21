<template>
  <q-page>
    <q-btn
      icon="settings_power"
      style="position: absolute; right: 10px; top: 10px"
      round
      @click="logout"
    ></q-btn>
    <div class="container">
      <div class="header">
        <img class="q-px-lg" src="~assets/ethekwiniMunicipal.png" />
        <!-- <q-separator color="grey" />
        <q-separator color="grey q-mt-xs" /> -->
        <q-separator color="grey q-mt-xs" size="2px" />

        <div class="ads_main">
          <div class="text-center">
            <q-btn-dropdown
              flat
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              icon="menu"
              size="lg"
            >
              <q-list v-for="ad in getAds" :key="ad.id">
                <q-item clickable v-close-popup @click="onItemClick">
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
              @click="alarm = true"
              flat
              size="lg"
              icon="notifications"
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
            >
              <q-badge v-if="getAlarm.length" floating color="red" rounded>
                {{ getAlarm.length }}
              </q-badge>
            </q-btn>
          </div>

          <div class="text-center">
            <q-btn
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              icon="share"
              flat
              size="lg"
              @click="shareViaWebShare()"
            />
          </div>
          <div class="text-center">
            <q-btn
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              icon="help"
              flat
              size="lg"
              @click="activeMenuItem('Help')"
            />
          </div>
        </div>

        <q-separator color="grey " />
        <q-separator color="grey q-mt-xs" />
      </div>
      <!-- second menu section -->
      <div class="row menuContain">
        <div class="text-center q-my-sm q-px-sm menuItem">
          <img
            class="col-xs-6 col-sm-6 q-my-sm enterMenu"
            src="~assets/lightsandwater.png"
            alt="enter-menu"
            @click="moveTo('send_reading')"
          />
        </div>

        <q-separator vertical inset />
        <div class="text-center q-pt-xs menuItem">
          <q-btn
            class="col-xs-6 col-sm-6 q-my-sm"
            no-caps
            flat
            label="News"
            @click="activeMenuItem('News')"
          />
        </div>
        <q-separator vertical inset />

        <div class="text-center q-pt-xs menuItem">
          <q-btn-dropdown
            no-caps
            label="Faults"
            class="col-xs-6 col-sm-6 q-my-sm"
            flat
          >
            <q-list>
              <q-item
                clickable
                v-close-popup
                @click="openChatOnWhatsApp('767912449')"
              >
                <q-item-section>
                  <q-item-label>Electricity Faults</q-item-label>
                </q-item-section>
              </q-item>

              <q-item
                clickable
                v-close-popup
                @click="openChatOnWhatsApp('731483477')"
              >
                <q-item-section>
                  <q-item-label>Water Faults</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
        <q-separator vertical inset />
        <div class="text-center q-pt-xs menuItem">
          <q-btn
            class="col-xs-6 col-sm-6 q-my-sm"
            no-caps
            flat
            label="WhatsApp"
            @click="whatsapp = true"
          />
        </div>
        <q-separator vertical inset />
      </div>
      <!-- <q-separator color="grey q-mb-lg" size="2px" /> -->

      <div class="ads">
        <!-- q-pa-md -->
        <div class=" ">
          <div>
            <q-carousel
              v-model="slide"
              swipeable
              animated
              infinite
              :autoplay="autoplay"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
              transition-prev="slide-right"
              transition-next="slide-left"
              class="text-white adsShadow shadow-1 rounded-borders imageHeight"
              height="2rem"
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
                <!-- @click="window.open(`${ad.url}`, '_blank').focus()" -->

                <div v-show="ad.price > 0" class="add_description">
                  <div class="text-h6">{{ ad.name }}</div>
                  <div class="text-h6 text-bold">Price {{ ad.price }}</div>
                </div>
              </q-carousel-slide>
            </q-carousel>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <!-- Notification Dialog -->
  <q-dialog v-model="alarm" persistent>
    <q-card class="modalborder">
      <q-card-section>
        <div v-if="getAlarm.length">
          <div class="text-h6 text-center">Get Latest Notification</div>
          <div class="q-mt-lg">
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
              color="black"
              class="q-mx-lg"
              type="number"
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

const router = useRouter();
const userStore = useUserStore();
const adStore = useAdStore();
const alarm = ref(false);
const whatsapp = ref(false);
const message = ref(false);
const phoneNumber = ref("");

const alaramStore = useGetAlarmsStore();
const getAlarm = computed(() => alaramStore.getAlarms);

const slide = ref(null);
const autoplay = ref(true);

const $q = useQuasar();
const email = ref("");
const name = ref("");
const selectCategory = ref(null);

const getAds = computed(() => adStore.getAds);

const openChatOnWhatsApp = (number) => {
  window.open(`https://api.whatsapp.com/send?phone=+27${number}&text=Hello`);
  phoneNumber.value = "";
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
  if (link == "www") {
    return;
  } else {
    if (!link.match(/^https?:\/\//i)) {
      link = "http://" + link;
      console.log("links", link);
    }
    return window.open(link, "_blank");
  }
};

// const webShareApiSupported = computed(() => {
//   return navigator.share;
// });

const shareViaWebShare = () => {
  if (navigator.share) {
    navigator
      .share({
        title: "LightsAndWaterApp",
        url: "https://www.google.co.in/",
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    let url = "https://www.google.co.in/";
    let shareUrl =
      "shareto://water.meter.power.meter/?title=" +
      encodeURI("LightsAndWaterApp") +
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
      return _el["name"] === "Top";
    });
    defaultAds.findIndex(({ ads }) => {
      slide.value = ads[0]?.id;
    });
    return defaultAds[0]?.ads;
  }
});

// const auth = getAuth();
// if we want to get the user details, this is how its done
// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     email.value = user.email;
//     name.value = user.displayName;
//   }
// });
const logout = () => {
  // getAuth().signOut();
  userStore.signOut();
  router
    .push("/auth/login")
    .then(() => {
      $q.notify({ message: "Signed out" });
    })
    .catch((error) => console.log("error", error));
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
.container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  padding-top: 36px !important;
}
/* style="width: 100%; max-height: 300px; object-fit: contain " */
.header img {
  width: 100%;
  max-height: 300px;
  object-fit: contain;
  margin-left: -15px;
}

.ads {
  /* flex-grow: 0.5; */
  /* overflow: auto; */
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
  /* height: 320px !important;
  width: 320px !important; */
  width: 100%;
  height: 100%;
}
@media only screen and (min-width: 600px) {
  .imageHeight {
    width: 480px !important;
    height: 480px !important;
    min-height: fit-content;
    margin: auto;
  }
  .addImage {
    height: 480px !important;
    width: 480px !important;
  }
}
.ads_main {
  display: flex;
  margin: auto;
  justify-content: space-between;
}

.q-item-type:hover {
  background: #ededed;
}
.adsBtn {
  color: #65666b;
}

.markAsread {
  /* background: rgb(198, 126, 126); */
  align-items: center;
  display: flex;
}

.enterMenu {
  width: 150px;
  height: 25px;
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
  min-height: auto !important;
  /* height: 40px; */
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
}
</style>

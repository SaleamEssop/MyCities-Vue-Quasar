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
        <img
          class="q-pa-lg"
          src="~assets/lightsandwaterapp.png"
          style="width: 100%; max-height: 300px; object-fit: contain"
        />
        <q-separator color="grey" />
        <q-separator color="grey q-mt-xs" />
        <!-- <p>{{ name }}</p>
      <p>{{ email }}</p> -->
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
          <div class="text-center q-pt-xs">
            <q-btn
              @click="alarm = true"
              round
              icon="notifications"
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
            >
              <q-badge floating color="red" rounded>
                {{ getAlarm.length }}
              </q-badge>
            </q-btn>
            <!-- @click="activeMenuItem('Help')" -->
          </div>
          <!-- <div class="text-center q-pt-xs">
            <q-btn
              round
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              src="account_circle"
              @click="moveTo('send_reading')"
            />
          </div> -->
          <div class="text-center q-pt-sm">
            <img
              class="col-xs-6 col-sm-6 q-my-sm adsBtn enterMenu"
              src="../assets/enter.png"
              alt="enter-menu"
              @click="moveTo('send_reading')"
            />
          </div>

          <div class="text-center q-pt-xs">
            <q-btn
              round
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              icon="share"
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

        <q-separator color="grey" />
        <q-separator color="grey q-mt-xs" />
      </div>
      <!-- {{ slide }} -->
      <!-- {{ autoplay }} -->

      <div class="ads q-pt-md">
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
const message = ref(false);
// const markAsRead = ref(false);

const alaramStore = useGetAlarmsStore();
const getAlarm = computed(() => alaramStore.getAlarms);

const slide = ref(null);
const autoplay = ref(true);

const $q = useQuasar();
const email = ref("");
const name = ref("");
const selectCategory = ref(null);

const getAds = computed(() => adStore.getAds);

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
        title: "title.value",
        text: "text.value",
        url: "url.value",
      })
      .then(() => console.log("Successful share"))
      .catch((error) => console.log("Error sharing", error));
  } else {
    console.log("Web Share API is not supported in your browser.");
  }
};

const activeMenuItem = (name) => {
  let data = getAds.value.filter((_el) => {
    return _el["name"] === name;
  });
  slide.value = data[0].ads[0]?.id;
  selectCategory.value = data[0]?.ads;
};

const getAdsWithCategory = computed(() => {
  if (selectCategory.value !== null) {
    console.log("selectCategory.value", selectCategory.value);
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
}

.ads {
  /* flex-grow: 0.5; */
  overflow: auto;
}

.imageHeight {
  /* height: 320px !important;
  width: 320px !important; */
  width: 100vw;
  height: 100%;
  min-height: 100vw;

  /* margin: auto;
  justify-content: center;
  display: flex;
  border-radius: 5px; */
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
  width: 80px;
  height: 32px;
  border: 1px solid #65666b;
  border-radius: 16px !important;
}
</style>

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
        <q-separator color="primary" />
        <q-separator color="primary q-mt-xs" />
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
          <div class="text-center">
            <q-btn
              flat
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              label="Manager"
              size="lg"
              @click="moveTo('send_reading')"
            />
          </div>
          <div class="text-center">
            <q-btn
              flat
              class="col-xs-6 col-sm-6 q-my-sm adsBtn"
              icon="help"
              size="lg"
              @click="activeMenuItem('Help')"
            />
          </div>
        </div>

        <q-separator color="primary" />
        <q-separator color="primary q-mt-xs" />
      </div>

      <!-- <div class="ads">
        <div class="q-pa-md">
          <div class="q-gutter-md row justify-center">
            <q-card
              v-ripple
              class="my-card col-5"
              v-for="ad in getAds"
              :key="ad.id"
              @click="window.open(`${ad.url}`, '_blank').focus()"
            >
              <img :src="ad.image" />

              <q-card-section>
                <div class="text-h6">{{ ad.name }}</div>
                <div class="text-subtitle2">Price {{ ad.price }}</div>
              </q-card-section>
            </q-card>

            <q-img>
              <div class="absolute-full text-subtitle2 flex flex-center">
                Caption
              </div>
            </q-img>
          </div>
        </div>
      </div> -->
      <div class="ads">
        <div class="q-pa-md">
          <div class="q-gutter-md">
            <q-carousel
              v-model="slide"
              swipeable
              animated
              arrows
              infinite
              :autoplay="autoplay"
              @mouseenter="autoplay = false"
              @mouseleave="autoplay = true"
              transition-prev="slide-right"
              transition-next="slide-left"
              class="text-white adsShadow shadow-1 rounded-borders"
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
</template>
<script setup>
import { computed, onMounted, watch, ref } from "vue";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { onBeforeUpdate } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { useAdStore } from "src/stores/ads";

const router = useRouter();
const userStore = useUserStore();
const adStore = useAdStore();
const slide = ref(7);
const autoplay = ref(true);

const $q = useQuasar();
const email = ref("");
const name = ref("");
const selectCategory = ref(null);

const getAds = computed(() => adStore.getAds);

const openAds = (link) => {
  if (!link.match(/^https?:\/\//i)) {
    link = "http://" + link;
  }
  return window.open(link, "_blank");
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
    return selectCategory.value;
  } else {
    let defaultAds = getAds.value.filter((_el) => {
      return _el["name"] === "Top";
    });
    // console.log("defautlad", defaultAds[0].ads);
    return defaultAds[0]?.ads;
  }
});

// slide.value = getAdsWithCategory.value[0].ads[0].id;

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
      $q.notify({ message: "Sign Out Success." });
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
  flex-grow: 0.5;
  overflow: auto;
}
.shadow-1 {
  box-shadow: none !important;
}

.addImage {
  height: 400px !important;
  max-width: 300px !important;
  /* width: 300px !important; */
  margin: auto;
  position: relative;
  border-radius: 5px;
  /* -webkit-box-shadow: 7px 7px 11px -3px rgba(0, 0, 0, 0.75); */
}
.ads_main {
  display: flex;
  margin: auto;
  justify-content: space-between;
}

.q-item-type:hover {
  background: #ededed;
}
/* .adsBtn {
  color: #d8a402;
} */
</style>

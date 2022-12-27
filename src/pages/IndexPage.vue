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
        <div class="text-center">
          <q-btn
            flat
            class="col-xs-6 col-sm-6 q-my-sm"
            label="Manager"
            icon="square"
            size="lg"
            @click="moveTo('send_reading')"
          />
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
          {{ getAds }}
          <div class="q-gutter-md">
            <q-carousel
              v-model="slide"
              swipeable
              animated
              arrows
              class="text-white shadow-1 rounded-borders"
            >
              <q-carousel-slide
                v-for="ad in getAds"
                :key="ad.id"
                :name="ad.id"
                :img-src="ad.image"
                class="addImage"
                @click="window.open(`${ad.url}`, '_blank').focus()"
              >
                <div class="add_description">
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
import { computed, ref } from "vue";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { onBeforeUpdate } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { useAdStore } from "src/stores/ads";

const router = useRouter();
const userStore = useUserStore();
const adStore = useAdStore();

const $q = useQuasar();
const slide = ref(1);
const email = ref("");
const name = ref("");

// onBeforeUpdate(() => {
//   const getAds = adStore.getAds;
//   console.log("getAds", getAds);
// });
const getAds = adStore.getAds;
console.log("getAds", getAds);
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
.fakeAddimage {
  height: 50px !important;
  width: 50px !important;
}
.ads {
  flex-grow: 0.5;
  overflow: auto;
}

.addImage {
  height: 400px !important;
  max-width: 300px !important;
  margin: auto;
  position: relative;
}
</style>

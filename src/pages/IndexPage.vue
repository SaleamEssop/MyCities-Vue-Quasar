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
        <!-- <p>{{ name }}</p>
      <p>{{ email }}</p> -->
        <div class="text-center">
          <q-btn
            flat
            class="col-xs-6 col-sm-6 q-mt-lg"
            label="Manager"
            icon="square"
            size="lg"
            @click="moveTo('send_reading')"
          />
        </div>
      </div>

      <div class="ads">
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

            <!-- <q-img >
              <div class="absolute-full text-subtitle2 flex flex-center">
                Caption
              </div>
            </q-img> -->
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { ref } from "vue";
// import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { useAdStore } from "src/stores/ads";

const router = useRouter();
const userStore = useUserStore();
const adStore = useAdStore();

const $q = useQuasar();

const email = ref("");
const name = ref("");

const getAds = adStore.getAds;

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
</style>

import { defineStore, getActivePinia } from "pinia";
// import { getAds } from "src/boot/axios";

// const activePinia = getActivePinia();

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

export const useAdStore = defineStore("ads", {
  state: () => ({
    ads: [],
  }),

  getters: {
    // getAds: (state) => shuffle(state.ads).slice(0, 2),
    getAds: (state) => state.ads,
  },

  actions: {
    setAds(_ads) {
      this.ads = _ads;
    },
    // setAds() {
    //   getAds().then(({ status, data }) => {
    //     this.ads = data;
    //   });
    // },
  },
  persist: true,
});

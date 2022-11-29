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

import { useUserStore } from "../stores/user";
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ({ router, app }) => {
  const userStore = useUserStore();
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

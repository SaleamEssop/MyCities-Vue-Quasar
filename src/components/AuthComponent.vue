<template>
  <div>
    <div class="full-width col">
      <div class="full-width q-pa-lg">
        <div class="full-width">
          <div v-html="title" class="text-h5 q-mb-lg"></div>
        </div>
        <div class="full-width">
          <q-form @submit="submitForm">
            <q-input
              outlined
              class="q-mb-md"
              type="email"
              label="Email"
              v-model="formData.email"
            />
            <q-input
              outlined
              class="q-mb-md"
              type="password"
              label="Password"
              v-model="formData.password"
            />
            <div v-if="!isLogin">
              <q-input
                outlined
                class="q-mb-md"
                type="text"
                label="Full Name"
                v-model="formData.full_name"
              />
              <q-input
                outlined
                class="q-mb-md"
                type="tel"
                label="Phone number"
                v-model="formData.phone_number"
              />
            </div>
            <div class="row">
              <q-btn
                type="submit"
                color="primary"
                text-color="black"
                :label="title"
                unelevated
              />
              <q-space></q-space>
              <q-btn
                flat
                label="Forgot Password?"
                color="grey-7"
                class="q-px-none"
                no-caps
                v-if="tab !== 'register'"
                @click="forgotPassword"
              />
            </div>
          </q-form>
        </div>
      </div>
      <!-- <div class="bg-grey-2 full-width" style="min-height: 110px">
        <div class="text-center text-subtitle1 text-grey-5 q-my-sm">OR</div>
        <div class="flex flex-center">
          <q-btn
            color="primary"
            @click="google"
            unelevated
            class="q-pa-none"
            style="border: 1px solid #1976d1"
            square
            text-color="black"
          >
            <q-avatar color="white" square size="34px">
              <q-img src="/google-logo.png" width="30px"></q-img>
            </q-avatar>
            <div class="q-mx-md">{{ title }} with Google</div>
          </q-btn>
        </div>
      </div> -->
    </div>

    <q-dialog v-model="resetPwdDialog" :full-width="true">
      <ForgotPassword />
    </q-dialog>
  </div>
</template>

<script>
import ForgotPassword from "./ForgotPassword.vue";
import { defineComponent, reactive, ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "/src/stores/user";

import { userLogin, userSignUp } from "boot/axios";
import { updateAllData } from "boot/firebase";

import { useQuasar } from "quasar";
export default defineComponent({
  name: "AuthComponent",
  props: ["tab"],
  components: { ForgotPassword },
  setup(props, context) {
    const $q = useQuasar();
    const router = useRouter();
    const userStore = useUserStore();
    const formData = reactive({
      full_name: "",
      email: "",
      phone_number: "",
      password: "",
      action: "insert",
    });
    const title = computed(() => {
      return props.tab === "login" ? "Sign in" : "Sign up";
    });
    const isLogin = computed(() => {
      return props.tab === "login";
    });
    const resetPwdDialog = ref(false);
    const submitForm = () => {
      if (props.tab === "login") {
        signInExistingUser(formData.email, formData.password);
      } else {
        createUser(formData);
      }
    };

    const getErrorMsg = (error) => {
      let errorMsg;
      switch (error.code) {
        case "auth/wrong-password":
          errorMsg = "Wrong Password";
          break;
        case "auth/user-not-found":
          errorMsg = "User does not found";
          break;
        default:
          errorMsg = error.msg;
      }
      return errorMsg;
    };

    const signInExistingUser = (email, password) => {
      userLogin({ email, password })
        .then(async ({ status, code, msg, data, token }) => {
          if (status) {
            $q.notify({ message: "Sign in success" });
            userStore.setUser(data, token);
            router.push("/");
            await updateAllData();
          } else {
            throw { code, msg };
          }
        })
        .catch((error) => {
          $q.notify({ message: getErrorMsg(error) });
          console.log(error);
        });
    };
    const createUser = (formData) => {
      userSignUp(formData)
        .then(({ status, code, msg }) => {
          if (status) {
            // $q.notify({ message: "Sign in success" });
            signInExistingUser(formData.email, formData.password);
            // router.push("/");
          } else {
            throw { code, msg };
          }
        })
        .catch((error) => {
          $q.notify({ message: getErrorMsg(error) });
          console.log(error);
        });
    };
    const forgotPassword = () => {
      resetPwdDialog.value = true;
    };
    return {
      formData,
      resetPwdDialog,
      submitForm,
      signInExistingUser,
      createUser,
      forgotPassword,
      title,
      isLogin,
    };
  },
});
</script>

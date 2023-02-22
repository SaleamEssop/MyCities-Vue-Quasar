<template>
  <div class=" ">
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
              :input-style="{ fontSize: '18px' }"
            />
            <q-input
              class="q-mb-md"
              label="Password"
              outlined
              v-model="formData.password"
              :type="isPwd ? 'password' : 'text'"
              ref="checkPassword"
              :input-style="{ fontSize: '18px' }"
              :rules="Required"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  @click="isPwd = !isPwd"
                  class="cursor-pointer"
                ></q-icon>
              </template>
            </q-input>
            <div v-if="isLogin">
              <div class="row">
                <q-checkbox v-model="agreeToTCs" label="Agree our T&Cs">
                </q-checkbox>
              </div>
              <q-btn
                no-caps
                class="readTerms"
                color="blue-8"
                flat
                label="Read our Term & Conditions"
                style="padding-left: 6px"
                @click="readTerms()"
              >
              </q-btn>
            </div>

            <div v-if="!isLogin">
              <q-input
                class="q-mb-md"
                label="Confirm Password"
                outlined
                v-model="formData.confirmPassword"
                :type="isConfirmPwd ? 'password' : 'text'"
                ref="checkConfirmPassword"
                :rules="confirmPWD"
                :input-style="{ fontSize: '18px' }"
              >
                <template v-slot:append>
                  <q-icon
                    :name="isConfirmPwd ? 'visibility_off' : 'visibility'"
                    @click="isConfirmPwd = !isConfirmPwd"
                    class="cursor-pointer"
                  ></q-icon>
                </template>
              </q-input>
              <q-input
                outlined
                class="q-mb-md"
                type="text"
                label="Full Name"
                v-model="formData.full_name"
                :input-style="{ fontSize: '18px' }"
              />
              <q-input
                outlined
                class="q-mb-md"
                type="tel"
                label="Phone number"
                v-model="formData.phone_number"
                :input-style="{ fontSize: '18px' }"
              />

              <div class="row">
                <q-checkbox v-model="agreeToTCs" label="Agree our T&Cs">
                </q-checkbox>
              </div>
              <q-btn
                no-caps
                class="readTerms"
                color="blue-8"
                flat
                label="Read our Term & Conditions"
                style="padding-left: 6px"
                @click="readTerms()"
              >
              </q-btn>

              <!-- <q-checkbox
                class="q-pb-md"
                v-model="agreeToTCs"
                label="Tick agree to our T&Cs"
              ></q-checkbox> -->
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

    <q-dialog v-model="resetPwdDialog" :full-width="true" persistent>
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
      confirmPassword: "",
      action: "insert",
    });
    const isPwd = ref(true);
    const isConfirmPwd = ref(true);
    const agreeToTCs = ref(false);

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

    const readTerms = () => {
      let link =
        "https://docs.google.com/document/d/1R1Ogorbm106ux-4BY5FPQVsBeVHLQDbOD4LejdftTsw/edit?usp=sharing";
      window.open(link, "_blank");
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
      if (agreeToTCs.value) {
        $q.loading.show();
        userLogin({ email, password })
          .then(async ({ status, code, msg, data, token }) => {
            if (status) {
              $q.notify({ message: "Signed in" });
              userStore.setUser(data, token);
              router.push("/");
              await updateAllData();
            } else {
              throw { code, msg };
            }
            $q.loading.hide();
          })
          .catch((error) => {
            // if (error.toJSON().message === "Network Error") {
            //   $q.notify({
            //     message: "You do not seem to have an internet connection.",
            //   });
            // }
            $q.notify({ message: getErrorMsg(error) });
            $q.loading.hide();
            console.log(error);
          });
      } else {
        $q.notify("Please agree to the terms and conditions");
      }
    };
    const createUser = (formData) => {
      if (formData.password === formData.confirmPassword) {
        if (agreeToTCs.value) {
          $q.loading.show();

          userSignUp(formData)
            .then(({ status, code, msg }) => {
              if (status) {
                // $q.notify({ message: "Sign in success" });
                signInExistingUser(formData.email, formData.password);
                // router.push("/");
              } else {
                throw { code, msg };
              }
              $q.loading.hide();
            })
            .catch((error) => {
              $q.notify({ message: getErrorMsg(error) });
              console.log(error);
              $q.loading.hide();
            });
        } else {
          $q.notify("Please agree to the terms and conditions");
        }
      } else {
        $q.notify("Your password and confirmation password do not match");
      }
    };
    const forgotPassword = () => {
      resetPwdDialog.value = true;
    };
    return {
      formData,
      isConfirmPwd,
      resetPwdDialog,
      submitForm,
      signInExistingUser,
      createUser,
      forgotPassword,
      title,
      isLogin,
      isPwd,
      agreeToTCs,
      readTerms,
    };
  },
});
</script>

<style scoped>
.readTerms {
  font-style: italic !important;
  padding: none !important;
  margin-bottom: 8px !important;
}
</style>

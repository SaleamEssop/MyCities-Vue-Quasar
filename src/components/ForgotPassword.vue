<template>
  <div class="flex flex-center">
    <q-card style="width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Reset Password</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form ref="resetPasswordForm">
          <q-input
            type="email"
            v-model="form.email"
            label="Enter your email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type your email',
            ]"
          />
          <q-input
            v-show="verifyCode"
            type="number"
            v-model="form.code"
            label="Enter your verification Code"
            lazy-rules
            :rules="[
              (val) =>
                (val && val.length > 0) ||
                'Please Enter your Verification Code',
            ]"
          />
        </q-form>
        <q-card-actions align="right">
          <div class="row q-mt-xs">
            <q-btn
              class="q-px-md"
              label="Reset my password"
              color="primary"
              @click="resetPassword()"
              unelevated
              text-color="black"
            />
          </div>
        </q-card-actions>
      </q-card-section>
    </q-card>
    <div class="otp-input-wrapper">
      <input type="text" maxlength="4" pattern="[0-9]*" autocomplete="off" />
      <svg viewBox="0 0 240 1" xmlns="http://www.w3.org/2000/svg">
        <line
          x1="0"
          y1="0"
          x2="240"
          y2="0"
          stroke="#3e3e3e"
          stroke-width="2"
          stroke-dasharray="44,22"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
// import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useQuasar } from "quasar";
import { forgotPasswordVerification } from "src/boot/axios";

export default defineComponent({
  name: "ForgotPassword",
  setup() {
    const $q = useQuasar();
    const form = reactive({ email: "", code: null });
    const verifyCode = ref(false);
    const resetPassword = () => {
      if (verifyCode.value === false) {
        forgotPasswordVerification({ email: form.email })
          .then(({ status, code, msg }) => {
            if (status) {
              $q.notify({
                message: "Check you email and follow the instructions there. ",
              });
            } else {
              throw { code, msg };
            }
          })
          .catch((status) => {
            $q.notify({ message: status.msg });
            verifyCode.value = true;
            console.log("verifyCode", verifyCode.value);
          });
      } else if (verifyCode.value === true) {
        alert();
      }
    };

    // const resetPassword = () => {
    //   const auth = getAuth();
    //   sendPasswordResetEmail(auth, form.email)
    //     .then(() => {
    //       form.email = "";
    //       $q.notify({
    //         message: "Check you email and follow the instructions there. ",
    //       });
    //     })
    //     .catch((error) => console.log(error));
    // };
    return {
      form,
      resetPassword,
      verifyCode,
    };
  },
});
</script>

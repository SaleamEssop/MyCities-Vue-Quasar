<template>
  <div class="flex flex-center">
    <q-card style="width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Reset Password</div>
        <q-space />
        <q-btn
          icon="close"
          flat
          round
          dense
          @click="closeModal"
          v-close-popup="closed"
        />
      </q-card-section>

      <q-card-section class="q-pt-md">
        <q-form ref="resetPasswordForm">
          <q-input
            type="email"
            v-model="form.email"
            :input-style="{ fontSize: '18px' }"
            label="Enter your email"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type your email',
            ]"
          />

          <q-input
            v-show="verifyCode"
            class="text-center q-mt-md q-mb-lg"
            borderless
            v-model="form.code"
            :input-style="{ fontSize: '30px', textAlign: 'center' }"
            mask="#   #   #   #   #"
            fill-mask
          ></q-input>

          <q-input
            v-show="isResetPassword"
            class="q-mb-md"
            label="Enter New Password"
            lazy-rules
            v-model="form.newPassword"
            :type="isPwd ? 'password' : 'text'"
            :input-style="{ fontSize: '18px' }"
            :rules="[
              (val) => (val && val.length > 0) || 'Please type your password',
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"
                class="cursor-pointer"
              ></q-icon>
            </template>
          </q-input>

          <!-- <OtpVerification
            class="q-mt-md q-mb-lg"
            v-show="verifyCode"
            :digit-count="5"
            @update:otp="form.code = $event"
          /> -->
        </q-form>
        <q-card-actions align="right">
          <div class="row q-mt-xs">
            <q-btn
              class="q-px-md"
              label="Reset my password"
              color="primary"
              @click="resetPassword()"
              v-close-popup="closed"
              unelevated
              text-color="black"
            />
          </div>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from "vue";
import { useQuasar } from "quasar";
import {
  forgotPasswordVerification,
  forgotPasswordVerificationCode,
  resetNewPassword,
} from "src/boot/axios";
// import OtpVerification from "./OtpVerification.vue";

export default defineComponent({
  name: "ForgotPassword",
  // components: { OtpVerification },
  setup() {
    const $q = useQuasar();
    const form = reactive({ email: "", code: null, newPassword: "" });
    const verifyCode = ref(false);
    const isResetPassword = ref(false);
    const isPwd = ref(true);
    const closed = ref(false);

    const resetPassword = () => {
      $q.loading.show();
      if (verifyCode.value === false && isResetPassword.value === false) {
        forgotPasswordVerification({ email: form.email })
          .then(({ status, code, msg }) => {
            if (status) {
              $q.loading.hide();
              verifyCode.value = true;
              $q.notify({
                message:
                  "Check your email and Enter the Verification code here.",
              });
            } else {
              throw { code, msg };
            }
          })
          .catch((status) => {
            $q.loading.hide();

            // verifyCode.value = true;
            $q.notify({ message: status.msg });
          });
      } else if (verifyCode.value === true) {
        let otpCode = form.code.replaceAll(" ", "");
        forgotPasswordVerificationCode({
          code: otpCode,
          email: form.email,
        })
          .then(({ status, code, msg }) => {
            if (status) {
              verifyCode.value = false;
              isResetPassword.value = true;
              $q.loading.hide();
              $q.notify({ message: msg });
            } else {
              throw { code, msg };
            }
          })
          .catch((status) => {
            // verifyCode.value = false;
            // isResetPassword.value = true;
            $q.loading.hide();
            // closed.value = true;
            $q.notify({ message: status.msg });
          });
      } else if (isResetPassword.value === true && verifyCode.value === false) {
        // closed.value = true;
        resetNewPassword({ email: form.email, password: form.newPassword })
          .then(({ status, code, msg }) => {
            if (status) {
              closed.value = true;
              $q.loading.hide();
              $q.notify({
                message:
                  "Password has been Reset, login here with new Password",
              });
            } else {
              throw { code, msg };
            }
          })
          .catch((status) => {
            $q.loading.hide();
            $q.notify({ message: status.msg });
          });
        closed.value = true;
      }
    };

    function closeModal() {
      closed.value = true;
    }

    return {
      form,
      resetPassword,
      verifyCode,
      isPwd,
      isResetPassword,
      closed,
      closeModal,
    };
  },
});
</script>

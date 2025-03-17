<template>
  <q-card class="modelHeight">
    <q-card-section class="bg-primary">
      <div class="text-subtitle2 text-white">Necessary Details</div>
    </q-card-section>
    <q-list>
      <q-item
        tag="label"
        v-for="meterType in $METER_TYPES"
        :key="meterType.id"
        v-ripple
      >
        <q-item-section avatar>
          <q-radio v-model="meter.type.id" :val="meterType.id" />
        </q-item-section>
        <q-item-section avatar>
          <q-avatar>
            <img :src="meterType.thumbnail" />
          </q-avatar>
          <q-item-label>{{ meterType.title }}</q-item-label>
        </q-item-section>
      </q-item>
      <div v-if="imageSrc" class=" ">
        <q-img :src="imageSrc" class="captureImage" />
        <q-separator color="grey" size="6px" />
      </div>
    </q-list>

    <q-card-section>
      <q-input
        color="black"
        type="text"
        min="0"
        v-model.trim="meter.title"
        label="Meter Description"
      />
      <q-input
        color="black"
        type="text"
        min="0"
        v-model.trim="meter.number"
        label="Meter Number"
      />

      <!-- <q-separator color="primary q-my-lg" size="4px" />
      <div class="text-center">
        <div>
          Click on the calendar and enter the date, if available, on which the
          meter was last read by the municipality.
        </div>
        <q-separator spaced="lg" />
        <q-btn icon="event" color="primary" size="lg" text-color="black">
        <q-popup-proxy
          @before-show="updateProxy"
          cover
          transition-show="scale"
          transition-hide="scale"
        >
          <q-date v-model="readingDate" mask="DD/MM/YYYY">
            <div class="row items-center justify-end q-gutter-sm">
              <q-btn label="Cancel" color="primary" flat v-close-popup />
              <q-btn
                label="OK"
                color="primary"
                flat
                @click="save"
                v-close-popup
              />
            </div>
          </q-date>
        </q-popup-proxy>
        </q-btn> -->

      <!-- <q-btn
          class="absolute"
          icon="help"
          @click="
            alert({
              title: 'Important note',
              message: `If available, select from the calendar the last actual date on which the meter was read by the municipality, not estimated.
If not available, simply enter the current date and meter reading and update it after 24 hours.The app will then start to calculate the usage and cost.`,
            })
          "
          round
          flat
          color="primary"
        /> -->
      <!-- <div class="q-my-sm">Calendar</div>
        <q-separator spaced="lg" />
      </div> -->

      <!-- <q-input filled v-model="readingDate" mask="date" :rules="['date']">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="readingDate" text-color="black">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input> -->
      <p class="caption q-field__label q-mt-lg">Current Selected Dates</p>
      <div
        class="flex justify-center items-center q-mt-lg reading-text-wrapper"
      >
        <div class="row justify-center">
          <q-badge class="bg-white" text-color="black">
            <strong class="text-body1">{{ readingDate }}</strong>
          </q-badge>
        </div>
        <div class="justify-center flex">
          <span class="round-cheap-n text-center"
            >Change
            <q-popup-proxy
              @before-show="updateProxy"
              cover
              transition-show="scale"
              transition-hide="scale"
            >
              <q-date v-model="readingDate" mask="DD/MM/YYYY">
                <div class="row items-center justify-end q-gutter-sm">
                  <q-btn label="Cancel" color="primary" flat v-close-popup />
                  <q-btn
                    label="OK"
                    color="primary"
                    flat
                    @click="save"
                    v-close-popup
                  />
                </div>
              </q-date>
            </q-popup-proxy>
          </span>
        </div>
      </div>
      <q-separator class="q-mt-md" />

      <div class="row justify-center q-mt-lg">
        <q-badge class="bg-grey-4" text-color="black">
          <span class="text-body1">Click to enter a reading</span>
        </q-badge>
      </div>
      <div class="text-center">
        <!-- <input
          name="number"
          oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
          type="number"
           :maxlength="meter.type.id == 2 ? 6 : 8"
          placeholder="PUT INPUT"
        /> -->
        <q-card-section>
          <div
            class="relative"
            :class="inputFocus ? 'stroke-focus' : 'stroke-simple'"
          >
            <div class="absolute" style="opacity: 0">
              <!-- autofocus -->
              <q-input
                type="number"
                color="black"
                :min="0"
                oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                :maxlength="meter.type.id == 2 ? 6 : 8"
                outlined
                @focus="inputFocus = true"
                @blur="inputFocus = false"
                :step="1"
                v-model="firstReading.valueInString"
                @keypress="
                  (event) => {
                    if (
                      `${firstReading.valueInString || ''}`.length >=
                        (meter.type.id == 2 ? 6 : 8) ||
                      event.keyCode == 46
                    ) {
                      event.preventDefault();
                    } else {
                    }
                  }
                "
              />
            </div>
            <div class="text-center">
              <MeterComponent
                ref="meterComopnentReadValue"
                :text="firstReading.valueInString"
                :meterStyle="meter.type.id"
                :readingType="
                  meter.type.id == 2
                    ? 'electricity-recorded-reading'
                    : 'water-recorded-reading'
                "
                :isInput="true"
                @update:valueInString="updateValueInString"
              />
            </div>
          </div>
        </q-card-section>
      </div>
      <!-- <q-input
        color="black"
        type="number"
        min="0"
        v-model.number="firstReading.value"
        label="Enter the reading"
      /> -->
    </q-card-section>
    <q-space />
    <q-card-actions align="center">
      <q-btn
        icon="image"
        color="primary"
        text-color="white"
        @click="captureImage()"
      />
      <q-btn
        color="red"
        text-color="white"
        class="q-my-none q-mx-none"
        label="Cancel"
        glossy
        @click="$emit('close')"
      />

      <q-btn
        color="primary"
        text-color="white"
        class="q-my-none q-mx-none"
        label="Save"
        glossy
        @click="addMeter"
      />
    </q-card-actions>
  </q-card>
</template>
<script>
import { ref, computed, defineComponent, watch } from "vue";
import { date } from "quasar";
import { useAccountStore } from "/src/stores/account";
import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";
import { useQuasar } from "quasar";
import MeterComponent from "/src/components/MeterComponent.vue";
import { addMeterAndReading } from "src/boot/axios";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraDirection,
} from "@capacitor/core";
import domtoimage from "dom-to-image-more";
import { useUnitFormat } from "src/composable/useUnitFormat";

const { Camera, Filesystem } = Plugins;

const nullReading = {
  isSubmit: true,
  time: Date.now(),
  value: null,
  valueInString: "",
  meter: { id: null },
};

const nullMeter = {
  id: null,
  title: null,
  number: null,
  type: { id: 1 },
  account: { id: null },
};

export default defineComponent({
  name: "AccountComponent",
  props: {
    propsMeter: { type: Object, default: nullMeter },
    autoUpdate: { type: Boolean, default: false },
    propsAccount: { type: Object },
  },
  setup(props, { emit }) {
    const $q = useQuasar();

    const firstReading = ref({
      ...JSON.parse(JSON.stringify(nullReading)),
      time: Date.now(),
    });

    const readingDate = computed({
      get() {
        const time = firstReading.value.time || Date.now();
        return date.formatDate(new Date(time), "DD/MM/YYYY");
      },
      set(newValue) {
        if (newValue) {
          const extractedDate = date.extractDate(newValue, "DD/MM/YYYY");
          firstReading.value.time = extractedDate.getTime();
        }
      },
    });

    watch(readingDate, (newVal) => {
      console.log("Current readingDate:", newVal);
    });

    const meterStore = useMeterStore();
    const readingStore = useReadingStore();
    const imageSrc = ref(""); // Holds the image URL

    const captureImage = async () => {
      try {
        const image = await Camera.getPhoto({
          quality: 100,
          source: CameraSource.Prompt,
          resultType: CameraResultType.Uri,
          direction: CameraDirection.Rear,
        });
        imageSrc.value = image.webPath; // Set the image URL
        console.log("Image captured, webPath:", image.webPath); // Debug log
        customalert(
          "Please ensure that the entered reading matches the meter image reading"
        );
      } catch (error) {
        console.error("Error capturing image:", error);
        $q.notify({ message: "Failed to capture image.", color: "negative" });
      }
    };

    // Watch imageSrc to debug
    watch(imageSrc, (newVal) => {
      console.log("imageSrc updated to:", newVal);
    });

    function customalert(message) {
      $q.dialog({
        dark: false,
        message: message,
        ok: `Confirm`,
        color: "positive",
      });
    }

    function blobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }

    const meter = ref(
      props.propsMeter || JSON.parse(JSON.stringify(nullMeter))
    );

    const meterComopnentReadValue = ref();

    const updateValueInString = (newValue) => {
      firstReading.value.valueInString = newValue;
    };

    const addMeter = async () => {
      try {
        let base64Image = null;

        if (imageSrc.value) {
          const response = await fetch(imageSrc.value);
          const blob = await response.blob();
          base64Image = await blobToBase64(blob);
        }

        if (meter.value.id == null) {
          meter.value.id = Date.now();
          meter.value.account.id = props.propsAccount.id;
        }
        firstReading.value.meter.id = meter.value.id;

        if (meter.value.title == null || meter.value.number == null) {
          $q.notify({ message: "Fill all details before saving." });
          return;
        }

        if (
          !firstReading.value.valueInString ||
          firstReading.value.valueInString.replace(/_/g, "").length === 0
        ) {
          $q.notify({
            message:
              "You must enter a reading before saving even if it is all zeroes.",
          });
          return;
        }

        firstReading.value.valueInString =
          meterComopnentReadValue.value.getValueInString();
        firstReading.value.value =
          firstReading.value.valueInString /
          (meter.value.type.id == 2 ? 10.0 : 10000.0);

        const responseData = await addMeterAndReading({
          meter_type_id: meter.value.type.id,
          meter_title: meter.value.title,
          meter_number: meter.value.number,
          meter_reading_image: base64Image,
          meter_reading_date: new Date(firstReading.value.time).toISOString(),
          meter_reading: firstReading.value.valueInString,
          account_id: meter.value.account.id,
        });

        if (responseData.status) {
          responseData.data.readings.forEach((reading) => {
            readingStore.addReading({
              id: reading.id,
              meter: { id: reading.meter_id },
              time: new Date(reading.reading_date).getTime(),
              value: firstReading.value.value,
              valueInString: reading.reading_value,
            });
          });
          meterStore.addMeter({
            account: { id: responseData.data.account_id },
            id: responseData.data.id,
            number: responseData.data.meter_number,
            title: responseData.data.meter_title,
            type: {
              id: responseData.data.meter_type_id,
            },
          });
          emit("save");
        }
      } catch (error) {
        console.error("Error saving meter:", error);
        $q.notify({ message: "Failed to save meter.", color: "negative" });
      }
    };

    return {
      meter,
      firstReading,
      meterComopnentReadValue,
      addMeter,
      captureImage,
      updateValueInString,
      readingDate,
      imageSrc, // Return imageSrc for template binding
    };
  },
  components: { MeterComponent },
});
</script>

<style scoped>
.modelHeight {
  height: auto !important;
}

.reading-text-wrapper .text-body1 {
  font-weight: 600;
  font-size: 20px;
}

.reading-text-wrapper .round-cheap-n {
  font-size: 16px;
  margin-left: 20px;
  color: rgba(0, 0, 0, 0.6);
}

.captureImage {
  max-height: 200px;
  max-width: 400px;
}
</style>

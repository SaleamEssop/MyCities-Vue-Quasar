<template>
  <q-card>
    <div v-if="imageSrc" class="captureImage">
      <q-img :src="imageSrc" class="captureImage" />
    </div>

    <q-card-section>
      <div
        v-if="isNew"
        class="q-my-sm"
        text-color="negative"
        style="color: red; font-weight: bold"
      >
        {{ alertIfLessThen24Hours }}
      </div>
      <div class="text-subtitle2">Title : {{ meter?.title }}</div>

      <div class="text-subtitle2">
        Meter Number : {{ meter ? meter?.number : "" }}
      </div>

      <div class="text-subtitle2">
        Last saved reading : {{ lastReadingItem?.value }}
      </div>

      <!-- Edit Readings with Date -->

      <!-- <div class="row justify-center q-mt-lg">
        <q-badge class="bg-grey-4" text-color="black">
          <span class="text-body1">Reading date: {{ readingDate }}</span>
        </q-badge>
      </div>
      <div class="q-pt-md justify-center flex">
        <span class="round-cheap text-center"
          >Edit date
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
      <q-separator class="q-mt-md" /> -->
    </q-card-section>
    <q-card-section>
      <div
        class="relative"
        :class="inputFocus ? 'stroke-focus' : 'stroke-simple'"
      >
        <div class="absolute" style="opacity: 0">
          <q-input
            type="number"
            color="black"
            :min="0"
            outlined
            @focus="inputFocus = true"
            @blur="inputFocus = false"
            :step="1"
            autofocus
            v-model="currentReading"
            oninput="if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
            :maxlength="meter.type.id == 2 ? 6 : 8"
            @keypress="
              (event) => {
                if (
                  `${currentReading || ''}`.length >=
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
            :text="currentReading"
            ref="meterComopnentReadValue"
            :meterStyle="meter.type.id"
            :readingType="
              meter.type.id == 2
                ? 'electricity-recorded-reading'
                : 'water-recorded-reading'
            "
            :isInput="true"
          />
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="right">
      <!-- <q-btn
        color="primary"
        icon="camera"
        text-color="black"
        @click="captureImage(), mkdir()"
      /> -->
      <q-btn
        @click="takePhoto()"
        color="primary"
        icon="camera"
        text-color="black"
      />
      <q-btn color="primary" text-color="black" @click="$emit('close')"
        >Cancel</q-btn
      >
      <q-btn color="primary" text-color="black" @click="saveReading(false)"
        >Save</q-btn
      >
    </q-card-actions>
  </q-card>
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import MeterComponent from "./MeterComponent.vue";
import { useReadingStore } from "/src/stores/reading";
import { date } from "quasar";
import { useQuasar } from "quasar";

import waterDurban from "/src/services/waterDurban.js";

import { addReadingInMeter, updateReadingInMeter } from "src/boot/axios";
import {
  Plugins,
  CameraResultType,
  CameraSource,
  CameraDirection,
  FilesystemDirectory,
} from "@capacitor/core";

const { Camera, Filesystem } = Plugins;

export default defineComponent({
  name: "MeterComponentWithInput",
  props: {
    meter: Object,
    isNew: Boolean,
  },
  setup(props, { emit }) {
    const meterComopnentReadValue = ref();
    const readingStore = useReadingStore();
    const $q = useQuasar();
    const showAlert = (msg) => {
      $q.notify({
        attrs: {
          // for the notification itself:
          role: "alertdialog",
        },
        message: msg,
        actions: [
          {
            icon: "close",
            // for individual action (button):
            "aria-label": "Dismiss",
          },
        ],
      });
    };
    const imageSrc = ref("");

    async function captureImage() {
      const image = await Camera.getPhoto({
        saveToGallery: true,
        quality: 100,
        // allowEditing: true,
        source: CameraSource.Prompt,
        resultType: CameraResultType.Uri,
        direction: CameraDirection.Rear,
      });
      var imageUrl = image.webPath;
      imageSrc.value = imageUrl;
    }

    async function mkdir() {
      try {
        let ret = await Filesystem.mkdir({
          path: "MyCityApp",
          directory: FilesystemDirectory.Documents,
          recursive: true, // like mkdir -p
        });
      } catch (e) {
        console.error("Unable to make directory", e);
      }
    }
    // async function readdir() {
    //   try {
    //     let ret = await Filesystem.readdir({
    //       path: "MyCityApp",
    //       directory: FilesystemDirectory.Documents,
    //       recursive: true, // like mkdir -p
    //     });
    //   } catch (e) {
    //     mkdir();
    //     console.error("Unable to make directory", e);
    //   }
    // }

    const convertBlobToBase64 = (blob) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(blob);
      });

    const savePicture = async (photo, fileName) => {
      let base64Data = "";
      const response = await fetch(photo.webPath);
      const blob = await response.blob();
      base64Data = await convertBlobToBase64(blob);
      // readdir();
      mkdir();
      const savedFile = await Filesystem.writeFile({
        path: "MyCityApp/" + fileName,
        data: base64Data,
        directory: FilesystemDirectory.Documents,
      });
      return {
        filepath: fileName,
        webviewPath: photo.webPath,
      };
    };
    const photos = ref([]);
    const takePhoto = async () => {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100,
      });
      var imageUrl = photo.webPath;
      imageSrc.value = imageUrl;
      const fileName =
        date.formatDate(Date.now(), "YYYY_MM_DD_HH_mm_ss") + ".jpeg";
      const savedFileImage = await savePicture(photo, fileName);
      photos.value = [savedFileImage, ...photos.value];
    };

    const inputFocus = ref(false);
    const readingItems = readingStore.getReadingsByMeterId(props.meter.id);
    const lastEditTime = ref(readingItems[0].time);

    const currentReading = ref("");
    const currentReadingItem = ref();
    let lastReadingItem = ref(readingItems[0]);

    if (!props.isNew) {
      if (lastReadingItem.value.isSubmit) {
        showAlert("Submitted reading can not update");
      } else {
        lastReadingItem = ref(readingItems[0]);
        currentReading.value = readingItems[0].valueInString || "";
        currentReadingItem.value = readingItems[0];
      }
    }

    const alertIfLessThen24Hours = computed(() => {
      if (lastReadingItem.value.time + 24 * 60 * 60 * 1000 > Date.now()) {
        let time = durbanReading.timeDiffCalc(
          lastReadingItem.value.time + 24 * 60 * 60 * 1000,
          Date.now()
        );
        return `Your last entry was less than 24 hours ago. Please wait ${time} before you read again.`;
      } else {
        return "";
      }
    });

    const durbanReading = new waterDurban();

    function confirm(msg, callback) {
      $q.dialog({
        title: "Confirm",
        message: `${msg}`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          console.log(">>>> OK");
          callback();
        })
        // .onOk(() => {
        //   console.log(">>>> second OK catcher");
        //   callback();
        // })
        .onCancel(() => {
          console.log(">>>> Cancel");
        })
        .onDismiss(() => {
          console.log("I am triggered on both OK and Cancel");
        });
    }

    const saveReading = (isSubmit = false) => {
      const doSave = (currentReadingValue, valueInString) => {
        const timeToSave = new Date().toISOString();
        // const timeToSave = new Date(
        //   date.extractDate(readingDate.value, "DD/MM/YYYY")
        // ).toISOString();
        if (props.isNew) {
          addReadingInMeter({
            meter_id: props.meter.id,
            meter_reading_date: timeToSave,
            meter_reading: valueInString,
          }).then(({ status, data }) => {
            if (status) {
              readingStore.addReading({
                id: data.id,
                value: currentReadingValue,
                valueInString: valueInString,
                time: new Date(timeToSave).getTime(),
                isSubmit: isSubmit,
                meter: { id: props.meter.id },
              });
            }
          });
        } else {
          let lasteditDate = date.formatDate(
            new Date(lastEditTime.value).toISOString()
          );
          updateReadingInMeter({
            meter_id: props.meter.id,
            meter_reading_date: lasteditDate,
            meter_reading: valueInString,
            meter_reading_id: currentReadingItem.value.id,
          }).then(({ status, data }) => {
            if (status) {
              readingStore.updateReading({
                id: currentReadingItem.value.id,
                value: currentReadingValue,
                valueInString: valueInString,
                time: new Date(lasteditDate).getTime(),
                isSubmit: isSubmit,
                meter: { id: props.meter.id },
              });
            }
          });
        }

        emit("save");
      };
      if (props.isNew) {
        if (lastReadingItem.value.time + 24 * 60 * 60 * 1000 > Date.now()) {
          let time = durbanReading.timeDiffCalc(
            lastReadingItem.value.time + 24 * 60 * 60 * 1000,
            Date.now()
          );
          showAlert(
            `Your last entry was less than 24 hours ago. Please wait ${time} before you read again.`
          );
          return;
        }
      }
      const valueInString = meterComopnentReadValue.value.getValueInString();
      const currentReadingValue =
        valueInString / (props.meter.type.id == 2 ? 10.0 : 10000.0);

      if (
        !currentReadingValue ||
        currentReadingValue < lastReadingItem.value.value
      ) {
        const maximum = props.meter.type.id == 2 ? 99999.9 : 9999.9999;
        confirm(
          `This meter will rollover from ${lastReadingItem.value.valueInString} to ${valueInString}. Please confirm.`,
          () => {
            doSave(currentReadingValue, valueInString);
          }
        );
        // showAlert("Current reading must be greater than the last reading");
      } else {
        doSave(currentReadingValue, valueInString);
      }
    };

    return {
      inputFocus,
      currentReading,
      currentReadingItem,
      lastReadingItem,
      saveReading,
      meterComopnentReadValue,
      showAlert,
      alertIfLessThen24Hours,
      lastEditTime,
      imageSrc,
      captureImage,
      mkdir,
      convertBlobToBase64,
      savePicture,
      takePhoto,
      readdir,
    };
  },
  components: { MeterComponent },
});
</script>

<style scoped>
.stroke-focus {
  border: 2px solid blue;
  border-radius: 15px;
  padding: 5px;
}
.stroke-simple {
  border: 2px solid grey;
  border-radius: 15px;
  padding: 5px;
}
.captureImage {
  max-height: 300px;
  max-width: 400px;
}
</style>

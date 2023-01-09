<template>
  <!-- <q-btn label="Close Icon" color="primary" @click="alarm = true" /> -->

  <q-dialog v-model="alarm">
    <q-card class="modalborder">
      <q-card-section>
        <div class="text-h5">
          <i class="fa fa-th-list" aria-hidden="true"></i>{{ alarmMessage }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn dense label="Done" v-close-popup />
        <q-btn dense label="Remind me later" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import Quasar, { date } from "quasar";
import { useGetAlarmsStore } from "src/stores/alarm";

export default defineComponent({
  name: "GetAlarm",
  setup() {
    const alarm = ref(false);
    const alaramStore = useGetAlarmsStore();
    const getAlarm = computed(() => alaramStore.alarms);
    console.log("API DATA", getAlarm.value);
    const alarmMessage = ref("");

    const currentTimeInFractional = computed(() => {
      let newDate = new Date();
      const currentDateInMiliSecond = date.formatDate(newDate, "x");
      const alarms = new Array();
      getAlarm.value.forEach(({ date: currentDate, time, message }) => {
        let alarmDate = new Date(`${currentDate} ${time}`);
        let alarmDateInMiliSecond =
          date.formatDate(alarmDate, "x") - currentDateInMiliSecond;
        if (alarmDateInMiliSecond >= 0) {
          alarms.push({
            message: message,
            alarmDateInMiliSecond: alarmDateInMiliSecond,
          });
        }
      });
      return { alarms };
    });
    console.log("ALaRAm", currentTimeInFractional.value.alarms);
    
    const setAlarm = computed(() => {
      const alarmTime = currentTimeInFractional.value.alarms;
      alarmTime.forEach((_el) => {
        console.log("alarmDateInMiliSecond", _el);
        setTimeout(() => {
          alarmMessage.value = _el.message;
          alarm.value = true;
        }, _el.alarmDateInMiliSecond);
      });
      return alarmTime;
    });
    console.log("Set Alarm", setAlarm.value);

    return {
      alarm,
      getAlarm,
      currentTimeInFractional,
      alarmMessage,
      setAlarm,
    };
  },
});
</script>

<style>
.modalborder {
  border-radius: 10px !important;
}
</style>

<template>
  <!-- <q-btn label="Close Icon" color="primary" @click="alarm = true" /> -->
  <!-- v-if="setAlarm.length" -->
  <q-dialog v-if="setAlarm.length" v-model="alarm">
    <q-card class="modalborder">
      <q-card-section>
        <div class="text-h5">
          <i class="fa fa-th-list" aria-hidden="true"></i>{{ alarmMessage }}
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn dense label="Done" v-close-popup />
        <q-btn
          dense
          @click="remindMeLater(alarmId)"
          label="Remind me later"
          v-close-popup
        />
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
    const getAlarm = computed(() => alaramStore.getAlarms);
    // console.log("API DATA", getAlarm.value);
    const alarmMessage = ref("");
    const alarmId = ref(null);

    const currentTimeInFractional = computed(() => {
      let newDate = new Date();
      const currentDateInMiliSecond = date.formatDate(newDate, "x");
      const alarms = new Array();
      getAlarm.value.forEach(({ date: currentDate, time, message, id }) => {
        let alarmDate = new Date(`${currentDate} ${time}`);
        let alarmDateInMiliSecond =
          date.formatDate(alarmDate, "x") - currentDateInMiliSecond;
        if (alarmDateInMiliSecond >= 0) {
          alarms.push({
            id: id,
            message: message,
            alarmDateInMiliSecond: alarmDateInMiliSecond,
          });
        }
      });
      return { alarms };
    });

    const setAlarm = computed(() => {
      const alarmTime = currentTimeInFractional.value.alarms;
      alarmTime.forEach((_el) => {
        console.log("alarmDateInMiliSecond", _el);
        setTimeout(() => {
          alarmMessage.value = _el.message;
          alarm.value = true;
          alarmId.value = _el.id;
        }, _el.alarmDateInMiliSecond);
      });
      return alarmTime;
    });

    const remindMeLater = (id) => {
      const alarmTime = currentTimeInFractional.value.alarms;
      alarmTime.forEach((_el) => {
        if (_el.id === id) {
          setTimeout(() => {
            alarmMessage.value = _el.message;
            alarm.value = true;
            alarmId.value = _el.id;
          }, 10000);
        }
      });
    };

    return {
      alarm,
      getAlarm,
      currentTimeInFractional,
      alarmMessage,
      alarmId,
      setAlarm,
      remindMeLater,
    };
  },
});
</script>

<style>
.modalborder {
  border-radius: 10px !important;
}
</style>

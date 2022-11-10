<template>
  <q-card>
    <q-card-section class="text-h6 text-center">
      Projected bill for {{ readingPeriod }}
      <!-- {{ account.number ? `(${account.number})` : "" }} -->
    </q-card-section>
    <div class="text-center">
      <q-btn
        icon="help"
        @click="
          alert({
            title: 'Important note',
            message: `This bill is estimated and is based upon your inputs.

            The water calculation includes the incoming and outgoing water cost, based on the municipal tariff.

            Property Rates is not subjected to VAT.

            Check your fixed cost for accuracy as these amounts may change from time to time.`,
          })
        "
        round
        flat
        color="primary"
      />
    </div>
    <q-card-section>
      <q-card-section class="bg-primary">
        <div class="text-subtitle2">Meters</div>
      </q-card-section>
      <div class="q-my-lg">
        <div
          class="row no-wrap"
          v-for="(cost, index) in calculationsForMeters"
          :key="index"
        >
          <div class="col">
            {{ cost.title }}
          </div>

          <div class="col-auto">R {{ cost.value.toFixed(2) }}</div>
        </div>
      </div>

      <q-card-section class="bg-primary">
        <div class="text-subtitle2">Fixed Cost</div>
      </q-card-section>

      <div class="q-my-lg">
        <div
          class="row no-wrap"
          v-for="(cost, index) in calculationsForAccount"
          :key="index"
        >
          <div class="col">
            {{ cost.title }}
          </div>

          <div class="col-auto">R {{ cost.value.toFixed(2) }}</div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="bg-primary">
      <div class="text-h6">
        <div class="row no-wrap">
          <div class="col">Total</div>

          <div class="col-auto">R {{ totalFullBill.toFixed(2) }}</div>
        </div>
      </div>
    </q-card-section>
    <q-card-actions align="center">
      <q-btn rounded color="primary" text-color="black" @click="submitFullBill"
        >Submit</q-btn
      >
    </q-card-actions>
    <!-- <q-card-actions align="right">
      <q-btn color="primary" text-color="black" @click="$emit('close')"
        >Close</q-btn
      >
    </q-card-actions> -->
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { date } from "quasar";
import { useMeterStore } from "/src/stores/meter";
import { useReadingStore } from "/src/stores/reading";
import { useSiteStore } from "/src/stores/site";

import waterDurban from "/src/services/waterDurban.js";
import { LogLevel } from "@firebase/logger";
import { useQuasar } from "quasar";
export default defineComponent({
  name: "AccountCost",
  props: {
    account: Object,
  },
  setup(props) {
    const readingStore = useReadingStore();
    const meterStore = useMeterStore();
    const siteStore = useSiteStore();

    const $q = useQuasar();

    const meters = meterStore.getByAccuntId(props.account.id);
    const site = siteStore.getSiteById(props.account.site.id);

    const durbanReading = new waterDurban();

    const readingPeriod = date.formatDate(new Date(), "MMM YYYY");

    const calculationsForMeters = computed(() => {
      const meterReadings = new Array();

      meters.forEach((meter) => {
        var readings = readingStore.getReadingsByMeterId(meter.id);
        const returnLastReadings = durbanReading.getSubmitedAndLastReading(
          readings,
          readingPeriod
        );
        const usesPerDay =
          durbanReading.calculateUnitForMonth(returnLastReadings);
        const projectionCost = durbanReading.getCost(usesPerDay, meter);
        meterReadings.push({
          title: `${meter.title} - ${meter.number}`,
          value: projectionCost.total,
        });
      });

      return meterReadings;
    });

    const calculationsForAccount = computed(() => {
      const readingForAccount = new Array();

      props.account.fixedCosts.forEach((fixedCost) => {
        if (fixedCost.isApplicable) {
          readingForAccount.push({
            title: fixedCost.title,
            value: fixedCost.value || 0,
          });
        }
      });
      return readingForAccount;
    });

    const totalFullBill = computed(() => {
      let total = 0;
      calculationsForMeters.value.forEach(({ value }) => {
        total = total + value;
      });
      calculationsForAccount.value.forEach(({ value }) => {
        total = total + value;
      });
      return total;
    });

    function alert({ title, message }) {
      $q.dialog({
        dark: false,
        title: title,
        message: message,
      })
        .onOk((data) => {
          // console.log('>>>> OK, received', data)
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    const submitFullBill = () => {
      const email = site.email;
      const subject = `Account: ${props.account.id}`;
      let body = ``;

      body += `Meter reading:${readingPeriod}\n`;

      String.prototype.insert = function (index, string) {
        if (index > 0) {
          return (
            this.substring(0, index) +
            string +
            this.substring(index, this.length)
          );
        }

        return string + this;
      };

      meters.forEach((meter) => {
        var readings = readingStore.getReadingsByMeterId(meter.id);
        const returnLastReadings = durbanReading.getSubmitedAndLastReading(
          readings,
          readingPeriod
        );
        const lastReadingTime = returnLastReadings.lastReading;
        // const usesPerDay = durbanReading.calculateUnitForMonth(returnLastReadings);

        //const splitDigit = meter.type.id == 2 ? 5 : 4;
        const unit = meter.type.id == 2 ? "kWh" : "kl";
        // const valueInString = (lastReadingTime.valueInString || "").insert(
        //   splitDigit,
        //   "-"
        // );

        let valueInString = ""; //(lastReadingTime.value / 100.0 || "") + unit;

        valueInString = `Last Reading:\t${
          meter.type.id == 2
            ? lastReadingTime.value
            : lastReadingTime.value.toFixed(2)
        }\nDate:\t\t\t${date.formatDate(
          new Date(lastReadingTime.time),
          "DD MMMM YYYY"
        )}\n`;
        //valueInString = (usesPerDay * 30).toFixed(2) + " " + unit;

        body += `\n`;
        body += `${meter.type.title}\n`;
        body += `Meter:\t\t\t${meter.number}\n`;
        body += `${valueInString}\n`;

        body += `\n\n`;
      });

      body += `Powered by The LightsandWaterapp\n`;
      body += `Visit www.lightsandwater.co.za for information on how we can help you save on electricity and water with cutting edge technologies.`;

      let urlString =
        "mailto:" +
        encodeURI(email) +
        "?subject=" +
        encodeURI(subject) +
        "&body=" +
        encodeURI(body);
      console.log(body);
      //        https://mail.google.com/mail/?view=cm&fs=1&to=someone@example.com&cc=someone@ola.example&bcc=someone.else@example.com&su=SUBJECT&body=BODY

      window.open(urlString, "_blank");
    };

    return {
      calculationsForMeters,
      calculationsForAccount,
      totalFullBill,
      readingPeriod,
      submitFullBill,
      alert,
    };
  },
});
</script>

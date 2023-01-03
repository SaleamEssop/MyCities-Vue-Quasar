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

    <div class="text-h5 col-auto text-center">
      R {{ totalFullBill.toFixed(2) }}
    </div>
    <q-card-section>
      <!-- Water Bill -->
      <q-card-section class="titleofcost">
        <div class="text-subtitle2">Water</div>
      </q-card-section>
      <div class="q-my-lg">
        <div class="text-subtitle2 q-mb-sm">Meter: {{ getMeterNumber[0] }}</div>
        <template v-for="(cost, index) in calculationsForMeters" :key="index">
          <div class=" ">
            <div class="row no-wrap">
              <div v-show="cost.title !== 'Electricity bill'" class="col">
                {{ cost.title }}
              </div>
              <div v-show="cost.title !== 'Electricity bill'" class="col-auto">
                R {{ cost.value.toFixed(2) }}
                <!-- {{ cost.meter ? "Total :-" : "" }} -->
              </div>
            </div>
            <div class="q-mt-sm">
              <q-btn
                v-show="cost.title === 'Infrastructure Surcharge'"
                color="blue-2"
                rounded
                unelevated
                text-color="black"
                size="sm"
                @click="submitFullBill(cost.meter)"
                >Email Now</q-btn
              >
            </div>
          </div>
        </template>
      </div>

      <!-- Electricity Bill -->
      <q-card-section class="titleofcost">
        <div class="text-subtitle2">Electricity Meters</div>
      </q-card-section>

      <div class="q-my-lg">
        <div class="text-subtitle2 q-mb-sm">Meter: {{ getMeterNumber[1] }}</div>
        <template v-for="(cost, index) in calculationsForMeters" :key="index">
          <div>
            <div class="row no-wrap">
              <div v-show="cost.title === 'Electricity bill'" class="col">
                {{ cost.title }}
              </div>
              <div v-show="cost.title === 'Electricity bill'" class="col-auto">
                R {{ cost.value.toFixed(2) }}
              </div>
            </div>
            <div>
              <q-btn
                class="q-mt-sm"
                v-show="cost.title === 'Electricity bill'"
                color="blue-2"
                rounded
                unelevated
                text-color="black"
                size="sm"
                @click="submitFullBill(cost.meter)"
                >Email Now</q-btn
              >
            </div>
          </div>
        </template>
      </div>

      <q-card-section class="titleofcost">
        <div class="text-subtitle2">Additional Cost</div>
      </q-card-section>
      <div class="q-mt-lg">
        <div
          class="row no-wrap"
          v-for="(cost, index) in calculationsForAccount"
          :key="index"
        >
          <div v-show="cost.title !== 'Rates'" class="col">
            {{ cost.title }}
          </div>
          <div v-show="cost.title !== 'Rates'" class="col-auto">
            R {{ cost.value.toFixed(2) }}
          </div>
        </div>
      </div>
      <q-separator class="q-my-sm" />
      <div class="q-mt-sm">
        <div class="row no-wrap">
          <div class="col">SubTotal Of All Costs</div>
          <div class="col-auto">R {{ additionalAllCost.toFixed(2) }}</div>
        </div>
      </div>

      <div>
        <div class="row no-wrap">
          <div class="col">VAT</div>
          <div class="col-auto">R {{ totalVAT.toFixed(2) }}</div>
        </div>
      </div>

      <div>
        <div class="row no-wrap">
          <div class="col">Total including VAT</div>
          <div class="col-auto">R {{ VATonAdditionalCost.toFixed(2) }}</div>
        </div>
      </div>

      <div class="">
        <div
          class="row no-wrap"
          v-for="(cost, index) in calculationsForAccount"
          :key="index"
        >
          <div v-show="cost.title === 'Rates'" class="col">
            {{ cost.title }}
          </div>
          <div v-show="cost.title === 'Rates'" class="col-auto">
            R {{ cost.value.toFixed(2) }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator class="q-my-sm" />

    <q-card-section class="bg-white">
      <div class="text-h5">
        <div class="row no-wrap">
          <div class="col">Total</div>

          <div class="col-auto">R {{ totalFullBill.toFixed(2) }}</div>
        </div>
      </div>
      <q-item-label class="q-mt-md" caption
        >The amount is calculated bases on your inputs and may differ slightly
        from your actual municipal bill.</q-item-label
      >
    </q-card-section>

    <!-- <q-card-actions align="center">
      <q-btn rounded color="primary" text-color="black" @click="submitFullBill"
        >Submit</q-btn
      >
    </q-card-actions> -->
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
        // console.log("totalProjection", projectionCost);
        projectionCost.projection.forEach((_el, index) => {
          meterReadings.push({
            title: _el.title,
            value: _el.value,
          });
        });
        // meterReadings.push({
        //   title: `${meter.title} - ${meter.number}`,
        //   value: projectionCost.total,
        //   meter: meter,
        // });
      });
      return meterReadings;
    });

    const getMeterNumber = computed(() => {
      const meterName = meters.map((_el) => {
        return _el.number;
      });
      // const meterName = meters.forEach((value) => {
      //   console.log("All thinfs", value);
      // });
      return meterName;
    });

    const calculationsForAccount = computed(() => {
      const readingForAccount = new Array();
      (props.account.defaultFixedCost || []).forEach((defaultCost) => {
        if (defaultCost) {
          readingForAccount.push({
            title: defaultCost.fixed_cost.title,
            value: defaultCost.value || 0,
          });
        }
      });
      return readingForAccount;
    });

    const totalVAT = computed(() => {
      let total = 0;
      calculationsForMeters.value.forEach(({ value }) => {
        total = total + value;
      });
      // calculationsForAccount.value.forEach(({ value }) => {
      //   total = total + value;
      // });
      calculationsForAccount.value.forEach(({ title, value }) => {
        if (title !== "Rates") {
          total = total + value;
        }
      });
      return total * 0.15;
    });

    const additionalAllCost = computed(() => {
      let subTotal = 0;
      const total = props.account.defaultFixedCost.map((_el) => {
        return _el.value;
      });
      subTotal = total.reduce((a, b) => a + b, 0);
      calculationsForMeters.value.forEach(({ value }) => {
        subTotal = subTotal + value;
      });
      calculationsForAccount.value.forEach(({ title, value }) => {
        if (title === "Rates") {
          subTotal = subTotal - value;
        }
      });
      return subTotal;
    });

    const VATonAdditionalCost = computed(() => {
      let totalIncludeVAT = additionalAllCost.value;
      return totalIncludeVAT + totalIncludeVAT * 0.15;
    });

    const totalFullBill = computed(() => {
      let total = 0;
      calculationsForMeters.value.forEach(({ value }) => {
        total = total + value;
      });
      calculationsForAccount.value.forEach(({ value }) => {
        total = total + value;
      });
      total = total + totalVAT.value;
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

    const submitFullBill = (meter) => {
      const email = meter.type.id == 2 ? site.email : "eservices@durban.gov.za";
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

      //meters.forEach((meter) => {
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
      //});

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
      totalVAT,
      additionalAllCost,
      VATonAdditionalCost,
      getMeterNumber,
    };
  },
});
</script>

<style scoped>
.titleofcost {
  background: #eaeaea !important;
  border-radius: 8px !important;
  padding: 12px;
}
</style>

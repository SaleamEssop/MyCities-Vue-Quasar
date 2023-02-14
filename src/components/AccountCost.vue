<template>
  <q-card class="mainBackground">
    <q-card-section class="text-h6 headline text-center">
      <!-- <q-btn flat icon="Prev" /> -->
      <q-icon
        name="chevron_left"
        style="margin-top: -5px"
        size="lg"
        class="cursor-pointer"
        @click="previousMonth(readingPeriod)"
      />
      <span class="q-gutter-sm">
        Projected bill for
        {{ readingPeriod }}
      </span>
      <q-icon
        style="margin-top: -5px"
        name="chevron_right"
        size="lg"
        class="cursor-pointer"
        @click="nextMonth(readingPeriod)"
      />
      <div class="text-subtitle1 rounded-borders">{{ currentBillPeriod }}</div>
      <div class="text-subtitle2">Current Date:- {{ currentDate }}</div>
      <!--  for {{ readingPeriod }} -->
      <!-- {{ account.number ? `(${account.number})` : "" }} -->
      <!-- <q-btn flat icon="Next" /> -->
    </q-card-section>
    <div class="text-center">
      <!-- <q-btn
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
      /> -->
    </div>

    <div class="text-h5 col-auto text-center">
      R {{ totalFullBill.toFixed(2) }}
    </div>
    <q-card-section>
      <!-- Water Bill -->
      <q-card-section class="titleofcost">
        <div class="text-subtitle2">Water Meters</div>
      </q-card-section>

      <div class="q-mb-md q-mt-sm">
        <template v-for="(cost, index) in calculationsForMeters" :key="index">
          <div
            v-show="cost.meter.type.id === 1 && cost.title === 'Water in'"
            class="text-subtitle2 q-mb-sm"
          >
            Meter: {{ cost.meter.number }}
          </div>
          <div class="">
            <div class="row no-wrap">
              <div v-show="cost.title !== 'Electricity bill'" class="col">
                {{ cost.title }}
              </div>
              <div
                v-show="cost.totalReadingOfMonth !== null"
                class="text-blue-7 q-mr-md col"
              >
                {{ cost.totalReadingOfMonth?.toFixed(2) }} KL
              </div>
              <div v-show="cost.title !== 'Electricity bill'" class="col-auto">
                R {{ cost.value.toFixed(2) }}
              </div>
            </div>
            <div class="q-mt-sm q-mb-sm">
              <q-btn
                v-show="cost.title === 'Sewage Disposal Charge'"
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

      <div class="q-my-md">
        <template v-for="(cost, index) in calculationsForMeters" :key="index">
          <div
            v-show="cost.meter.type.id === 2 && cost.value !== 0"
            class="text-subtitle2 q-mb-sm"
          >
            Meter: {{ cost.meter.number }}
          </div>
          <div class="">
            <div v-show="cost.value !== 0" class="row no-wrap">
              <div v-show="cost.title === 'Electricity bill'" class="col">
                {{ cost.title }}
              </div>
              <div
                v-show="cost.title === 'Electricity bill'"
                class="col text-blue-7 q-mr-md"
              >
                {{ (cost.value / 2.2425).toFixed(1) }} kWh
              </div>

              <div v-show="cost.title === 'Electricity bill'" class="col-auto">
                R {{ cost.value.toFixed(2) }}
              </div>
            </div>
            <div v-show="cost.value !== 0">
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
        <div class="text-subtitle2">Additional Charges</div>
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
        >The amount is calculated based on your inputs and may differ slightly
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
import { useUserStore } from "src/stores/user";

export default defineComponent({
  name: "AccountCost",
  props: {
    account: Object,
  },
  setup(props) {
    const readingStore = useReadingStore();
    const meterStore = useMeterStore();
    const siteStore = useSiteStore();
    // const userName = useUserStore();
    const $q = useQuasar();

    const meters = meterStore.getByAccuntId(props.account.id);
    const site = siteStore.getSiteById(props.account.site.id);

    const durbanReading = new waterDurban();

    const readingPeriod = ref(date.formatDate(new Date(), "MMM YYYY"));
    const currentDate = ref(date.formatDate(new Date(), "DD MMMM YYYY"));

    // const currentMonthReadings = ref(null);

    // var readings = readingStore.getReadingsByMeterId(meters[0].id);

    // const isLastReadings = durbanReading.getSubmitedAndLastReading(readings);

    // currentMonthReadings.value = durbanReading.calculateUnitForMonth({
    //   isLastReadings: isLastReadings,
    // });

    const previousMonth = (_month) => {
      const getPreviousMonth = date.subtractFromDate(_month, {
        months: 1,
      });
      readingPeriod.value = date.formatDate(getPreviousMonth, "MMM YYYY");
    };

    const nextMonth = (_month) => {
      let currentMonth = date.formatDate(new Date(), "MMM YYYY");
      if (_month !== currentMonth) {
        const getNextMonth = date.addToDate(_month, {
          months: 1,
        });
        readingPeriod.value = date.formatDate(getNextMonth, "MMM YYYY");
      }
    };

    const currentBillPeriod = computed(() => {
      let currentbillDate = null;
      const getPreviousMonth = date.subtractFromDate(readingPeriod.value, {
        days: 7,
      });
      currentbillDate = date.formatDate(getPreviousMonth, "DD MMMM");
      const formattedString = date.formatDate(currentbillDate, "DD");
      if (formattedString == 24) {
        const getPreviousMonth = date.subtractFromDate(readingPeriod.value, {
          days: 6,
        });
        currentbillDate = date.formatDate(getPreviousMonth, "DD MMMM");
      }
      const getNextMonth = date.addToDate(readingPeriod.value, {
        days: 24,
      });
      currentbillDate =
        `${currentbillDate}` +
        " to " +
        date.formatDate(getNextMonth, "DD MMMM");
      return currentbillDate;
    });

    const calculationsForMeters = computed(() => {
      const meterReadings = new Array();
      meters.forEach((meter) => {
        var readings = readingStore.getReadingsByMeterId(meter.id);
        const returnLastReadings = durbanReading.getSubmitedAndLastReading(
          readings,
          readingPeriod.value
        );

        const usesPerDay = durbanReading.calculateUnitForMonth({
          isLastReadings: returnLastReadings,
          id: meter.type.id,
        });
        // currentMonthReadings.value = usesPerDay * 30;
        // console.log("Water", durbanReading);
        const projectionCost = durbanReading.getCost(usesPerDay, meter);
        projectionCost.projection.forEach((_el) => {
          meterReadings.push({
            title: _el.title,
            value: _el.value,
            totalReadingOfMonth: _el.reading || null,
            meter: meter,
          });
        });
      });
      return meterReadings;
    });

    // console.log("calculationsForMeters", calculationsForMeters);

    // const readingTime = computed(() => {
    //   const getMonth = new Array();
    //   readingStore.readings.forEach(({ time }) => {
    //     getMonth.push({
    //       month: date.formatDate(new Date(time), "MMMM"),
    //     });
    //   });
    //   return getMonth;
    // });

    // console.log("get readings", readingStore.readings);

    const calculationsForAccount = computed(() => {
      const readingForAccount = new Array();

      // meters.map((_el) => {
      //   let waterMeters = new Array();
      //   if (_el?.type.title === "Water") {
      //     waterMeters.push({
      //       id: _el?.id,
      //       title: _el?.type.title,
      //     });
      //   }
      //   console.log("title", waterMeters);
      // });

      (props.account.defaultFixedCost || []).forEach((defaultCost) => {
        if (defaultCost.is_active) {
          readingForAccount.push({
            title: defaultCost.fixed_cost?.title,
            value: defaultCost?.value || 0,
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
      let total = props.account.defaultFixedCost.map((_el) => {
        if (_el.is_active === 1) {
          return _el.value || 0;
        }
      });
      const arraySum = (total) => {
        const sum = total.reduce((acc, val) => {
          return acc + (val || 0);
        }, 0);
        return sum;
      };
      subTotal = subTotal + arraySum(total);
      // subTotal = total.reduce((a, b) => (b += a ? a : 0));
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

    // function alert({ title, message }) {
    //   $q.dialog({
    //     title: "Confirm",
    //     dark: false,
    //     title: title,
    //     message: `${msg}`,
    //     // message: message,
    //   })
    //     .onOk(() => {
    //       callback();
    //       // console.log('>>>> OK, received', data)
    //     })
    //     .onCancel(() => {
    //       // console.log('>>>> Cancel')
    //     })
    //     .onDismiss(() => {
    //       // console.log('I am triggered on both OK and Cancel')
    //     });
    // }

    function confirm(msg, callback) {
      $q.dialog({
        title: "Confirm",
        message: `${msg}`,
        cancel: true,
        persistent: true,
      })
        .onOk(() => {
          // console.log(">>>> OK");
          callback();
        })
        .onCancel(() => {
          // console.log(">>>> Cancel");
        });
    }

    const submitFullBill = (meter) => {
      const email = meter.type.id == 2 ? site.email : "eservices@durban.gov.za";
      const subject = `Account: ${props.account.id}`;
      let body = ``;

      body += `Meter reading:  ${readingPeriod.value}\n`;

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
        readingPeriod.value
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

      valueInString = `Current Reading:${
        meter.type.id == 2
          ? lastReadingTime.value
          : lastReadingTime.value.toFixed(2)
      }\nDate:\t\t\t${date.formatDate(
        new Date(lastReadingTime.time),
        "DD MMMM YYYY"
      )}\n`;
      //valueInString = (usesPerDay * 30).toFixed(2) + " " + unit;

      body += `Account Number: ${props.account.number}\n`;
      body += `Account Holder: ${props.account.title}\n`;
      body += `${meter.type.title} Meter:${meter.number}\n`;
      body += `${valueInString}\n`;

      body += `\n\n`;
      //});

      body += `Powered by The MyCityApp.\n`;
      body += `Visit www.mycities.co.za for information on how we can help you save on electricity and water with cutting edge technologies.`;

      let urlString =
        "mailto:" +
        encodeURI(email) +
        "?subject=" +
        encodeURI(subject) +
        "&body=" +
        encodeURI(body);
      console.log(body);
      //        https://mail.google.com/mail/?view=cm&fs=1&to=someone@example.com&cc=someone@ola.example&bcc=someone.else@example.com&su=SUBJECT&body=BODY

      // var = date.formatDate(new Date(), "DD")
      const monthDate = date.formatDate(new Date(), "DD");
      if (monthDate >= 25 && monthDate <= 23) {
        window.open(urlString, "_blank");
      } else {
        confirm(
          `You are outside the meter reading submission dates. Are you sure you want to email the reading for this meter?`,
          () => {
            window.open(urlString, "_blank");
          }
        );
      }
    };

    return {
      calculationsForMeters,
      calculationsForAccount,
      totalFullBill,
      readingPeriod,
      submitFullBill,
      // alert,
      totalVAT,
      additionalAllCost,
      VATonAdditionalCost,
      previousMonth,
      nextMonth,
      currentDate,
      currentBillPeriod,
      // currentMonthReadings,
      // isLastReadings,
    };
  },
});
</script>

<style scoped>
.headline {
  font-size: 18px !important;
}
.titleofcost {
  background: #ebebeb !important;
  border-radius: 8px !important;
  padding: 12px;
}
.mainBackground {
  background-color: #fafafa;
}
</style>

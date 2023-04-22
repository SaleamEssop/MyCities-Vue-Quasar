<template>
  <q-card class="mainBackground">
    <q-card-section class="text-h6 headline text-center">
      <!-- <q-btn flat icon="Prev" /> -->
      <q-icon name="chevron_left" style="margin-top: -5px" size="lg" class="cursor-pointer"
        @click="previousMonth(readingPeriod)" />
      <span class="q-gutter-sm">
        Projected bill for
        {{ readingPeriod }}
      </span>
      <q-icon style="margin-top: -5px" name="chevron_right" size="lg" class="cursor-pointer"
        @click="nextMonth(readingPeriod)" />
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
      R {{ fullMetercost?.final_total?.grand_total }}
      <!-- R {{ totalFullBill.toFixed(2) }} -->
    </div>
    <q-card-section>
      <!-- Water Bill -->
      <div style="display: none">
        <q-card-section class="titleofcost">
          <div class="text-subtitle2">Water Meters</div>
        </q-card-section>

        <div class="q-mb-md q-mt-sm">
          <template v-for="(cost, index) in calculationsForMeters" :key="index">
            <div v-show="cost.meter.type.id === 1 && cost.title === 'Water in'" class="text-subtitle2 q-mb-sm">
              Meter: {{ cost.meter.number }}
            </div>
            <div class="">
              <div class="row no-wrap">
                <div v-show="cost.title !== 'Electricity bill'" class="col">
                  {{ cost.title }}
                </div>
                <div v-show="cost.totalReadingOfMonth !== null" class="text-blue-7 q-mr-md col">
                  {{ cost.totalReadingOfMonth?.toFixed(2) }} KL
                </div>
                <div v-show="cost.title !== 'Electricity bill'" class="col-auto">
                  R {{ cost.value.toFixed(2) }}
                </div>
              </div>
              <div class="q-mt-sm q-mb-sm">
                <q-btn v-show="cost.title === 'Sewage Disposal Charge'" color="blue-2" rounded unelevated
                  text-color="black" size="sm" @click="submitFullBill(cost.meter)">Email Now</q-btn>
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
            <div v-show="cost.meter.type.id === 2 && cost.value !== 0" class="text-subtitle2 q-mb-sm">
              Meter: {{ cost.meter.number }}
            </div>
            <div class="">
              <div v-show="cost.value !== 0" class="row no-wrap">
                <div v-show="cost.title === 'Electricity bill'" class="col">
                  {{ cost.title }}
                </div>
                <div v-show="cost.title === 'Electricity bill'" class="col text-blue-7 q-mr-md">
                  {{ (cost.value / 2.2425).toFixed(1) }} kWh
                </div>

                <div v-show="cost.title === 'Electricity bill'" class="col-auto">
                  R {{ cost.value.toFixed(2) }}
                </div>
              </div>
              <div v-show="cost.value !== 0">
                <q-btn class="q-mt-sm" v-show="cost.title === 'Electricity bill'" color="blue-2" rounded unelevated
                  text-color="black" size="sm" @click="submitFullBill(cost.meter)">Email Now</q-btn>
              </div>
            </div>
          </template>
        </div>
      </div>
      <!-- new code for electric and water billing-->
      <q-card-section class="titleofcost">
        <div class="text-subtitle2">Water Meters</div>
      </q-card-section>

      <div class="q-mb-md q-mt-sm">
        <template v-for="(waterCost, meter_number) in fullMetercost?.water" :key="meter_number">
          <div class="text-subtitle2 q-mb-sm">Meter: {{ meter_number }}</div>
          <div class="">
            <template v-for="(cost, index) in waterCost?.projection" :key="index">
              <div class="row no-wrap">
                <div class="col">{{ cost.title }}</div>
                <div class="text-blue-7 q-mr-md col" v-if="cost?.use">{{ cost.use }} KL</div>
                <div class="col-auto">R {{ cost.total }}</div>
              </div>
            </template>
            <div class="q-mt-sm q-mb-sm">
              <q-btn color="blue-2" rounded unelevated text-color="black" size="sm"
                @click="submitFullBillNew(waterCost)">Email
                Now</q-btn>
            </div>
          </div>
        </template>
      </div>

      <!-- Electricity Bill -->
      <q-card-section class="titleofcost" v-if="fullMetercost?.electricity?.length > 0">
        <div class="text-subtitle2">Electricity Meters</div>
      </q-card-section>

      <div class="q-my-md">
        <template v-for="(electricityCost, meter_number) in fullMetercost?.electricity" :key="meter_number">
          <div class="text-subtitle2 q-mb-sm">Meter: {{ meter_number }}</div>
          <div class="">
            <template v-for="(cost, index) in electricityCost?.projection" :key="index">
              <div class="row no-wrap">
                <div class="col">{{ cost.title }}</div>
                <div class="col text-blue-7 q-mr-md" v-if="cost?.use">{{ cost.use }} kWh</div>
                <div class="col-auto">R {{ cost.total }}</div>
              </div>
            </template>
            <q-btn class="q-mt-sm" color="blue-2" rounded unelevated text-color="black" size="sm"
              @click="submitFullBill(cost)">Email Now</q-btn>
          </div>
        </template>
      </div>
      <!-- do not enter code below please check above-->
      <q-card-section class="titleofcost" v-if="fullMetercost?.additional?.length > 0">
        <div class="text-subtitle2">Additional Charges</div>
      </q-card-section>
      <div class="q-mt-lg">
        <div class="row no-wrap" v-for="(cost, index) in fullMetercost?.additional" :key="index">
          <div class="col">
            {{ cost.title }}
          </div>
          <!-- <div v-show="cost.title !== 'Rates' &&
            cost.title !== 'Enter Your Billing Date' &&
            cost.title !== 'Rates Rebate'
            " class="col-auto">
            R {{ cost.total }}
          </div> -->
          <div class="col-auto">
            R {{ cost.total }}
          </div>
        </div>
      </div>
      <q-separator class="q-my-sm" />
      <div class="q-mt-sm">
        <div class="row no-wrap">
          <div class="col">SubTotal Of All Costs</div>
          <div class="col-auto">R {{ fullMetercost?.final_total?.subtotal_of_all_cost }}</div>
        </div>
      </div>

      <div>
        <div class="row no-wrap">
          <div class="col">VAT</div>
          <div class="col-auto">R {{ fullMetercost?.final_total?.vat }}</div>
        </div>
      </div>

      <div>
        <div class="row no-wrap">
          <div class="col">Total including VAT</div>
          <div class="col-auto">R {{ fullMetercost?.final_total?.total_including_vat }}</div>
        </div>
      </div>
      <div>
        <div class="row no-wrap" v-if="fullMetercost?.final_total?.rates > 0">
          <div class="col">Rates</div>
          <div class="col-auto">R {{ fullMetercost?.final_total?.rates }}</div>
        </div>
      </div>
      <div>
        <div class="row no-wrap" v-if="fullMetercost?.final_total?.rebate > 0">
          <div class="col">Rates Rebate</div>
          <div class="col-auto">R -{{ fullMetercost?.final_total?.rebate }}</div>
        </div>
      </div>
    </q-card-section>
    <q-separator class="q-my-sm" />

    <q-card-section class="bg-white">
      <div class="text-h5">
        <div class="row no-wrap">
          <div class="col">Total</div>

          <div class="col-auto">R {{ fullMetercost?.final_total?.grand_total }}</div>
        </div>
      </div>
      <q-item-label class="q-mt-md" caption>The amount is calculated based on your inputs and may differ slightly
        from your actual municipal bill.</q-item-label>
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
import { useQuasar } from "quasar";
import { useUserStore } from "src/stores/user";
import { getParticularMeterCost } from "boot/axios";

export default defineComponent({
  name: "AccountCost",
  props: {
    account: Object,
  },
  setup(props) {
    const readingStore = useReadingStore();
    const meterStore = useMeterStore();
    const siteStore = useSiteStore();

    let response = getParticularMeterCost(props.account.id, 'fullbill').then((res) => {
      readingStore.pushfullbillcost({
        data: res.data,
      });
    });
    let fullMetercost = readingStore.getfullbillcost();
    // let fullMetercost;
    if (fullMetercost) {
      fullMetercost = fullMetercost[0]['data'];
    }
    console.log("fullbilling", fullMetercost);
    // const userName = useUserStore();
    const $q = useQuasar();

    const meters = meterStore.getByAccuntId(props.account.id);

    const site = siteStore.getSiteById(props.account.site.id);

    const durbanReading = new waterDurban();

    // For next month
    // const currentreadingPeriod = ref(date.formatDate(new Date(), "MMM YYYY"));
    // let formatMonth = date.addToDate(currentreadingPeriod.value, {
    //   months: 1,
    // });

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

    const billingCycle = computed(() => {
      let date = null;
      calculationsForAccount.value.forEach(({ title, value }) => {
        if (title === "Enter Your Billing Date") {
          date = value;
        }
      });
      return date || 24;
    });
    console.log(calculationsForAccount);
    const billingCycleMonth = computed(() => {
      let readingPeriod = null;
      const monthDate = date.formatDate(new Date(), "DD");
      if (billingCycle.value <= monthDate) {
        var currentreadingPeriod = date.formatDate(new Date(), "MMM YYYY");
        let formatMonth = date.addToDate(currentreadingPeriod, {
          month: 1,
        });
        readingPeriod = date.formatDate(formatMonth, "MMM YYYY");
      } else {
        readingPeriod = date.formatDate(new Date(), "MMM YYYY");
      }
      return readingPeriod;
    });

    const readingPeriod = ref(billingCycleMonth.value);
    // const readingPeriod = ref(date.formatDate(new Date(), "MMM YYYY"));

    const currentDate = ref(date.formatDate(new Date(), "DD MMMM YYYY"));

    // const currentMonthReadings = ref(null);

    // var readings = readingStore.getReadingsByMeterId(meters[0].id);

    // const isLastReadings = durbanReading.getSubmitedAndLastReading(readings);

    // currentMonthReadings.value = durbanReading.calculateUnitForMonth({
    //   isLastReadings: isLastReadings,
    // });

    const previousMonth = (_month) => {
      let firstReadingOfMeter = new Array();
      meters.forEach((meter) => {
        var readings = readingStore.getReadingsByMeterId(meter.id);
        return (firstReadingOfMeter = readings[readings.length - 1].time);
      });
      let firstReadingMonth = date.formatDate(firstReadingOfMeter, "MMM YYYY");
      if (_month !== firstReadingMonth) {
        const getPreviousMonth = date.subtractFromDate(_month, {
          months: 1,
        });
        readingPeriod.value = date.formatDate(getPreviousMonth, "MMM YYYY");
      }
    };

    const nextMonth = (_month) => {
      let nextOneMonth = date.addToDate(new Date(), {
        months: 1,
      });
      let nextMonth = date.formatDate(nextOneMonth, "MMM YYYY");

      // let currentMonth = date.formatDate(new Date(), "MMM YYYY");
      if (_month !== nextMonth) {
        const getNextMonth = date.addToDate(_month, {
          months: 1,
        });
        readingPeriod.value = date.formatDate(getNextMonth, "MMM YYYY");
      }
    };

    const currentBillPeriod = computed(() => {
      let currentbillDate = null;

      let getCurrentMonth = date.addToDate(readingPeriod.value, {
        days: billingCycle.value - 1,
      });
      let currentMonth = date.formatDate(getCurrentMonth, "DD MMMM");
      let getPreviousMonth = date.subtractFromDate(currentMonth, {
        month: 1,
      });
      let previousMonth = date.formatDate(getPreviousMonth, "DD MMMM");
      currentbillDate = `${previousMonth}` + " to " + `${currentMonth}`;
      return currentbillDate;
    });

    const calculationsForMeters = computed(() => {
      const meterReadings = new Array();
      meters.forEach((meter) => {
        var readings = readingStore.getReadingsByMeterId(meter.id);
        const returnLastReadings = durbanReading.getSubmitedAndLastReading(
          readings,
          readingPeriod.value,
          billingCycle.value
        );

        // console.log("readingPeriod.value", readingPeriod.value);
        // console.log("billingCycle.value", billingCycle.value);
        // readingPeriod.value

        const usesPerDay = durbanReading.calculateUnitForMonth({
          isLastReadings: returnLastReadings,
          id: meter.type.id,
        });
        // currentMonthReadings.value = usesPerDay * 30;
        // console.log("Water", durbanReading);
        const projectionCost = durbanReading.getCost(usesPerDay, meter);
        //console.log(projectionCost);
        //  co
        projectionCost.projection.forEach((_el) => {
          // console.log(_el);
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

    console.log("calculationsForMeters", calculationsForMeters);

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

    const totalVAT = computed(() => {
      let total = 0;
      calculationsForMeters.value.forEach(({ value }) => {
        total = total + value;
      });
      // calculationsForAccount.value.forEach(({ value }) => {
      //   total = total + value;
      // });
      calculationsForAccount.value.forEach(({ title, value }) => {
        if (
          title !== "Rates" &&
          title !== "Enter Your Billing Date" &&
          title !== "Rates Rebate"
        ) {
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
        if (title === "Enter Your Billing Date") {
          subTotal = subTotal - value;
        }
        if (title === "Rates Rebate") {
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
      calculationsForAccount.value.forEach(({ title, value }) => {
        if (title === "Rates Rebate") {
          total = total - value * 2;
          // console.log("value", total);
        }
        if (title === "Enter Your Billing Date") {
          billingCycle.value = value;
          total = total - value;
        }
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
    const submitFullBillNew = (metercost) => {
      console.log(metercost);
      const email = metercost.type == 1 ? metercost.water_email : metercost.electricity_email;
      const subject = `Account: ${props.account.id}`;
      let body = ``;

      body += `Meter reading:  ${readingPeriod.value}\n`;
      let valueInString = "";
      const unit = metercost.type == 2 ? "kWh" : "kl";
      valueInString = metercost.usage + " " + unit;

      body += `Account Number: ${props.account.number}\n`;
      body += `Account Holder: ${props.account.title}\n`;
      body += `Meter Title: ${metercost.meter_title}\n`;
      body += `Meter: ${metercost.meter_number}\n`;
      body += `Current Reading: ${valueInString}\n`;


      body += `\n\n`;

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
        readingPeriod.value,
        billingCycle.value
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

      valueInString = `Current Reading:${meter.type.id == 2
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
      billingCycle,
      // currentreadingPeriod,
      fullMetercost,
      submitFullBillNew
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

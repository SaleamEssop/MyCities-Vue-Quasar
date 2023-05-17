<template >
  <q-card>
    <div v-if="billingMeterCost?.data?.length != 0">
      <q-card-section class="bg-grey-2 row justify-center">
        <div class="text-subtitle1">
          Estimated Cost for Meter :- {{ billingMeterCost?.meter_number }}
        </div>

        <div style="font-size: 18px">
          {{ billingMeterCost?.firstReadingDate }} to {{ billingMeterCost?.endReadingDate }}
          <!-- {{ currentBillPeriod }} -->
        </div>
      </q-card-section>
      <q-card-section>
        <div>
          <div class="row flex justify-between items-center">
            <div class="column col-5">
              <b class="text-center">Daily Usage</b>

              <div class="medium-rcorners text-h6 text-center" color="negative" text-color="white">
                {{ billingMeterCost?.daily_usage }}
                <!-- {{
                meter.type.id == 2
                  ? usesPerDay?.toFixed(2)
                  : (usesPerDay * 1000.0)?.toFixed(2)
              }} -->
                <!-- {{ unit }} -->
              </div>
            </div>

            <div class="column col-5">
              <b class="text-center">Daily Cost</b>
              <div class="medium-rcorners text-h6 text-center" color="negative" text-color="white">
                <!-- R{{ (projectionCost["total"] / 30.0).toFixed(2) }} -->
                <!-- R{{ (totalProjectionCost / 30.0).toFixed(2) }} -->
                R {{ billingMeterCost?.daily_cost }}
              </div>
            </div>
          </div>
          <q-separator class="q-my-md" color="grey" size="2px" />
          <div v-if="billingMeterCost">
            <div class="row no-wrap" v-for="(cost, index) in billingMeterCost['projection']" :key="index">
              <div v-show="cost.title" class="col">
                {{ cost.title }}
              </div>
              <div v-show="cost.title" class="col-auto">R {{ cost.total }}</div>
            </div>
          </div>

          <div class="column flex justify-between items-center no-wrap q-mt-md">
            <b>Monthly Projected cost</b>
            <div class="big-rcorners text-h4 text-center" color="negative" text-color="white">
              <!-- R {{ projectionCost["total"].toFixed(2) }} -->
              <!-- R {{ totalProjectionCost.toFixed(2) }} -->
              R {{ billingMeterCost?.final_total }}
            </div>
          </div>
          <q-separator color="grey" class="q-my-xs" size="2px" />

          <div class="text-center text-h6 q-mt-md">
            <!-- <div>Date: {{ lastReadingDisplayFormat.timeDisplay }}</div>
          <div>Reading {{ lastReadingDisplayFormat.value }}</div> -->
            <div>Date: {{ billingMeterCost?.endReadingDate }}</div>
            <div>Reading {{ billingMeterCost?.endReading }}</div>
          </div>
        </div>
      </q-card-section>
    </div>
    <div v-else>
      {{ billingMeterCost?.msg }}
    </div>
    <q-card-actions align="evenly">
      <q-btn color="grey-2" v-if="billingMeterCost?.data?.length != 0" text-color="black"
        @click="submitBill">Email</q-btn>
      <q-btn color="grey-2" text-color="black" @click="$emit('close')">Close</q-btn>
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { date } from "quasar";
import { useReadingStore } from "/src/stores/reading";
import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";
import { useQuasar } from "quasar";

import waterDurban from "/src/services/waterDurban.js";
import { getParticularMeterCost } from "boot/axios";


export default defineComponent({
  name: "MeterCost",
  props: {
    meter: Object,
    isNew: Boolean,
    account: Object,
    meterCostData: Object
  },
  setup(props) {
    const readingStore = useReadingStore();
    const siteStore = useSiteStore();
    const accountStore = useAccountStore();

    const account = accountStore.getAccountById(props.meter.account.id);

    const meters = [props.meter];
    const $q = useQuasar();
    // const readingPeriod = ref(null)

    const site = siteStore.getSiteById(account.site.id);

    const durbanReading = new waterDurban();
    const getCost = durbanReading.getCost;

    // push data in metercost
    var list = [];
    let billingMeterCost = [];
    props?.meter?.calculation?.map(function (value, key) {
      list.push(value);
    });
    if ((list && list[0])) {
      billingMeterCost = list[0];
    } else {
      billingMeterCost = list[0];
    }
    const usesPerDay = ref(0);

    var readings = readingStore.getReadingsByMeterId(props?.meter?.id);

    const waterLevyCostByServer = computed(() => {
      const waterLevy = new Array();
      (account.defaultFixedCost || []).forEach((defaultCost) => {
        if (defaultCost?.fixed_cost.title === "Water Loss Levy") {
          waterLevy.push({
            title: defaultCost.fixed_cost.title,
            value: defaultCost.value || 0,
          });
        }
      });
      return waterLevy;
    });

    const billingCycle = computed(() => {
      let date = null;
      (account.defaultFixedCost || []).forEach((defaultCost) => {
        if (defaultCost?.fixed_cost.title === "Enter Your Billing Date") {
          date = defaultCost?.value;
        }
      });
      return date || 24;
    });

    // For next month
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

    // const readingPeriod = date.formatDate(new Date(), "MMM YYYY");

    const currentBillPeriod = computed(() => {
      let currentbillDate = null;

      let getCurrentMonth = date.addToDate(billingCycleMonth.value, {
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

    const isLastReadings = durbanReading.getSubmitedAndLastReading(
      readings,
      billingCycleMonth.value,
      billingCycle.value
    );

    // console.log("readings", readings);
    // console.log("readingPeriod", readingPeriod);
    // console.log("billingCycle", billingCycle.value);

    usesPerDay.value = durbanReading.calculateUnitForMonth({
      isLastReadings: isLastReadings,
      id: props?.meter?.type.id,
    });

    const unit = computed(() => (props?.meter?.type?.id == 2 ? "kWh" : "L"));

    // const projectionCost = getCost(usesPerDay.value, props?.meter);

    const percentageCharges = [{ title: "VAT", onTotalAmount: 0.15 }];

    String.prototype.insert = function (index, string) {
      if (index > 0) {
        return (
          this.substring(0, index) + string + this.substring(index, this.length)
        );
      }
      return string + this;
    };

    // console.log("Projection", projectionCost);

    const projectionCost = getCost(usesPerDay.value, props?.meter);

    const totalProjectionCost = computed(() => {
      let total = 0;
      waterLevyCostByServer.value.forEach(({ value }) => {
        if (projectionCost.projection.length === 0) {
          total = total + value || 0;
        }
        projectionCost.projection.forEach(({ title }) => {
          if (title !== "Electricity bill") {
            total = projectionCost.total + value;
            total = newVATOnMeterBill.value.value + total;
          } else {
            total = projectionCost.total;
            total = newVATOnMeterBill.value.value + total;
          }
        });
      });
      return total;
    });

    const newVATOnMeterBill = computed(() => {
      const VAT = new Object();
      const val = percentageCharges.forEach((_percentage) => {
        waterLevyCostByServer.value.forEach(({ value }) => {
          projectionCost.projection.forEach(({ title }) => {
            if (title !== "Electricity bill") {
              VAT["title"] = _percentage.title;
              VAT["value"] =
                _percentage.onTotalAmount * projectionCost["total"] +
                value * _percentage.onTotalAmount;
            } else {
              VAT["title"] = _percentage.title;
              VAT["value"] =
                _percentage.onTotalAmount * projectionCost["total"];
            }
          });
        });
      });
      return VAT;
    });

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

    const submitBill = () => {

      const meter = props.meter;
      console.log('01', account);
      //const email = meter.type.id == 2 ? site.email : "eservices@durban.gov.za";
      const email = meter.type.id == 1 ? account.water_email : account.electricity_email;
      const subject = `Account: ${account.number}`;
      let body = ``;
      body += `Account Number: ${account.number}\n`;
      body += `Account Holder: ${account.title}\n`;
      // body += `Account Number: ${props.meter.number}\n`;
      // body += `Meter reading: ${readingPeriod}\n`;

      meters.forEach((meter) => {
        var readings = readingStore.getReadingsByMeterId(meter.id);
        const returnLastReadings = durbanReading.getSubmitedAndLastReading(
          readings,
          billingCycleMonth.value,
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

        // body += `\n`;
        // body += `${meter.type.title}\n`;
        // body += `Meter:\t\t\t${meter.number}\n`;
        // body += `${valueInString}\n`;

        body += `${meter.type.title} Meter:\t${meter.number}\n`;
        body += `${valueInString}\n`;

        body += `\n\n`;
      });

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

      // window.open(urlString, "_blank");
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

    const lastReadingDisplayFormat = computed(() => {
      const timeDisplay = date.formatDate(
        new Date(isLastReadings.lastReading.time),
        "DD MMMM YYYY"
      );
      const seprated = props.meter.type.id == 2 ? 5 : 4;
      const value = isLastReadings.lastReading.valueInString.insert(
        seprated,
        "."
      );
      return { timeDisplay, value };
    });

    return {
      getCost,
      usesPerDay,
      unit,
      projectionCost,
      // returnLastReadings,
      submitBill,
      lastReadingDisplayFormat,
      waterLevyCostByServer,
      totalProjectionCost,
      percentageCharges,
      newVATOnMeterBill,
      // isRollOver,
      isLastReadings,
      billingCycle,
      billingCycleMonth,
      currentBillPeriod,
      billingMeterCost,
      alert
      // currentreadingPeriod,
    };
  },
});
</script>
<style scoped>
body {
  font-family: 'Varela Round', sans-serif;
}

.modal-confirm {
  color: #636363;
  width: 325px;
}

.modal-confirm .modal-content {
  padding: 20px;
  border-radius: 5px;
  border: none;
}

.modal-confirm .modal-header {
  border-bottom: none;
  position: relative;
}

.modal-confirm h4 {
  text-align: center;
  font-size: 26px;
  margin: 30px 0 -15px;
}

.modal-confirm .form-control,
.modal-confirm .btn {
  min-height: 40px;
  border-radius: 3px;
}

.modal-confirm .close {
  position: absolute;
  top: -5px;
  right: -5px;
}

.modal-confirm .modal-footer {
  border: none;
  text-align: center;
  border-radius: 5px;
  font-size: 13px;
}

.modal-confirm .icon-box {
  color: #fff;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: -70px;
  width: 95px;
  height: 95px;
  border-radius: 50%;
  z-index: 9;
  background: #ef513a;
  padding: 15px;
  text-align: center;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
}

.modal-confirm .icon-box i {
  font-size: 56px;
  position: relative;
  top: 4px;
}

.modal-confirm.modal-dialog {
  margin-top: 80px;
}

.modal-confirm .btn {
  color: #fff;
  border-radius: 4px;
  background: #ef513a;
  text-decoration: none;
  transition: all 0.4s;
  line-height: normal;
  border: none;
}

.modal-confirm .btn:hover,
.modal-confirm .btn:focus {
  background: #da2c12;
  outline: none;
}

.trigger-btn {
  display: inline-block;
  margin: 100px auto;
}
</style>
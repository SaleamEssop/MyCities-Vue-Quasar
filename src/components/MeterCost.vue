<template>
  <q-card>
    <q-card-section class="bg-primary">
      Estimated Cost {{ meter.number ? `(${meter.number})` : "" }}
      {{ returnLastReadings.period }}
    </q-card-section>
    <q-card-section>
      <div>
        <div class="row flex justify-between items-center">
          <div class="column col-5">
            <b class="text-center">Daily Usage</b>
            <div
              class="medium-rcorners text-h6 text-center"
              color="negative"
              text-color="white"
            >
              {{
                meter.type.id == 2
                  ? usesPerDay?.toFixed(2)
                  : (usesPerDay * 1000.0)?.toFixed(2)
              }}
              {{ unit }}
            </div>
          </div>
          <div class="column col-5">
            <b class="text-center">Daily Cost</b>
            <div
              class="medium-rcorners text-h6 text-center"
              color="negative"
              text-color="white"
            >
              R{{ (projectionCost["total"] / 30.0).toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="q-mt-lg">
          <div
            class="row no-wrap"
            v-for="(cost, index) in projectionCost['projection']"
            :key="index"
          >
            <div v-show="cost.title !== 'VAT'" class="col">
              {{ cost.title }}
            </div>
            <div v-show="cost.title !== 'VAT'" class="col-auto">
              R {{ cost.value.toFixed(2) }}
            </div>
          </div>
        </div>

        <div
          class="row no-wrap"
          v-for="(cost, index) in waterLevyCostByServer"
          :key="index"
        >
          <div
            v-show="projectionCost.projection[0].title !== 'Electricity bill'"
            class="col"
          >
            {{ cost.title }}
          </div>
          <div
            v-show="projectionCost.projection[0].title !== 'Electricity bill'"
            class="col-auto"
          >
            R {{ cost.value.toFixed(2) }}
          </div>
        </div>

        <div class="">
          <div
            class="row no-wrap"
            v-for="(cost, index) in projectionCost['projection']"
            :key="index"
          >
            <div v-show="cost.title === 'VAT'" class="col">
              {{ cost.title }}
            </div>
            <div v-show="cost.title === 'VAT'" class="col-auto">
              R {{ cost.value.toFixed(2) }}
            </div>
          </div>
        </div>
        <div class="q-mb-lg">
          <div class="row no-wrap">
            <div class="col">
              {{ newVATOnMeterBill?.title }}
            </div>
            <div v-show="newVATOnMeterBill?.value" class="col-auto">
              R {{ newVATOnMeterBill.value?.toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="column flex justify-between items-center no-wrap q-mt-md">
          <b>Monthly Projected cost</b>
          <div
            class="big-rcorners text-h4 text-center"
            color="negative"
            text-color="white"
          >
            <!-- R {{ projectionCost["total"].toFixed(2) }} -->
            R {{ totalProjectionCost.toFixed(2) }}
          </div>
        </div>
        <div class="text-center text-h6 q-mt-md">
          <div>Date: {{ lastReadingDisplayFormat.timeDisplay }}</div>
          <div>Reading {{ lastReadingDisplayFormat.value }}</div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="evenly">
      <q-btn color="primary" text-color="black" @click="submitBill"
        >Email</q-btn
      >
      <q-btn color="primary" text-color="black" @click="$emit('close')"
        >Close</q-btn
      >
    </q-card-actions>
  </q-card>
</template>
<script>
import { defineComponent, ref, computed } from "vue";
import { date } from "quasar";
import { useReadingStore } from "/src/stores/reading";
import { useSiteStore } from "/src/stores/site";
import { useAccountStore } from "/src/stores/account";

import waterDurban from "/src/services/waterDurban.js";

export default defineComponent({
  name: "MeterCost",
  props: {
    meter: Object,
    isNew: Boolean,
    account: Object,
  },
  setup(props) {
    const readingStore = useReadingStore();
    const siteStore = useSiteStore();
    const accountStore = useAccountStore();

    const account = accountStore.getAccountById(props.meter.account.id);

    const meters = [props.meter];

    const site = siteStore.getSiteById(account.site.id);

    const durbanReading = new waterDurban();
    const getCost = durbanReading.getCost;

    const usesPerDay = ref(0);

    var readings = readingStore.getReadingsByMeterId(props?.meter?.id);
    const returnLastReadings =
      durbanReading.getSubmitedAndLastReading(readings);
    usesPerDay.value = durbanReading.calculateUnitForMonth(returnLastReadings);

    const unit = computed(() => (props?.meter?.type?.id == 2 ? "kWh" : "L"));

    // const projectionCost = getCost(usesPerDay.value, props?.meter);

    const readingPeriod = date.formatDate(new Date(), "MMM YYYY");

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

    const waterLevyCostByServer = computed(() => {
      const waterLevy = new Array();
      (account.defaultFixedCost || []).forEach((defaultCost) => {
        if (defaultCost.fixed_cost.title === "Water Loss Levy") {
          waterLevy.push({
            title: defaultCost.fixed_cost.title,
            value: defaultCost.value || 0,
          });
        }
      });
      return waterLevy;
    });

    const projectionCost = getCost(usesPerDay.value, props?.meter);

    const totalProjectionCost = computed(() => {
      let total = 0;
      waterLevyCostByServer.value.forEach(({ value }) => {
        projectionCost.projection.forEach(({ title }) => {
          if (title !== "Electricity bill") {
            total = projectionCost.total + value || 0;
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

    const submitBill = () => {
      const meter = props.meter;
      const email = meter.type.id == 2 ? site.email : "eservices@durban.gov.za";
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

        // body += `\n`;
        // body += `${meter.type.title}\n`;
        // body += `Meter:\t\t\t${meter.number}\n`;
        // body += `${valueInString}\n`;

        body += `${meter.type.title} Meter:\t${meter.number}\n`;
        body += `${valueInString}\n`;

        body += `\n\n`;
      });

      body += `Powered by The LightsAndWaterApp\n`;
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

    const lastReadingDisplayFormat = computed(() => {
      const timeDisplay = date.formatDate(
        new Date(returnLastReadings.lastReading.time),
        "DD MMMM YYYY"
      );
      const seprated = props.meter.type.id == 2 ? 5 : 4;
      const value = returnLastReadings.lastReading.valueInString.insert(
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
      returnLastReadings,
      submitBill,
      lastReadingDisplayFormat,
      waterLevyCostByServer,
      totalProjectionCost,
      percentageCharges,
      newVATOnMeterBill,
    };
  },
});
</script>

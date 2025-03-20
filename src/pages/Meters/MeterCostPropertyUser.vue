<template>
  <div class="container">
    <div v-if="loading" class="text-center">
      <q-spinner color="primary" size="3em" />
      <p>Loading...</p>
    </div>
    <div v-else>
      <div class="row w-full justify-center">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="top-bg rounded-top">
              <div class="heading-section">
                <span class="heading">{{ currentItem.heading }}</span>
                <span class="meter">Meter: {{ currentItem.meter }}</span>
                <span class="meter_reading"
                  >Reading: {{ currentItem.meter_reading }}</span
                >
              </div>
              <div class="container slider-section">
                <div class="row justify-center items-start">
                  <div class="col-2 move-btn pointer" @click="prevItem">
                    <img
                      class="q-mt-lg q-ml-xl"
                      src="~assets/left.png"
                      alt=""
                    />
                  </div>
                  <div class="col-8 slider-content">
                    <h5>{{ currentItem.dateRange }}</h5>
                    <p class="current-date">
                      Current Date: {{ currentItem.currentDate }}
                    </p>
                    <p
                      class="status rounded text-white q-pa-sm"
                      v-html="currentItem.readIn"
                    ></p>
                    <h3 class="credit rupees current-amount">
                      {{ currentItem.amount }}
                    </h3>
                  </div>
                  <div class="col-2 move-btn pointer" @click="nextItem">
                    <img
                      class="q-mt-lg q-mr-xl"
                      src="~assets/right.png"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body estimation-section q-pa-sm">
              <div class="row usage-section">
                <div class="col-4">
                  <p class="usage-heading">Daily Usage</p>
                  <p class="usage-value">{{ currentItem.daily_usage }}</p>
                </div>
                <div class="col-4">
                  <p class="usage-heading">Total Usage</p>
                  <p class="usage-value">{{ currentItem.total_usage }}</p>
                </div>
                <div class="col-4">
                  <p class="usage-heading">Daily Cost</p>
                  <p class="usage-value">{{ currentItem.daily_cost }}</p>
                </div>
              </div>
            </div>
            <div class="card-body bg-white q-pa-md">
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-6 text-weight-bold charges">Balance B/F</div>
                <div class="col-6 price text-weight-bold text-right">
                  {{ currentItem.balance_bf }}
                </div>
              </div>
              <hr />
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 text-weight-bold">Consumption Charges</div>
                <div class="col-4 price text-weight-bold text-right">
                  {{ currentItem.consumption_charges }}
                </div>
              </div>
              <hr />
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 text-weight-bold">Discharge Charges</div>
                <div class="col-4 price text-weight-bold text-right">
                  {{ currentItem.discharge_charges }}
                </div>
              </div>
              <hr />
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 text-weight-bold price">
                  Infrastructure Surcharge
                </div>
                <div class="col-4 price text-weight-bold text-right">
                  {{ currentItem.infrastructure_surcharge }}
                </div>
              </div>
              <hr />
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 text-weight-bold price">Sewage Disposal</div>
                <div class="col-4 price text-weight-bold text-right">
                  {{ currentItem.sewage_disposal }}
                </div>
              </div>
              <hr />
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 text-weight-bold price">VAT</div>
                <div class="col-4 price text-weight-bold text-right">
                  {{ currentItem.vat }}
                </div>
              </div>
              <hr />
            </div>
            <div
              v-if="
                currentItem.projected_bill.trim() !== '' &&
                currentItem.page === 1
              "
              class="card-body text-center q-pa-md"
            >
              <h6 class="text-weight-bold bg-body q-py-md">
                Projected bill for {{ currentItem.projected_bill_month }}
                {{ currentItem.projected_bill }}
              </h6>
            </div>
            <div
              v-if="currentItem.total.trim() !== '' && currentItem.page != 4"
              class="card-body bg-body text-center q-pa-md"
            >
              <div
                class="row justify-between q-my-sm q-px-md"
                style="margin-bottom: 20px"
              >
                <div class="col-8 text-left text-weight-bold">Total</div>
                <div class="col-4 text-weight-bold text-right">
                  {{ currentItem.total }}
                </div>
              </div>
              <template>
                <!-- Loop through payment_details -->
                <div v-if="currentItem.payment_details.length > 0">
                  <div
                    v-for="(
                      payment, paymentIndex
                    ) in currentItem.payment_details"
                    :key="paymentIndex"
                    class="row justify-between q-my-sm q-px-md"
                  >
                    <div class="col-8 text-left q-px-lg">
                      Payment {{ payment.payment_date }}
                    </div>
                    <div class="col-4 text-weight-bold text-right">
                      {{ payment.payment_amount }}
                    </div>
                  </div>
                </div>
                <div
                  v-else
                  class="row Text center justify-between q-my-sm q-px-md"
                >
                  No payment details
                </div>
                <hr />
              </template>
              <div class="border"></div>
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 credit-balance text-left">Credit Balance</div>
                <div
                  class="col-4 text-weight-bold text-right"
                  style="padding-top: 3px !important"
                >
                  {{ currentItem.credit_balance }}
                </div>
              </div>

              <!-- <div
                v-if="
                  currentItem.balance.trim() !== '' &&
                  store?.allData?.property?.property_name
                "
                class="row justify-between q-my-sm q-px-md"
              >
                <div class="col-8 text-weight-bold text-left">Balance</div>
                <div class="col-4 text-weight-bold text-right">
                  {{ currentItem.balance }}
                </div>
              </div>
              <div v-else class="row justify-between q-my-sm q-px-md">
                <div
                 
                  class="col-8 credit-balance text-left"
                >
                  Credit Balance
                </div>
                <div
                 
                  class="col-4 text-weight-bold text-right"
                >
                  {{ currentItem.credit_balance }}
                </div>
              </div> -->
            </div>
            <div
              v-if="currentItem.page === 4"
              class="card-body bg-body text-center q-pa-md"
            >
              <!-- Projected Bill -->
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 text-left q-px-sm projected-bill">
                  Projected bill for {{ currentItem.projected_bill_month }}
                </div>
                <div class="col-4 text-weight-bold text-right">
                  {{ currentItem.projected_bill }}
                </div>
              </div>

              <!-- Credit Balance -->
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 credit-balance-interim q-px-sm text-left">
                  Credit Balance
                </div>
                <div class="col-4 text-weight-bold text-right">
                  {{ currentItem.credit_balance }}
                </div>
              </div>

              <!-- Border above Balance -->
              <div class="border"></div>

              <!-- Balance -->
              <div class="row justify-between q-my-sm q-px-md">
                <div class="col-8 balance text-left">Balance</div>
                <div class="col-4 balance text-right">
                  {{ currentItem.balance }}
                </div>
              </div>
            </div>

            <div class="card-body bg-white q-pa-md">
              <!-- <div class="q-mb-md overestimate">
                <h5 class="text-weight-bold">
                  Overestimate {{ currentItem.overestimate_month }}
                </h5>
                <p>{{ currentItem.overestimate }}</p>
              </div> -->
              <p v-if="user?.is_property_manager === 1">
                Property Manager: {{ user?.is_property_manager }}
              </p>
              <div
                v-if="user?.is_property_manager === 1"
                class="row items-center justify-center"
              >
                <div class="col-9">
                  <form @submit.prevent="sendPaymentAmount">
                    <q-label class="q-mb-sm q-pl-sm">Property Manager</q-label>
                    <q-input
                      square
                      outlined
                      v-model="amount.paymentAmount"
                      label="Enter a payment amount"
                    />
                    <q-btn
                      label="Submit"
                      color="primary"
                      class="q-mt-md"
                      type="submit"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute } from "vue-router";
import { useUserStore } from "/src/stores/user";
import { useDataStore } from "src/stores/property";
import { date } from "quasar";

export default {
  name: "BillingDashboard",

  setup() {
    const route = useRoute();
    const userStore = useUserStore();

    const dataStore = useDataStore();
    const user = userStore.getUser;
    console.log("User object1:", user);
    return {
      meterId: route.params.id,
      user: userStore.getUser,
      store: dataStore,
    };
  },

  data() {
    return {
      currentIndex: 0,
      paymentAmount: "",
      billingData: [
        {
          page: 0,
          heading: "Loading...",
          meter: "",
          meter_reading: "",
          dateRange: "",
          currentDate: "",
          readIn: "",
          amount: "",
          daily_usage: "",
          total_usage: "",
          daily_cost: "",
          balance_bf: "",
          consumption_charges: "",
          discharge_charges: "",
          infrastructure_surcharge: "",
          sewage_disposal: "",
          vat: "",
          total: "",
          payment_details: [],
          balance: "",
          credit_balance: "",
          projected_bill: "",
          projected_bill_month: "",
          overestimate: "",
          overestimate_month: "",
        },
      ],
      summary: [],
      overdueInfo: null,
      estimatedCost: null,
      loading: true,
      error: null,
      currentDate: date.formatDate(Date.now(), "DD MMM YYYY"),
      amount: { paymentAmount: "" },
      previous_start_date: "",
      previous_end_date: "",
    };
  },

  computed: {
    currentItem() {
      return this.billingData[this.currentIndex] || {};
    },
  },

  mounted() {
    this.initializeComponent();
  },

  methods: {
    initializeComponent() {
      this.fetchSummary();
    },

    async fetchSummary() {
      if (!this.validateMeterId()) return;
      try {
        const response = await this.fetchBillingData();
        this.processBillingResponse(response);
      } catch (err) {
        this.handleError("Failed to fetch data", err);
      } finally {
        this.loading = false;
      }
    },

    async fetchBillingData() {
      return this.$api.get("/v1/meter/cost-calculation", {
        params: { meter_id: this.meterId },
      });
    },

    async sendPaymentAmount() {
      if (!this.validatePaymentData()) return;
      try {
        await this.$api.post("/v1/meter/add-meter-readingForm", {
          meter_id: this.meterId,
          user_id: this.user.id,
          amount: this.amount.paymentAmount,
          previous_start_date: this.previous_start_date,
          previous_end_date: this.previous_end_date,
        });
        this.handleSuccess("Payment amount sent successfully");
      } catch (err) {
        this.handleError("Failed to send payment amount", err);
      }
    },

    processBillingResponse(response) {
      if (response.status === true) {
        this.billingData = [
          this.createProjectedCost(response),
          this.createInterimEstimateCurrent(response),
          this.createFinalEstimate(response),
          this.createInterimEstimatePrevious(response),
        ];
        this.updateSummaryData(response);
      } else {
        this.error = `Server returned status: ${response.status}`;
      }
    },

    createProjectedCost(response) {
      return {
        page: 1,
        heading: "Projected Cost",
        meter: response.meter?.meter_number || "N/A",
        meter_reading: response.latest_meter_reading?.reading_value || "N/A",

        dateRange: this.getDateRange(
          response.current_period_start_date,
          response.current_period_end_date
        ),
        //new
        currentDate: this.formatDate(new Date()),
        readIn: `Read in ${
          response.currentPeriodRemainingReadingDays || 0
        } days`,
        amount: this.formatCurrency(response.estimated_bill?.cost || 0),
        daily_usage: `${response.estimated_bill?.daily_usage || 0} liters`,
        total_usage: `${response.estimated_bill?.usage_liters || 0} Kl`,
        daily_cost: this.formatCurrency(
          response.estimated_bill?.daily_cost || 0
        ),
        balance_bf: this.formatCurrency(
          response.estimated_bill?.balance_bf || 0
        ),
        consumption_charges: this.formatCurrency(
          response.estimated_bill?.consumption_charge || 0
        ),
        discharge_charges: this.formatCurrency(
          response.estimated_bill?.discharge_charge || 0
        ),
        infrastructure_surcharge: this.formatCurrency(
          response.estimated_bill?.additional_costs?.[0]?.cost || 0
        ),
        sewage_disposal: this.formatCurrency(
          response.estimated_bill?.water_out_additional?.[0]?.cost || 0
        ),
        vat: this.formatCurrency(response.estimated_bill?.vat || 0),
        total: "",
        payment_details: [],
        balance: "",
        credit_balance: "",
        projected_bill: this.formatCurrency(response.estimated_bill?.cost || 0),
        projected_bill_month: this.getMonthRange(
          response.current_period?.start_date,
          response.current_period?.end_date
        ),
        overestimate: "",
        overestimate_month: "",
      };
    },
    createInterimEstimateCurrent(response) {
      return {
        page: 2,
        heading: "Interim Estimate",
        meter: response.meter?.meter_number || "N/A",
        meter_reading: response.latest_meter_reading?.reading_value || "N/A",
        dateRange: this.getDateRange(
          response.current_period?.start_date,
          response.current_period?.end_date
        ),
        currentDate: this.formatDate(new Date()),
        readIn: `Read in ${
          response.currentPeriodRemainingReadingDays || 0
        } days`,
        amount: this.formatCurrency(
          response.estimated_billing_interim?.balance || 0
        ),
        daily_usage: `${
          response.estimated_billing_interim
            ?.estimated_billing_interim_daily_usage || 0
        } liters`,

        total_usage: `${
          response.estimated_billing_interim
            ?.estimated_billing_interim_total_usage || 0
        } Kl`,

        daily_cost: this.formatCurrency(
          response.estimated_billing_interim
            ?.estimated_billing_interim_daily_cost || 0
        ),
        balance_bf: this.formatCurrency(
          response.estimated_billing_interim?.balance_bf || 0
        ),
        consumption_charges: this.formatCurrency(
          response.estimated_billing_interim?.consumption_charge || 0
        ),
        discharge_charges: this.formatCurrency(
          response.estimated_billing_interim?.discharge_charges || 0
        ),
        infrastructure_surcharge: this.formatCurrency(
          response.estimated_billing_interim?.infrastructure_surcharge || 0
        ),
        sewage_disposal: this.formatCurrency(
          response.estimated_billing_interim?.sewage_disposal || 0
        ),
        vat: this.formatCurrency(response.estimated_billing_interim?.vat || 0),
        total: this.formatCurrency(
          response.estimated_billing_interim?.total_amount || 0
        ),
        payment_details: [],
        balance: this.formatCurrency(
          response.estimated_billing_interim?.balance || 0
        ),
        credit_balance: this.formatCurrency(
          response.estimated_billing_interim
            ?.estimated_billing_interim_credit_balance || 0
        ),
        projected_bill: this.formatCurrency(
          response.estimated_billing_interim?.total_amount || 0
        ),
        projected_bill_month: this.getMonthRange(
          response.estimated_billing_interim?.cycleDates?.start_date,
          response.estimated_billing_interim?.cycleDates?.end_date
        ),
        overestimate: "R 800.00",
        overestimate_month: "Dec - Jan",
      };
    },

    createFinalEstimate(response) {
      return {
        page: 3,
        heading: "Final Estimate",
        meter: response.meter?.meter_number || "N/A",
        meter_reading: response.latest_meter_reading?.reading_value || "N/A",
        dateRange: this.getDateRange(
          response.perviousBill?.perviousCycleDates?.previous_start_date,
          response.perviousBill?.perviousCycleDates?.previous_end_date
        ),
        currentDate: this.formatDate(new Date()),
        readIn: response.perviousBill?.perviousMonthLatestReadingDate
          ? `Read ${this.formatDate(
              response.perviousBill.perviousMonthLatestReadingDate
            )}`
          : "N/A",

        amount: this.formatCurrency(response.perviousBill?.total_cost || 0),

        daily_usage: `${
          response.perviousBill?.perviousMonthDailyUsage || 0
        } liters`,

        total_usage: `${
          response.perviousBill?.perviousMonthTotalUsage || 0
        } Kl`,

        daily_cost: this.formatCurrency(
          response.perviousBill?.perviousMonthDailyCost || 0
        ),

        balance_bf: this.formatCurrency(response.perviousBill?.balance_bf || 0),
        consumption_charges: this.formatCurrency(
          response.perviousBill?.consumption_charge || 0
        ),
        discharge_charges: this.formatCurrency(
          response.perviousBill?.discharge_charges || 0
        ),
        infrastructure_surcharge: this.formatCurrency(
          response.perviousBill?.infrastructure_surcharge || 0
        ),
        sewage_disposal: this.formatCurrency(
          response.perviousBill?.sewage_disposal || 0
        ),
        vat: this.formatCurrency(response.perviousBill?.vat || 0),
        total: this.formatCurrency(response.perviousBill?.total_cost || 0),
        payment_details: [
          {
            payment_date: this.getMonthRange(
              response.perviousBill?.perviousCycleDates?.previous_start_date,
              response.perviousBill?.perviousCycleDates?.previous_end_date
            ),
            payment_amount: this.formatCurrency(
              response.perviousBill?.month_total_cost || 0
            ),
          },
        ],
        balance: "",
        credit_balance: this.formatCurrency(
          response.perviousBill?.totalOutstandingAmount || 0
        ),
        projected_bill: "",
        projected_bill_month: "",
        overestimate: this.formatCurrency(
          response.perviousBill?.totalOutstandingAmount || 0
        ),
        overestimate_month: "Dec - Jan",
      };
    },

    createInterimEstimatePrevious(response) {
      // return {
      //   page: 4,
      //   heading: "Interim Estimate",
      //   meter: response.meter?.meter_number || "N/A",
      //   meter_reading: response.latest_meter_reading?.reading_value || "N/A",
      //   dateRange: this.getDateRange(
      //     response.current_period?.start_date,
      //     response.current_period?.end_date
      //   ),
      //   currentDate: this.formatDate(new Date()),
      //   readIn: response.current_bill?.overdueDays || "N/A",
      //   amount: this.formatCurrency(response.current_bill?.total || 0),
      //   daily_usage: "1280 liters",
      //   total_usage: "40.90 Kl",
      //   daily_cost: "R 67.90",
      //   balance_bf: this.formatCurrency(response.current_bill?.balance_bf || 0),
      //   consumption_charges: this.formatCurrency(
      //     response.current_bill?.consumption_charge || 0
      //   ),
      //   discharge_charges: this.formatCurrency(
      //     response.current_bill?.discharge_charges || 0
      //   ),
      //   infrastructure_surcharge: this.formatCurrency(
      //     response.current_bill?.infrastructure_surcharge || 0
      //   ),
      //   sewage_disposal: this.formatCurrency(
      //     response.current_bill?.sewage_disposal || 0
      //   ),
      //   vat: this.formatCurrency(response.current_bill?.vat || 0),
      //   total: this.formatCurrency(response.current_bill?.total || 0),
      //   payment_details: (
      //     response.current_bill?.current_month_payment_details || []
      //   ).map((payment) => ({
      //     payment_date: this.formatDate(payment?.payment_date),
      //     payment_amount: this.formatCurrency(payment?.total_paid_amount || 0),
      //   })),
      //   balance: this.formatCurrency(response.current_bill?.balanceCd || 0),
      //   credit_balance: "",
      //   projected_bill: "",
      //   projected_bill_month: "",
      //   overestimate: "R 800.00",
      //   overestimate_month: "Jan - Feb",
      // };
      return {
        page: 4,
        heading: "Interim Estimate",
        meter: response.meter?.meter_number || "N/A",
        meter_reading: response.latest_meter_reading?.reading_value || "N/A",
        dateRange: "N/A",
        currentDate: this.formatDate(new Date()),
        readIn: "N/A",
        amount: this.formatCurrency(0.0),
        daily_usage: "0.00 liters",
        total_usage: "0.00 Kl",
        daily_cost: "R 0.00",
        balance_bf: this.formatCurrency(0.0),
        consumption_charges: this.formatCurrency(0.0),
        discharge_charges: this.formatCurrency(0.0),
        infrastructure_surcharge: this.formatCurrency(0.0),
        sewage_disposal: this.formatCurrency(0.0),
        vat: this.formatCurrency(0.0),
        total: this.formatCurrency(0.0),
        payment_details: [],
        balance: this.formatCurrency(0.0),
        credit_balance: "R 0.00",
        projected_bill: "R 0.00",
        projected_bill_month: "N/A",
        overestimate: "R 0.00",
        overestimate_month: "N/A",
      };
    },
    updateSummaryData(response) {
      this.previous_start_date =
        response.perviousBill?.perviousCycleDates?.previous_start_date || "";
      this.previous_end_date =
        response.perviousBill?.perviousCycleDates?.previous_end_date || "";
      this.summary = response.meter || [];
      this.estimated_bill = response.estimated_bill || {};
      this.calculateOverdueInfo();
    },

    validateMeterId() {
      if (!this.meterId) {
        this.error = "Cannot fetch summary: meterId is not set";
        this.loading = false;
        return false;
      }
      return true;
    },

    validatePaymentData() {
      if (!this.meterId || !this.user?.id) {
        this.error = "Cannot send payment: meterId or user not set";
        this.loading = false;
        alert(this.error);
        return false;
      }
      return true;
    },

    getDateRange(start, end) {
      return `${this.formatDate(start)} to ${this.formatDate(end)}`;
    },

    getMonthRange(start, end) {
      const startDate = new Date(start || Date.now());
      const endDate = new Date(end || Date.now());
      return `${startDate.toLocaleString("en-US", {
        month: "short",
      })} - ${endDate.toLocaleString("en-US", { month: "short" })}`;
    },

    formatDate(dateString) {
      return date.formatDate(new Date(dateString || Date.now()), "DD MMM YYYY");
    },

    formatCurrency(value) {
      return `R ${Number(value || 0).toFixed(2)}`;
    },

    prevItem() {
      this.currentIndex =
        this.currentIndex > 0
          ? this.currentIndex - 1
          : this.billingData.length - 1;
    },

    nextItem() {
      this.currentIndex =
        this.currentIndex < this.billingData.length - 1
          ? this.currentIndex + 1
          : 0;
    },

    handleError(message, err) {
      this.error = `${message}: ${err.response?.data?.message || err.message}`;
      console.error(message, err);
      alert(this.error);
    },

    handleSuccess(message) {
      this.error = message;
      alert(message);
    },

    calculateOverdueInfo() {
      // Implement overdue calculation logic if needed
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
}

.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}

div {
  font-size: 16px;
}

.bg-body {
  background-color: #f5f5f5;
}

.top-bg {
  background-color: #e0e0e0;
}

.estimation-section {
  background-color: #3294b8;
  color: white;
}

.slider-section {
  margin-top: 10px;
}

p {
  margin: 0;
  font: 16px;
}

.price {
  color: black;
}

hr {
  margin: 0;
}

.card {
  border: none;
  overflow: hidden;
}

.pointer {
  cursor: pointer;
}

.move-btn {
  display: flex;
  justify-content: center;
  align-items: start;
}

.move-btn img {
  height: 30px !important;
  width: 30px !important;
}

.status {
  background-color: #61a301;
  font-size: 16px !important;
  margin-left: 20px !important;
  margin-right: 20px !important;
}

.current-date {
  margin-bottom: 25px !important;
  font-size: 16px !important;
  font-weight: 400 !important;
  margin-bottom: 8px !important;
}

.charges {
  color: #61a301;
}

.rupees {
  font-size: 48px !important;
  margin: 8px 0 !important;
}

.credit {
  color: #3294b8;
}

.credit-balance {
  font-size: 20px;
  color: #3294b8;
  font-weight: 400px;
}

.credit-balance-interim {
  font-size: 16px;
  color: #3294b8;
  font-weight: 400px;
  padding-left: 0px;
}
.projected-bill {
  font-size: 16px;
  font-weight: 400px;
  padding-left: 0px;
}

.current-amount {
  text-align: center;
  font-weight: 700 !important;

  margin: 10px 0;
  padding: 0;
}

.heading-section {
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 5px 10px;
  gap: 10px;
}

.heading-section span {
  display: inline-block;
  font-size: 16px;
}

.heading {
  font-weight: bold;
  font-size: 16px;
}

.slider-content {
  display: flex;
  flex-direction: column;
}

.slider-content h5 {
  text-align: center;
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  padding: 0;
}

.overestimate h5 {
  font-size: 16px;
  margin: 0;
  padding: 0;
}

.slider-content p {
  text-align: center;
  font-size: 16px;
  margin: 0;
  padding: 0;
}

.usage-value {
  font-size: 20px;
  font-weight: 700;
}

.usage-heading {
  font-size: 16px;
  font-weight: 700;
}

.usage-section {
  display: flex !important;
  justify-content: space-between;
  text-align: center;
}

.balance {
  font-size: 20px;
  font-weight: 400;
}

.border {
  width: 130px;
  height: 1px;
  background-color: black;
  margin: 8px 0 8px auto;
}

.balance {
  font-size: 20px;
  font-weight: 400;
}
</style>

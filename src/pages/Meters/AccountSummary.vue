<template>
  <div class="container">
    <div v-if="summary.length <= 0" class="text-center">
      <q-spinner color="primary" size="3em" />
      <p>Loading...</p>
    </div>
    <div v-else class="row justify-content-center">
      <div class="col-md-12 q-mb-lg">
        <div class="card">
          <div class="top-bg text-center">
            <img src="path/to/mycities-logo.png" alt="Logo" />
            <p> {{ property.property_name }}</p>
      

            <h3 class="q-my-sm">{{ user.name }}, {{ account.account_name }}</h3>
            <h6 class="q-mb-sm">Current Date: {{ currentDate }}</h6>
          </div>
          <div class="card-body">
            <div class="summary-card q-my-sm">
              <p class="summary">Account Summary</p>
            </div>

            <!-- Dynamically render periods -->
            <div v-for="(period, index) in summary" :key="index">
              <div class="heading-bg row items-center">
                <div class="col-6">
                  <p class="mb-0">{{ period.period }}</p>
                </div>
                <div class="col-6 text-end">
                  <h6>R {{ formatNumber(period.total_amount) }}</h6>
                </div>
              </div>
              <div class="row g-0">
                <div class="col-12">
                  <div
                    v-if="period.balance_bf"
                    class="row data-row justify-between"
                  >
                    <div class="col-8">
                      <p>Balance B/F</p>
                    </div>
                    <div class="col-4">
                      <p class="end">R {{ formatNumber(period.balance_bf) }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-12" v-if="period.payment_date">
                  <div class="row data-row justify-between">
                    <div class="col-8">
                      <p class="">
                        Payment {{ formatDate(period.payment_date) }}
                      </p>
                    </div>
                    <div class="col-4 text-end">
                      <p class="end">
                        R {{ formatNumber(period.payment_amount) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="col-12">
                  <div class="row data-row justify-content-between mb-2">
                    <div class="col-8">
                      <p class="">Balance Carried</p>
                    </div>
                    <div class="col-4 text-left">
                      <p class="end">
                        R {{ formatNumber(period.balance_carried) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payments Details Section -->
              <div
                v-if="period.payments && period.payments.length > 0"
                class="payments-section"
              >
                <div class="heading-bg row items-center">
                  <div class="col">
                    <h5>Payments Details</h5>
                  </div>
                </div>

                <div
                  v-for="(payment, paymentIndex) in period.payments"
                  :key="paymentIndex"
                  class="row q-mb-sm"
                >
                  <div class="col-8">
                    <p class="text-bold">Amount</p>
                    <p>Status: {{ payment.status }}</p>
                  </div>
                  <div class="col-4 end">
                    <p class="text-bold">
                      R {{ formatNumber(payment.amount) }}
                    </p>
                    <p>Paid: R {{ formatNumber(payment.paid_amount) }}</p>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="row">
            <div class="col-12 bg-body payment q-my-md">
              <button v-if="overdueInfo" class="btn btn-success btn-lg">
                Payment Overdue
              </button>
            </div>
          </div>
          <div class="row items-center justify-center total-bill">
            <div class="col-12 text-center">
              <h2 v-if="overdueInfo">
                R {{ formatNumber(overdueInfo.amount) }}
              </h2>
              <p v-if="overdueInfo">{{ overdueInfo.period }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed, ref, watch, onMounted } from "vue";

import { useRoute } from "vue-router";
import { date } from "quasar";
import { useSiteStore } from "/src/stores/site";

const siteStore = useSiteStore();

const property = computed(() => siteStore.property);

export default {
  data() {
    return {
      summary: [],
      overdueInfo: null,
      loading: true,
      error: null,
      meterId: null,
      user: null,
      account: null,
      currentDate: date.formatDate(Date.now(), "DD MMM YYYY"),
      property,
    };
  },
  mounted() {
    const route = useRoute();
    this.meterId = route.params.id;
    this.fetchSummary();
  },
  methods: {
    async fetchSummary() {
      if (!this.meterId) {
        this.error = "Cannot fetch summary: meterId is not set";
        this.loading = false;
        return;
      }
      try {
        const response = await this.$api.get("/v1/meter/account-summary", {
          params: { meter_id: this.meterId },
        });
        console.log("Raw response:", response);
        if (response.status === true) {
          if (Array.isArray(response.data)) {
            this.summary = response.data;
            this.user = response.user;
            this.account = response.user.account;
            this.calculateOverdueInfo();
          } else {
            console.error("Unexpected response format:", response);
            this.error = "Failed to fetch usage data: Invalid response format";
          }
        } else {
          this.error =
            "Failed to fetch usage data: Server returned status " +
            response.status;
        }
      } catch (err) {
        this.error =
          "Failed to fetch usage data: " +
          (err.response?.data?.message || err.message);
        console.error("Fetch error:", err);
      } finally {
        this.loading = false;
      }
    },
    calculateOverdueInfo() {
      const overduePeriod = this.summary.find(
        (period) => period.is_overdue === true
      );
      if (overduePeriod) {
        this.overdueInfo = {
          amount: overduePeriod.balance_carried,
          period: overduePeriod.period,
        };
      } else {
        this.overdueInfo = null;
      }
    },

    formatNumber(value) {
      return Number(value).toFixed(2);
    },

    formatDate(dateStr) {
      if (!dateStr) return "";
      return date.formatDate(dateStr, "D MMM YYYY");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap");
.container {
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}
body {
  font-family: "Roboto", sans-serif;
  background-color: #f5f5f5;
  margin: 0;
  padding: 0;
}
p,
h5,
h6 {
  margin: 0;
  font-size: 16px;
}
.bg-body {
  background-color: #f5f5f5 !important;
}
.top-bg,
.heading-bg {
  background-color: #e0e0e0;
}
.heading-bg {
  border-radius: 5px;
  display: flex;
  justify-content: space-between !important;
  align-items: center !important;
  margin: 10px 0;
  padding: 0px 10px !important;
}

.heading-bg h6 {
  text-align: end !important;
}
.top-bg img {
  height: 76px;
  width: 298px;
}
.end {
  text-align: end !important;
}
.top-bg p {
  font-size: 36px;
  font-weight: 200;
}
.top-bg h3 {
  font-size: 20px;
  font-weight: 700;
  line-height: 16px;
}
.top-bg h6 {
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
}
.top-bg {
  padding: 6px !important;
}
.summary-card {
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.summary {
  font-size: 24px;
  font-weight: 300;
  text-align: center;
}
.color {
  background-color: #f8f9fa;
}
.payments-section {
  border-radius: 8px;
  padding-bottom: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 10px;
}

.payments-section h5 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}
.card {
  border: none;
  /* border-radius: 20px; */
  overflow: hidden;
}
.payment {
  min-height: 80px !important;
  display: flex;
  align-items: center;
  justify-content: center;
}
.data-row {
  display: flex !important;
  justify-content: space-between !important;
  padding: 5px 10px !important;
}
.payment button {
  height: 54px;
  width: 379px;
  background-color: #61a301;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 32px;
  font-weight: 400;
}
.total-bill {
  min-height: 200px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.total-bill div {
  height: 70px !important;
}
.total-bill h2 {
  font-size: 48px;
  font-weight: 700;
  margin: 10px 0 !important;
}
</style>

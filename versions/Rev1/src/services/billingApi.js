import { api } from "boot/axios";

/**
 * Billing API service for backend billing integration
 */
class BillingApi {
  /**
   * Get bill estimate/preview/finalize
   * @param {number} accountId - Account ID
   * @param {Object} options - Options object
   * @param {string} options.mode - 'estimate' | 'preview' | 'finalize'
   * @param {string} options.period_start - ISO 8601 date string (optional)
   * @param {string} options.period_end - ISO 8601 date string (optional)
   * @param {string} options.idempotency_key - Optional idempotency key
   * @returns {Promise<Object>} Bill data
   */
  async getBill(accountId, options = {}) {
    const { mode = "estimate", period_start, period_end, idempotency_key } = options;

    const params = {
      account_id: accountId,
      mode,
    };

    if (period_start) params.period_start = period_start;
    if (period_end) params.period_end = period_end;
    if (idempotency_key) params.idempotency_key = idempotency_key;

    try {
      const response = await api.get("/v1/bills", { params });
      return {
        status: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Billing API error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to fetch bill",
        data: null,
      };
    }
  }

  /**
   * Finalize a bill (POST request)
   * @param {number} accountId - Account ID
   * @param {Object} options - Options object
   * @returns {Promise<Object>} Finalized bill data
   */
  async finalizeBill(accountId, options = {}) {
    const { period_start, period_end, idempotency_key } = options;

    const payload = {
      account_id: accountId,
      mode: "finalize",
    };

    if (period_start) payload.period_start = period_start;
    if (period_end) payload.period_end = period_end;
    if (idempotency_key) payload.idempotency_key = idempotency_key;

    try {
      const response = await api.post("/v1/bills", payload);
      return {
        status: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Billing finalize error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to finalize bill",
        data: null,
      };
    }
  }

  /**
   * Recompute a bill (admin only)
   * @param {number} billId - Bill ID
   * @returns {Promise<Object>} Recomputed bill data
   */
  async recomputeBill(billId) {
    try {
      const response = await api.post(`/v1/bills/${billId}/recompute`);
      return {
        status: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Bill recompute error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to recompute bill",
        data: null,
      };
    }
  }

  /**
   * Get a specific bill by ID
   * @param {number} billId - Bill ID
   * @returns {Promise<Object>} Bill data
   */
  async getBillById(billId) {
    try {
      const response = await api.get(`/v1/bills/${billId}`);
      return {
        status: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("Get bill error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to fetch bill",
        data: null,
      };
    }
  }

  /**
   * List bills for an account
   * @param {number} accountId - Account ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} List of bills
   */
  async listBills(accountId, options = {}) {
    const params = {
      account_id: accountId,
      ...options,
    };

    try {
      const response = await api.get("/v1/bills", { params });
      return {
        status: true,
        data: response.data || response,
      };
    } catch (error) {
      console.error("List bills error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to list bills",
        data: null,
      };
    }
  }
}

export default new BillingApi();






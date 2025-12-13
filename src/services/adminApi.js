import { api } from "boot/axios";

/**
 * Admin API service for admin-only operations
 * All operations are logged to admin_actions table
 */
class AdminApi {
  /**
   * Edit a reading (admin only)
   * @param {number} readingId - Reading ID
   * @param {Object} data - Edit data
   * @param {number} data.value - New reading value
   * @param {string} data.reason - Reason for edit (required)
   * @param {boolean} data.is_rollover - Whether this is a rollover
   * @returns {Promise<Object>}
   */
  async editReading(readingId, data) {
    try {
      const response = await api.post(`/v1/admin/readings/${readingId}/edit`, {
        value: data.value,
        reason: data.reason,
        is_rollover: data.is_rollover || false,
        rollover_reason_code: data.rollover_reason_code || null,
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Admin edit reading error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to edit reading",
        data: null,
      };
    }
  }

  /**
   * Delete a reading (soft delete, admin only)
   * @param {number} readingId - Reading ID
   * @param {string} reason - Reason for deletion (required)
   * @returns {Promise<Object>}
   */
  async deleteReading(readingId, reason) {
    try {
      const response = await api.post(`/v1/admin/readings/${readingId}/delete`, {
        reason,
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Admin delete reading error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to delete reading",
        data: null,
      };
    }
  }

  /**
   * Add a new reading (admin only, bypasses cooldown)
   * @param {Object} data - Reading data
   * @param {number} data.meter_id - Meter ID
   * @param {string} data.meter_reading_date - ISO date string
   * @param {string} data.meter_reading - Reading value
   * @param {string} data.reason - Reason for admin add
   * @param {boolean} data.is_rollover - Whether this is a rollover
   * @returns {Promise<Object>}
   */
  async addReading(data) {
    try {
      const response = await api.post("/v1/admin/readings/add", {
        meter_id: data.meter_id,
        meter_reading_date: data.meter_reading_date,
        meter_reading: data.meter_reading,
        reason: data.reason,
        is_rollover: data.is_rollover || false,
        rollover_reason_code: data.rollover_reason_code || null,
        bypass_cooldown: true, // Admin always bypasses cooldown
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Admin add reading error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to add reading",
        data: null,
      };
    }
  }

  /**
   * Recompute a bill (admin only)
   * @param {number} billId - Bill ID to recompute
   * @param {string} reason - Reason for recompute (optional)
   * @returns {Promise<Object>}
   */
  async recomputeBill(billId, reason = "") {
    try {
      const response = await api.post(`/v1/admin/bills/${billId}/recompute`, {
        reason,
      });
      return {
        status: true,
        data: response.data,
        job_id: response.data?.job_id,
      };
    } catch (error) {
      console.error("Admin recompute bill error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to recompute bill",
        data: null,
      };
    }
  }

  /**
   * Recompute bill for an account (admin only)
   * @param {number} accountId - Account ID
   * @param {string} reason - Reason for recompute (optional)
   * @returns {Promise<Object>}
   */
  async recomputeAccountBill(accountId, reason = "") {
    try {
      const response = await api.post(`/v1/admin/accounts/${accountId}/recompute-bill`, {
        reason,
      });
      return {
        status: true,
        data: response.data,
        job_id: response.data?.job_id,
      };
    } catch (error) {
      console.error("Admin recompute account bill error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to recompute bill",
        data: null,
      };
    }
  }

  /**
   * Get audit log for an account/meter
   * @param {Object} params - Query params
   * @param {number} params.account_id - Account ID (optional)
   * @param {number} params.meter_id - Meter ID (optional)
   * @param {number} params.reading_id - Reading ID (optional)
   * @param {number} params.limit - Number of records (default 50)
   * @returns {Promise<Object>}
   */
  async getAuditLog(params = {}) {
    try {
      const response = await api.get("/v1/admin/audit-log", { params });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get audit log error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to fetch audit log",
        data: null,
      };
    }
  }

  /**
   * Undo last admin action (rollback)
   * @param {number} actionId - Admin action ID to undo
   * @param {string} reason - Reason for undo
   * @returns {Promise<Object>}
   */
  async undoAction(actionId, reason) {
    try {
      const response = await api.post(`/v1/admin/actions/${actionId}/undo`, {
        reason,
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Undo admin action error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to undo action",
        data: null,
      };
    }
  }

  /**
   * Get reading history with admin details
   * @param {number} meterId - Meter ID
   * @param {Object} params - Query params
   * @returns {Promise<Object>}
   */
  async getReadingHistory(meterId, params = {}) {
    try {
      const response = await api.get(`/v1/admin/meters/${meterId}/readings`, { params });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Get reading history error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to fetch reading history",
        data: null,
      };
    }
  }

  /**
   * Override reading flags (admin only)
   * @param {number} readingId - Reading ID
   * @param {Object} flags - Flags to set
   * @param {boolean} flags.is_rollover - Rollover flag
   * @param {boolean} flags.admin_override - Admin override flag
   * @param {boolean} flags.is_estimated - Estimated flag
   * @param {boolean} flags.is_final - Final flag
   * @param {string} reason - Reason for override
   * @returns {Promise<Object>}
   */
  async setReadingFlags(readingId, flags, reason) {
    try {
      const response = await api.post(`/v1/admin/readings/${readingId}/flags`, {
        ...flags,
        reason,
      });
      return {
        status: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Set reading flags error:", error);
      return {
        status: false,
        error: error.response?.data?.message || error.message || "Failed to set flags",
        data: null,
      };
    }
  }

  /**
   * Check if current user has admin role
   * @returns {Promise<Object>}
   */
  async checkAdminRole() {
    try {
      const response = await api.get("/v1/admin/check-role");
      return {
        status: true,
        isAdmin: response.data?.is_admin || false,
        role: response.data?.role || "user",
      };
    } catch (error) {
      // 403 means not admin
      if (error.response?.status === 403) {
        return {
          status: true,
          isAdmin: false,
          role: "user",
        };
      }
      console.error("Check admin role error:", error);
      return {
        status: false,
        isAdmin: false,
        error: error.message,
      };
    }
  }
}

export default new AdminApi();






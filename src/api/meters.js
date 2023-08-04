import {api} from "boot/axios";

export const getCost = (meter_id, month) => {
  return api.get(`/v1/meters/${meter_id}/cost-estimation`, {
    params: {
      month
    }
  });
}
export const getFullBill = (account_id, month) => {
  return api.get(`/v1/meters/account/${account_id}/complete-bill`, {
    params: {
      month
    }
  });
}

import {api} from "boot/axios";

export const getCost = (meter_id) => {
  return api.get(`/v1/meters/${meter_id}/cost`);
}

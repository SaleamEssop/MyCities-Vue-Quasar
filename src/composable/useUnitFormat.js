import {ELECTRICITY_METER, WATER_METER} from "src/config/meter";

const formatter = new Intl.NumberFormat('en-US');
export const useUnitFormat = () => {
  return {
    unitFormat(value, type) {
      console.log(type);
      if (typeof value !== 'number') {
        return value;
      }
      if (type === WATER_METER) {
        return `${formatter.format(value)} kL`;
      } else if (type === ELECTRICITY_METER) {
        return `${formatter.format(value)} kWh`;
      }
    },
    klToLitters(value) {
      if (typeof value !== 'number') {
        return value;
      }
      return `${formatter.format(value * 1000)} L`;
    },
  }
}

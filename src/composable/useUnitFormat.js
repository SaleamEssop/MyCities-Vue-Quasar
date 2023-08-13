import { ELECTRICITY_METER, WATER_METER } from "src/config/meter";

const formatter = new Intl.NumberFormat("en-US");
const formatterFraction = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const electricytFormatterFraction = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
export const useUnitFormat = () => {
  function formatNumberWithLeading4Zeroes(number) {
    const numberAsString = number.toString(); // Convert the number to a string
    const parts = numberAsString.split(".");
    const integerPart = parts[0].padStart(4, "0"); // Ensure at least 4 characters including leading zeroes
    const decimalPart = parts[1] || ""; // Handle case where there's no decimal part
    return `${integerPart}.${decimalPart}`;
  }
  function formatNumberWithLeading5Zeroes(number) {
    const numberAsString = number.toString(); // Convert the number to a string
    const parts = numberAsString.split(".");
    const integerPart = parts[0].padStart(5, "0"); // Ensure at least 4 characters including leading zeroes
    const decimalPart = parts[1] || ""; // Handle case where there's no decimal part
    return `${integerPart}.${decimalPart}`;
  }
  return {
    unitFormat(value, type, fractions = false) {
      if (typeof value !== "number") {
        return value;
      }
      if (type === WATER_METER) {
        if (fractions) {
          return `${formatNumberWithLeading4Zeroes(
            formatterFraction.format(value)
          )} kL`;
        } else {
          return `${formatter.format(value)} kL`;
        }
      } else if (type === ELECTRICITY_METER) {
        if (fractions) {
          console.log(value);
          return `${formatNumberWithLeading5Zeroes(
            electricytFormatterFraction.format(value)
          )} kWh`;
        } else {
          return `${formatter.format(value)} kWh`;
        }
      }
    },
    klToLitters(value) {
      if (typeof value !== "number") {
        return value;
      }
      return `${formatter.format(value * 1000)} L`;
    },
  };
};

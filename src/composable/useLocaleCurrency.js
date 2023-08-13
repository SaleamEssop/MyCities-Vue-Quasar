const currency = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 0,
});
const currencyFraction = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  minimumFractionDigits: 2,
});

export const useLocaleCurrency = () => {
  return {
    currency(value) {
      if (typeof value !== "number") {
        return value;
      }
      return currency.format(value);
    },
    currencyFraction(value) {
      if (typeof value !== "number") {
        return value;
      }
      return currencyFraction.format(value);
    },
  };
};

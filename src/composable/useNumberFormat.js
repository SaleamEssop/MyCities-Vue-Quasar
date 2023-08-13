const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "decimal",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
export const useNumberFormat = () => {
  return {
    numberFormat(value) {
      if (typeof value !== "number") {
        return value;
      }
      return numberFormatter.format(value);
    },
  };
};

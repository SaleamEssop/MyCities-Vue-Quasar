const numberFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
});
export const useNumberFormat = () => {
  return{
    numberFormat(value) {
      if (typeof value !== 'number') {
        return value;
      }
      return numberFormatter.format(value);
    },
  }
}

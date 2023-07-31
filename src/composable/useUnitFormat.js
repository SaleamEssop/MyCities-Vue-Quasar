const formatter = new Intl.NumberFormat('en-US');
export const useUnitFormat = () => {
  return{
    unitFormat(value) {
      if (typeof value !== 'number') {
        return value;
      }
      return `${formatter.format(value)} kL`;
    },
    klToLitters(value) {
      if (typeof value !== 'number') {
        return value;
      }
      return `${formatter.format(value * 1000)} L`;
    },
  }
}

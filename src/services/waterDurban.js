//All Unit should be in liter
import { date } from "quasar";

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export default class {
  getSubmitedAndLastReading = (readings, monthYear) => {
    const formatForPeriod = "MMM YYYY";
    const getBothSideReading = (readings, month) => {
      let data =
        groupBy(
          (readings || []).map((item) => {
            item["period"] = date.formatDate(
              new Date(item.time),
              formatForPeriod
            );
            return item;
          }),
          "period"
        )[month] || [];

      data = data.sort((a, b) => b.time - a.time);

      const lastReading = data[0] || {};
      const firstReading = data[data.length - 1] || {};
      return { firstReading, lastReading };
    };

    let returnableLastReading = {};
    let returnableFirstReading = {};

    let currentMonthDate = monthYear
      ? date.extractDate(monthYear, formatForPeriod)
      : new Date();

    const period = date.formatDate(currentMonthDate, formatForPeriod);

    let i = 24; //check at maximum 24 months
    do {
      let month = date.formatDate(
        date.subtractFromDate(currentMonthDate, { months: 24 - i }),
        formatForPeriod
      );
      const { firstReading, lastReading } = getBothSideReading(readings, month);
      if (
        Object.keys(returnableLastReading).length === 0 &&
        Object.keys(lastReading).length > 0
      ) {
        returnableLastReading = lastReading;

        if (firstReading.time != lastReading.time) {
          returnableFirstReading = firstReading;
        }
      } else {
        if (
          Object.keys(returnableLastReading).length > 0 &&
          Object.keys(returnableFirstReading).length === 0 &&
          Object.keys(lastReading).length > 0 &&
          returnableLastReading.time != lastReading.time
        ) {
          returnableFirstReading = lastReading;
        }
      }

      if (
        Object.keys(returnableLastReading).length > 0 &&
        Object.keys(returnableFirstReading).length > 0
      ) {
        break;
      }
    } while (--i > 0);

    return {
      firstReading: returnableFirstReading,
      lastReading: returnableLastReading,
      period: period,
    };
  };

  calculateUnitForMonth = ({ isLastReadings, id }) => {
    const { lastReading, firstReading } = isLastReadings;
    if (firstReading.value > lastReading.value) {
      let maxValue = id === 2 ? 99999.9 : 9999.9999;
      var consumeUnits = maxValue + lastReading.value - firstReading.value;
    } else {
      var consumeUnits = lastReading.value - firstReading.value;
    }
    var consumeTime = lastReading.time - firstReading.time;
    return (consumeUnits / consumeTime || 0) * 1000 * 60 * 60 * 24;
  };

  getWaterMeterCost = (perDayUses) => {
    // console.log("Current Month Days", new Date());
    const totalDaysInMonth = 30;
    const monthlyUses = totalDaysInMonth * perDayUses;
    //rates for kLiter
    const rates = [
      { min: 0, max: 200, ir: 26.87, or: 4.43, out: 95.0 / 100.0 },
      { min: 200, max: 833, ir: 31.83, or: 7.48, out: 75.0 / 100.0 },
      { min: 833, max: 1000, ir: 42.43, or: 14.26, out: 75.0 / 100.0 },
      { min: 1000, max: 1500, ir: 65.39, or: 22.26, out: 65.0 / 100.0 },
      {
        min: 1500,
        max: Number.MAX_SAFE_INTEGER,
        ir: 71.91,
        or: 25.48,
        out: 65.0 / 100.0,
      },
    ].map((rate) => {
      return {
        min: rate.min,
        max: rate.max,
        ir: rate.ir,
        or: rate.or,
        out: rate.out,
      };
    });

    // const extraCharges = [
    //   {
    //     title: "Infrastructure Surcharge",
    //     amountPerUnit: 1.48,
    //     amount: 0,
    //   },
    //   { title: "Water Loss Levy", amountPerUnit: 0, amount: 14.9 },
    // ];
    const extraCharges = [
      {
        title: "Infrastructure Surcharge",
        amountPerUnit: 1.48,
        amount: 0,
      },
    ];

    const percentageCharges = [{ title: "VAT", onTotalAmount: 0.15 }];

    const fractionInputReading = (index, uses) => {
      const rate = rates[index];
      const maxiumForMonth = Math.round(((rate.max - rate.min) * 30) / 1000.0);

      const conditionInputUses = Math.min(maxiumForMonth, uses);
      //Math.round(Math.min(maxiumForMonth, uses) / 1000.0) * 1000.0;

      const conditionOutputUses = conditionInputUses * rate.out;

      return {
        conditionInputUses: conditionInputUses,
        conditionOutputUses: conditionOutputUses,
        conditionInputRate: conditionInputUses * rate["ir"],
        conditionOutputRate: conditionOutputUses * rate["or"],
        nextUnit: uses - conditionInputUses,
      };
    };

    const readingCharges = new Array();
    let usesUnit = monthlyUses;
    let rateIndex = 0;
    while (rateIndex < rates.length) {
      let fractionInputReadingValue = fractionInputReading(
        rateIndex++,
        usesUnit
      );
      usesUnit = fractionInputReadingValue.nextUnit;
      readingCharges.push(fractionInputReadingValue);
      if (usesUnit <= 0) {
        break;
      }
    }

    const sumOfReadingCharges = readingCharges.reduce(
      (acc, curr) => {
        acc["in"]["value"] += curr["conditionInputRate"];
        acc["out"]["value"] += curr["conditionOutputRate"];

        acc["in"]["reading"] += curr["conditionInputUses"];
        acc["out"]["reading"] += curr["conditionOutputUses"];

        return acc;
      },
      {
        in: { title: "Water in", value: 0, reading: 0 },
        out: { title: "Water Out", value: 0, reading: 0 },
      }
    );

    const projection = [];

    Object.keys(sumOfReadingCharges).forEach((key) => {
      projection.push(sumOfReadingCharges[key]);
    });

    extraCharges.forEach((charge) => {
      projection.push({
        title: charge.title,
        value:
          charge.amountPerUnit * sumOfReadingCharges["in"]["reading"] ||
          charge.amount,
      });
    });

    // const sumOfTotalBill = projection.reduce((acc, _project) => {
    //   // console.log("projection", projection);
    //   acc += _project.value;
    //   return acc;
    // }, 0.0);

    // const sumOfVatableValue = sumOfTotalBill - projection[2].value;

    // percentageCharges.forEach((_percentage) => {
    //   projection.push({
    //     title: _percentage.title,
    //     value: _percentage.onTotalAmount * sumOfVatableValue,
    //   });
    // });

    const returnProjection = {};
    returnProjection["projection"] = monthlyUses > 0 ? projection : [];
    returnProjection["total"] =
      monthlyUses > 0
        ? projection.reduce((acc, { value }) => {
            acc += value;
            return acc;
          }, 0)
        : 0;
    returnProjection["readingCharges"] = readingCharges;
    returnProjection["extraCharges"] = extraCharges;
    // Projection
    return returnProjection;
  };

  getElectricMeterCost = (perDayUses) => {
    const totalDaysInMonth = 30;
    const monthlyUses = totalDaysInMonth * perDayUses;

    const returnProjection = {};

    const projection = [];
    projection.push({ title: "Electricity bill", value: monthlyUses * 2.2425 });
    // projection.push({ title: "VAT", value: monthlyUses * 2.2425 * 0.15 });

    returnProjection["projection"] = projection;
    returnProjection["total"] = projection.reduce((acc, { value }) => {
      acc += value;
      return acc;
    }, 0);
    return returnProjection;
  };

  getCost = (perDayUses, meter) => {
    // console.log(perDayUses, meter);
    if (meter?.type?.id == 2) {
      return this.getElectricMeterCost(perDayUses);
    }

    if (meter?.type?.id == 1) {
      return this.getWaterMeterCost(perDayUses);
    }
  };

  timeDiffCalc = (dateFuture, dateNow) => {
    let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

    // calculate days
    const days = Math.floor(diffInMilliSeconds / 86400);
    diffInMilliSeconds -= days * 86400;
    console.log("calculated days", days);

    // calculate hours
    const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
    diffInMilliSeconds -= hours * 3600;
    console.log("calculated hours", hours);

    // calculate minutes
    const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
    diffInMilliSeconds -= minutes * 60;
    console.log("minutes", minutes);

    let difference = "";
    if (days > 0) {
      difference += days === 1 ? `${days} day, ` : `${days} days, `;
    }

    difference +=
      hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

    difference +=
      minutes === 0 || hours === 1
        ? `${minutes} minutes`
        : `${minutes} minutes`;

    return difference;
  };
}

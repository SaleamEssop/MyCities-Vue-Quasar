//All Unit should be in liter
export default class {
  getSubmitedAndLastReading = (readings) => {
    const data = (readings || []).sort((a, b) => b.time - a.time);
    const lastReading = data[0] || {};
    const firstReading =
      data.find(({ isSubmit }) => isSubmit) || data[data.length - 1] || {};
    return { firstReading, lastReading };
  };

  calculateUnitForMonth = ({ firstReading, lastReading }) => {
    const consumeUnits = lastReading.value - firstReading.value;
    const consumeTime = lastReading.time - firstReading.time;
    return (consumeUnits / consumeTime || 0) * 1000 * 60 * 60 * 24;
  };

  getWaterMeterCost = (perDayUses) => {
    const totalDaysInMonth = 30;
    const monthlyUses = totalDaysInMonth * perDayUses;
    //rates for kLiter
    const rates = [
      { min: 0, max: 200, ir: 26.87, or: 4.43, out: 95.0 / 100.0 },
      { min: 200, max: 833, ir: 31.83, or: 7.48, out: 75.0 / 100.0 },
      { min: 833, max: 1000, ir: 42.43, or: 14.26, out: 75.0 / 100.0 },
      { min: 1000, max: 1500, ir: 65.39, or: 22.26, out: 65.0 / 100.0 },
    ].map((rate) => {
      return {
        min: rate.min,
        max: rate.max,
        ir: rate.ir / 1000.0,
        or: rate.or / 1000.0,
        out: rate.out,
      };
    });

    const extraCharges = [
      {
        title: "Infrastructure Surcharge",
        amountPerUnit: 1.48 / 1000.0,
        amount: 0,
      },
      { title: "Water Loss Levy", amountPerUnit: 0, amount: 14.9 },
    ];

    const percentageCharges = [{ title: "VAT", onTotalAmount: 0.15 }];

    const fractionInputReading = (index, uses) => {
      const rate = rates[index];
      const maxiumForMonth = Math.round((rate.max - rate.min) * 30);

      const conditionInputUses =
        Math.max(Math.round(Math.min(maxiumForMonth, uses) / 1000.0), 1) *
        1000.0;
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

    const sumOfTotalBill = projection.reduce((acc, _project) => {
      acc += _project.value;
      return acc;
    }, 0.0);

    percentageCharges.forEach((_percentage) => {
      projection.push({
        title: _percentage.title,
        value: _percentage.onTotalAmount * sumOfTotalBill,
      });
    });

    const returnProjection = {};
    returnProjection["projection"] = projection;
    returnProjection["total"] = projection.reduce((acc, { value }) => {
      acc += value;
      return acc;
    }, 0);
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
    projection.push({ title: "Electricity bill", value: monthlyUses * 2.24 });
    projection.push({ title: "VAT", value: monthlyUses * 2.24 * 0.15 });

    returnProjection["projection"] = projection;
    returnProjection["total"] = projection.reduce((acc, { value }) => {
      acc += value;
      return acc;
    }, 0);
    return returnProjection;
  };

  getCost = (perDayUses, meter) => {
    console.log(perDayUses, meter);
    if (meter?.type?.id == 2) {
      return this.getElectricMeterCost(perDayUses);
    }

    if (meter?.type?.id == 1) {
      return this.getWaterMeterCost(perDayUses);
    }
  };
}

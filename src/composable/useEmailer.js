import { ELECTRICITY_METER, WATER_METER } from "src/config/meter";
import { date, useQuasar } from "quasar";
import EmailWarning from "components/EmailWarning.vue";
import { useUnitFormat } from "src/composable/useUnitFormat";
import EmailWarningBoundary from "components/EmailWarningBoundary.vue";

export const useEmail = () => {
  const $q = useQuasar();
  const unitFormat = useUnitFormat();
  return {
    mailCost(costDetails) {
      const current_date = costDetails.current_date;
      const meter = costDetails.meter_details;
      const usage = costDetails.usage;
      const account = costDetails.account;
      const email =
        meter.meter_type_id === WATER_METER
          ? account.water_email
          : account.electricity_email;
      const subject = `Account: ${account.account_number}`;
      let body = ``;
      body += `Account Number: ${account.account_number}\n`;
      body += `Account Holder: ${account.account_name}\n`;
      if (meter.meter_type_id === WATER_METER) {
        body += `Meter Number: ${meter.meter_number}\n`;
      } else if (meter.meter_type_id === ELECTRICITY_METER) {
        body += `Meter Number: ${meter.meter_number}\n`;
      }
      body += `Current Reading: ${unitFormat.unitFormat(
        usage.total_usage,
        meter.meter_type_id,
        true
      )}\n`;
      body += `Date: ${current_date}\n\n\n\n\n`;
      body += `Powered by the MyCities App.\n`;
      body += `Visit www.mycities.co.za for information on how we can help you save on electricity and water with cutting edge technologies.`;
      let urlString =
        "mailto:" +
        encodeURI(email) +
        "?subject=" +
        encodeURI(subject) +
        "&body=" +
        encodeURI(body);

      const monthDate = date.formatDate(new Date(), "DD");
      if (monthDate >= 25 && monthDate <= 23) {
        $q.dialog({
          component: EmailWarning,
        })
          .onOk(() => {
            window.open(urlString, "_blank");
          })
          .onCancel(() => {
            window.open(urlString, "_blank");
          });
      } else {
        $q.dialog({
          component: EmailWarningBoundary,
        })
          .onOk(() => {
            $q.dialog({
              component: EmailWarning,
            })
              .onOk(() => {
                window.open(urlString, "_blank");
              })
              .onCancel(() => {
                window.open(urlString, "_blank");
              });
          })
          .onCancel(() => {
            // console.log(">>>> Cancel");
          });
      }
    },
  };
};

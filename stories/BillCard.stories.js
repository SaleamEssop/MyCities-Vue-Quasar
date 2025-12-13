import BillCard from "../src/components/ui/BillCard.vue";
import BadgeProvisional from "../src/components/ui/BadgeProvisional.vue";

export default {
  title: "UI/BillCard",
  component: BillCard,
  argTypes: {
    provisional: { control: "boolean" },
    period: { control: "text" },
    total: { control: "number" },
  },
};

const Template = (args) => ({
  components: { BillCard, BadgeProvisional },
  setup() {
    return { args };
  },
  template: `
    <BillCard v-bind="args">
      <template #meta>
        Account: 12345 • Water
      </template>
      <div class="text-body2">Line items go here</div>
    </BillCard>
  `,
});

export const Provisional = Template.bind({});
Provisional.args = {
  provisional: true,
  period: "2024-01-01 to 2024-01-31",
  total: 123.45,
};

export const Final = Template.bind({});
Final.args = {
  provisional: false,
  period: "2024-01-01 to 2024-01-31",
  total: 456.78,
};








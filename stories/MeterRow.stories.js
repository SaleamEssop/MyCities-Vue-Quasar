import MeterRow from "../src/components/ui/MeterRow.vue";

export default {
  title: "UI/MeterRow",
  component: MeterRow,
  argTypes: {
    title: { control: "text" },
    subtitle: { control: "text" },
    clickable: { control: "boolean" },
  },
};

const Template = (args) => ({
  components: { MeterRow },
  setup() {
    return { args };
  },
  template: `
    <MeterRow v-bind="args">
      <template #side>
        <q-badge color="primary" text-color="black">R 120.34</q-badge>
      </template>
    </MeterRow>
  `,
});

export const Default = Template.bind({});
Default.args = {
  title: "Main Meter",
  subtitle: "Water • 2024-01-01 to 2024-01-31",
  clickable: true,
};








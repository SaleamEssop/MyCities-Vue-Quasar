import ButtonPrimary from "../src/components/ui/ButtonPrimary.vue";

export default {
  title: "UI/ButtonPrimary",
  component: ButtonPrimary,
  argTypes: {
    label: { control: "text" },
    loading: { control: "boolean" },
    disable: { control: "boolean" },
    icon: { control: "text" },
  },
};

const Template = (args) => ({
  components: { ButtonPrimary },
  setup() {
    return { args };
  },
  template: '<ButtonPrimary v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  label: "Submit",
  loading: false,
  disable: false,
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  label: "Save",
  icon: "save",
};







import FormInput from "../src/components/ui/FormInput.vue";

export default {
  title: "UI/FormInput",
  component: FormInput,
  argTypes: {
    label: { control: "text" },
    type: { control: "text" },
    placeholder: { control: "text" },
    dense: { control: "boolean" },
    outlined: { control: "boolean" },
    error: { control: "boolean" },
    errorMessage: { control: "text" },
    modelValue: { control: "text" },
  },
};

const Template = (args) => ({
  components: { FormInput },
  setup() {
    return { args };
  },
  template: '<FormInput v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  label: "Account Name",
  placeholder: "Enter account name",
};

export const ErrorState = Template.bind({});
ErrorState.args = {
  label: "Account Name",
  placeholder: "Enter account name",
  error: true,
  errorMessage: "This field is required",
};







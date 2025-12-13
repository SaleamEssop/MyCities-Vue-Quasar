import ConfirmModal from "../src/components/ui/ConfirmModal.vue";

export default {
  title: "UI/ConfirmModal",
  component: ConfirmModal,
  argTypes: {
    modelValue: { control: "boolean" },
    title: { control: "text" },
    message: { control: "text" },
    confirmLabel: { control: "text" },
  },
};

const Template = (args) => ({
  components: { ConfirmModal },
  setup() {
    return { args };
  },
  template: '<ConfirmModal v-bind="args" />',
});

export const Default = Template.bind({});
Default.args = {
  modelValue: true,
  title: "Confirm action",
  message: "Are you sure you want to proceed?",
  confirmLabel: "Yes, do it",
};








<script>
import Form from "../components/Form.vue";
import { useUserStore } from "../stores/store";
export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {};
  },
  components: {
    Form,
  },
  // how to get value from child component

  methods: {
    handleInput(values) {
      this.userStore.register(values);
    },
  },
};
</script>

<template>
  <div class="background-gradient-color">
    <!-- <div>fd</div> -->
    <Form
      title="Register"
      linkTo="login"
      :isRegister="true"
      @getValueFromComponent="handleInput"
    />
  </div>
</template>

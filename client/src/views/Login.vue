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
      this.userStore.login(values);
    },
  },
};
</script>

<template>
  <div class="background-gradient-color">
    <!-- <div>fd</div> -->
    <Form
      title="Login"
      linkTo="register"
      :isRegister="false"
      @getValueFromComponent="handleInput"
    />
  </div>
</template>

<script>
import { useUserStore } from "../stores/store";
export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {
      name: "",
      email: "",
      password: "",
    };
  },
  props: {
    title: String,
    linkTo: String,
    isRegister: Boolean,
  },
  methods: {
    emitValue() {
      this.$emit("getValueFromComponent", {
        name: this.name,
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<template>
  <form class="form" @submit.prevent="emitValue">
    <div v-show="userStore.showSuccessMessage" class="success-message">
      operate successfully, redirect to other page...
    </div>
    <div class="title">
      <h3>{{ title }}</h3>
      <div class="underline"></div>
    </div>

    <div class="form-control">
      <label for="name" class="label">Name:</label>
      <input
        class="input"
        type="text"
        placeholder="name"
        id="name"
        v-model="name"
      />
      <small v-show="userStore.errorMessage?.name" class="danger-message">
        {{ userStore.errorMessage?.name }}
      </small>
    </div>
    <div v-show="isRegister" class="form-control">
      <label for="email" class="label">Email:</label>
      <input
        class="input"
        type="email"
        placeholder="email"
        id="email"
        v-model="email"
      />
      <small v-show="userStore.errorMessage?.email" class="danger-message">
        {{ userStore.errorMessage?.email }}
      </small>
    </div>
    <div class="form-control">
      <label for="password" class="label">password:</label>
      <input
        class="input"
        type="password"
        placeholder="password"
        id="password"
        v-model="password"
      />
      <small v-show="userStore.errorMessage?.password" class="danger-message">
        {{ userStore.errorMessage?.password }}
      </small>
    </div>
    <div class="form-control">
      <button v-if="userStore.loading" class="btn btn-block" type="submit">
        <div class="loading"></div>
      </button>
      <button v-else class="btn btn-block" type="submit">submit</button>
    </div>
    <p v-if="isRegister" class="form-info">
      Already have an account ?
      <router-link
        :to="{ name: linkTo }"
        @click="userStore.clearErrorMessage"
        >{{ linkTo }}</router-link
      >
    </p>
    <p v-else class="form-info">
      Not have an account ?
      <router-link
        :to="{ name: linkTo }"
        @click="userStore.clearErrorMessage"
        >{{ linkTo }}</router-link
      >
    </p>
  </form>
</template>

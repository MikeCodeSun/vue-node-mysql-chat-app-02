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
      hideNavLink: true,
      windowWidth: 0,
    };
  },
  methods: {
    showNavLink() {
      this.hideNavLink = !this.hideNavLink;
    },
    widthChangeHide() {
      if (window.innerWidth > 768) {
        this.hideNavLink = true;
      }
    },
  },

  mounted() {
    window.addEventListener("resize", this.widthChangeHide);
  },
  beforeUnmount() {
    window.removeEventListener("resize", this.widthChangeHide);
  },
  beforeCreate() {
    this.userStore.getUserProfile();
  },
};
</script>

<template>
  <nav v-if="userStore.user" class="nav">
    <div class="nav-center">
      <div class="nav-header">
        <div class="nav-logo">
          <router-link to="/">Home</router-link>
        </div>
        <button class="btn nav-btn" @click="showNavLink">
          <span v-if="hideNavLink">+</span>
          <span v-else>-</span>
        </button>
      </div>
      <ul
        v-if="userStore.user"
        class="nav-links"
        :class="{ 'hide-nav-links': hideNavLink }"
      >
        <li class="nav-link">
          <router-link class="link" :to="'/user/' + userStore.user.id">{{
            userStore.userProfile?.name
          }}</router-link>
        </li>
        <li class="nav-link">
          <router-link class="link" to="#" @click="userStore.logout"
            >Logout</router-link
          >
        </li>
      </ul>

      <ul v-else class="nav-links" :class="{ 'hide-nav-links': hideNavLink }">
        <li class="nav-link">
          <router-link class="link" to="/login">login</router-link>
        </li>
        <li class="nav-link">
          <router-link class="link" to="/register">register</router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
@import "../assets/navbar.css";
</style>

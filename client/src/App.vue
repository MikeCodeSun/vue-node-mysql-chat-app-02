<script>
import NavBar from "./components/NavBar.vue";
import { useUserStore } from "./stores/store";

export default {
  setup() {
    const userStore = useUserStore();
    return {
      userStore,
    };
  },
  data() {
    return {
      user: "fd",
    };
  },
  components: {
    NavBar,
  },
  mounted() {
    // console.log(this.userStore.user);
  },
  created() {
    this.userStore.getUserFromCookie();
  },
};
</script>

<template>
  <NavBar />
  <router-view></router-view>
</template>

<style scoped></style>

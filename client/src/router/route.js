import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import NotFound from "../views/NotFound.vue";
import User from "../views/User.vue";
import { useUserStore } from "../stores/store";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Home,
      name: "home",
    },
    {
      path: "/register",
      component: Register,
      name: "register",
    },
    {
      path: "/login",
      component: Login,
      name: "login",
    },
    {
      path: "/user/:id",
      component: User,
      name: "user",
    },
    { path: "/:pathMatch(.*)*", component: NotFound, name: "notFound" },
  ],
});

router.beforeEach((to) => {
  const userStore = useUserStore();
  if (userStore.user && (to.name === "login" || to.name === "register")) {
    return { name: "home" };
  }
  if (!userStore.user && to.name !== "login" && to.name !== "register")
    return { name: "login" };
});

export default router;

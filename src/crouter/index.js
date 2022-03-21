import Vue from "vue";

// import VueRouter from "vue-router";
import VueRouter from "./cvue-router";

import Home from "../views/Home.vue";

// 引入 VueRouter 插件，Vue 的 use 方法会调用插件提供的 install(该方法是插件必须提供的)
Vue.use(VueRouter);

// 路由映射表
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;

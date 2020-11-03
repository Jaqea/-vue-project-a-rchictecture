import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";
import store from "../store";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  base: "/",
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});
router.beforeEach((to, from, next) => {
  if (!to.meta.middleware) next();
  const { middleware } = to.meta;
  const context = {
    to,
    from,
    next,
    store,
  };
  if (middleware) middleware.forEach((middlewareItem) => middlewareItem(context));
});

router.afterEach(() => {
  window.scrollTo(0, 0);
});

export default router;

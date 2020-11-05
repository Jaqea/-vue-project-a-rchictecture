export default function guest({ next, store }) {
  if (store.getters.isLogin)
    return next({
      name: "Home",
    });

  return next();
}

export default function auth({ next, store }) {
  if (!store.getters.isLogin)
    return next({
      name: "login",
    });

  return next();
}

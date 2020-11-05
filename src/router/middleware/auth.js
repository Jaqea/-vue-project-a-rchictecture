export default function auth({ next, store }) {
  if (!store.getters.isLogin)
    return next({
      name: "Login",
    });

  return next();
}

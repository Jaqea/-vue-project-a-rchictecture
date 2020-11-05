import { guest, auth, demo } from "../middleware";

function load(component) {
  return (resolve) => require([`views/${component}/${component}`], resolve);
}

const routes = [
  {
    path: "/",
    name: "Home",
    component: load("Home"),
    meta: {
      middleware: [auth, demo],
    },
  },
  {
    path: "/login",
    name: "Login",
    component: load("Login"),
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: load("NotFound"),
  },
  {
    path: "*",
    redirect: {
      name: "Home",
    },
  },
];

export default routes;

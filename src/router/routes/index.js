import { guest, auth, demo } from "../middleware";

function load(component) {
  return (resolve) => require([`views/${component}/${component}`], resolve);
}

const routes = [
  {
    path: "/",
    name: "home",
    component: load("home"),
    meta: {
      middleware: [auth, demo],
    },
  },
  {
    path: "/login",
    name: "login",
    component: load("login"),
    meta: {
      middleware: [guest],
    },
  },
  {
    path: "/404",
    name: "notFound",
    component: load("notFound"),
  },
  {
    path: "*",
    redirect: {
      name: "home",
    },
  },
];

export default routes;

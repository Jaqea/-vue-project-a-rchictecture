import { demo } from "api/modules";

const actions = {
  getData(context) {
    demo.getData().then((res) => {
      context.commit("getData", res.data);
    });
  },
};

export default actions;

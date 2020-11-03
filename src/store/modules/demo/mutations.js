const mutations = {
  getData(state, payload) {
    console.log(payload);
    state.demo = payload;
  },
};

export default mutations;

<template>
  <div id="app">
    <router-view />
    <loading v-show="isRequest" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    loading: (resolve) => require(["components/loading/loading"], resolve),
  },
  computed: {
    ...mapGetters(["isRequest"]),
  },
};
</script>

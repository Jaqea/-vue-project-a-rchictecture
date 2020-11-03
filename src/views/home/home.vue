<template>
  <h1>
    首页
    <p>userId：{{ demo.userId }}</p>
    <p>title：{{ demo.title }}</p>
    <p>body：{{ demo.body }}</p>
    <a-button @click="getData" type="primary"> 点击获取数据asd </a-button>
  </h1>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { Button } from "ant-design-vue";

export default {
  name: "home",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["demo"]),
  },
  methods: {
    ...mapActions(["getData"]),
  },
  components: { "a-button": Button },
};
</script>

<style lang="less" scoped>
@import "./home";
</style>

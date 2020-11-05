<template>
  <a-spin size="large" :spinning="isRequest" tip="Loading..."> </a-spin>
</template>

<script>
import { Spin } from "ant-design-vue";
import { mapGetters } from "vuex";

export default {
  name: "Loading",
  computed: {
    ...mapGetters(["isRequest"]),
  },
  components: {
    "a-spin": Spin,
  },
};
</script>

<style lang="less" scoped>
.ant-spin {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10%;
  background-color: #fff;
  opacity: 0.7;
}
</style>

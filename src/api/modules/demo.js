import service from "@/utils/http";

const demo = {
  getData() {
    return service.get("/posts/1");
  },
  // ...其它
};

export default demo;

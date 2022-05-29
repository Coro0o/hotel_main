<template>
  <div class="top-right">
    <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" background-color="#8076a3" text-color="#fff" active-text-color="#ffd04b">
      <el-submenu index="1">
        <template slot="title">
          位置</template>
        <el-menu-item>当前ip地址为:{{ip}}</el-menu-item>
      </el-submenu>
      <el-submenu index="5">
        <template slot="title"><i class="el-icon-user-solid"></i>
          {{adminname}}</template>
        <el-menu-item @click="loginout">退出系统</el-menu-item>
      </el-submenu>
    </el-menu>

  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
export default {
  name: "",
  props: {},
  data () {
    return {
      ip: '',
      activeIndex: "1",
      activeIndex2: "1",
      adminname: ''
    };
  },
  created () {
    //记住用户名模块
    let name = sessionStorage.getItem("name");
    this.adminname = name
    this.getip()
    // this.getcity()
  },
  computed: {
    //获取user下面的admin
    // ...mapState("user", ["admin"]),
  },
  methods: {
    //获取ip地址
    getip () {
      this.$get('http://ip-api.com/json/')
        .then((res) => {
          this.ip = res.query
          console.log(res.query);
        }).catch((err) => {
          console.log(err);
        })
    },
    loginout () {
      this.$confirm("此操作将退出系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.sessionStorage.clear();
          this.$router.push("login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
  },
};
</script>
<style scoped>
.right .top-right {
  float: right;
  margin-right: 50px;
}
</style>
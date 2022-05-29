<template>
  <div>
    <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#8076a3" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" router>
      <div class="tltle">
        <span>酒店管理系统</span>
      </div>
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>账号管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/admin">账号管理</el-menu-item>
          <!-- <el-menu-item index="/home/Rolelist">角色管理</el-menu-item> -->
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>客房管理</span>
        </template>
        <el-menu-item-group>
          <!-- <el-menu-item index="/home/roomtype">类型管理</el-menu-item> -->
          <el-menu-item index="/home/room">客房管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>客户管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/guest">客户管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-user-solid"></i>
          <span>个人中心</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/home/changepwd">修改密码</el-menu-item>
          <el-menu-item index="/home/person">修改个人信息</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: "",
  props: {},
  data () {
    return {
      isCollapse: false,
    };
  },
};
</script>
<style scoped>
.tltle {
  padding: 15px;
  height: 30px;
  border-bottom: 1px solid #eee;
  text-align: center;
  line-height: 30px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}
</style>
<template>
  <div>
    <div class="login">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input type="string" v-model="ruleForm.username" ref="input"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="ruleForm.password" show-password></el-input>
        </el-form-item>
        <!-- <el-form-item label="" prop="checkme">
          <el-checkbox v-model="ruleForm.checkme">记住我</el-checkbox>
        </el-form-item> -->
        <el-form-item>
          <div class="contain">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="GetResgister">注册</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import throttle from "../../utils/throttle";
export default {
  data () {
    return {
      //数据绑定的表单对象，用户名和密码
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    //登录
    login: throttle(function () {
      this.submitForm()
    }, 3000),
    //登录方法
    submitForm () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.$post("/login", this.ruleForm).then((data) => {
          if (data.status !== 0) {
            return this.$message.warning(data.message);
          }
          window.sessionStorage.setItem("name", this.ruleForm.username);
          window.sessionStorage.setItem("token", data.token);
          this.$router.push("/home");
        });
      });
    },
    //重置方法
    //首先refs获取表单对象ruleForm，resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    resetForm () {
      this.$refs.ruleForm.resetFields();
    },
    //注册方法
    GetResgister () {
      this.$router.replace({ path: "/resgister" });
      // this.$router.replace{path:"/resgister"};
      console.log("注册");
    },
  },
  //渲染结束时用户名input项获取焦点
  mounted () {
    this.$refs.input.focus();
  },
};
</script>

<style lang="less" scoped>
.login {
  position: absolute;
  width: 350px;
  height: 200px;
  top: 50%;
  left: 50%;
  padding: 40px 40px 70px 10px;
  box-shadow: 0 3px 13px 0 rgba(0, 0, 0, 0.2);
  transform: translate(-60%, -50%);
  z-index: 99999;
}
.contain {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 30px;
}
</style>
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
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="ruleForm.checkPass" show-password></el-input>
        </el-form-item>
        <el-form-item label="验证码">
          <el-col :span="12" prop="yzm">
            <el-input v-model="yzm" placeholder="请输入验证码" maxlength="4"></el-input>
          </el-col>
          <el-col :span="4">
            <div class=" get-code" @click="refreshCode()">
              <s-identify :identifyCode="identifyCode"></s-identify>
            </div>
          </el-col>
        </el-form-item>
        <el-form-item>
          <div class="contain">
            <el-button type="primary" @click="resgister">提交</el-button>
            <el-button type="primary" @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click="getback">返回</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import SIdentify from "../SIdentify/SIdentify.vue";
export default {
  components: { SIdentify },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      yzm: '',
      identifyCode: "",
      identifyCodes: "qwerdf1234",//绘制的随机数
      //数据绑定的表单对象，用户名和密码
      ruleForm: {
        username: "",
        password: "",
        checkPass: "",
      },
      rules: {
        //验证用户名是否合法
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: "长度在5到 12 个字符", trigger: "blur" },
        ],
        yzm: [
          { required: true, message: "请输入验证码", trigger: "blur" }
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
        checkPass: [{ validator: validatePass2, trigger: "blur" }],
      },
    };
  },
  created () { this.refreshCode() },
  methods: {
    //验证码
    refreshCode () {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    randomNum (min, max) {
      max = max + 1
      return Math.floor(Math.random() * (max - min) + min)
    },
    // 随机生成验证码字符串
    makeCode (data, len) {
      for (let i = 0; i < len; i++) {
        this.identifyCode += data[this.randomNum(0, data.length - 1)]
      }
    },
    //重置方法
    //首先refs获取表单对象ruleForm，resetFields对整个表单进行重置，将所有字段值重置为初始值并移除校验结果
    resetForm () {
      console.log(this);
      this.$refs.ruleForm.resetFields();
    },
    //注册方法
    resgister () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return
        } else if (this.yzm.toLowerCase() !== this.identifyCode) {
          this.$message.error('验证码错误');
          return;
        }
        this.$post("/resgister", this.ruleForm)
          .then((data) => {
            if (data.status !== 0) {
              this.$message.error(data.message);
            } else {
              this.$message.success(data.message);
              this.$router.push("/login");
            }
          });
      });
    },
    getback () {
      this.$router.replace({ path: "/login" });
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
  height: 300px;
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
}
.el-row {
  margin-bottom: 0px;
  &:last-child {
    margin-bottom: 0;
  }
  padding: 0;
}
</style>
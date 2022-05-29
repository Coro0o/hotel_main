<template>
  <div class="modify">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="旧密码" prop="oldPwd">
        <el-input type="password" v-model="ruleForm.oldPwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPwd">
        <el-input type="password" v-model="ruleForm.newPwd" show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="ruleForm.checkPass" show-password></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  inject: ['reload'],
  name: "",
  props: {},
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
      } else if (value !== this.ruleForm.newPwd) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        oldPwd: "",
        newPwd: "",
        checkPass: "",
      },
      rules: {
        //验证用户名是否合法
        oldPwd: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 12, message: "长度在6到 12 个字符", trigger: "blur" },
        ],
        //验证密码是否合法
        newPwd: [
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
  computed: {
    //获取user下面的admin
    ...mapState("user", ["admin"]),
  },
  methods: {
    //修改
    submitForm () {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) return;
        this.$post("/my/updatepwd", this.ruleForm).then((data) => {
          if (data.status !== 0) {
            return this.$message.error(data.message);
          }
          this.$message.success(data.message + "请重新登录");
          window.sessionStorage.clear();
          this.$router.push("login");
        });
      });
    },
    //重置方法
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>
<style scoped>
.modify {
  position: absolute;
  width: 35%;
  top: 50%;
  left: 50%;
  padding: 40px 40px 40px 10px;
  border: 1px solid #eee;
  transform: translate(-50%, -50%);
}
</style>

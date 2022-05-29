<template>

  <el-card class="card" shadow="never" v-loading="loading">
    <el-form ref="form" :rules="rules" :model="userinfo" label-width="80px">
      <el-form-item label="账号">
        <el-input v-model="userinfo.username" :disabled="true" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="nickname">
        <el-input v-model="userinfo.nickname" maxlength="10" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="userinfo.email" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model.lazy="userinfo.phone" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item class="mtop">
        <el-button @click="sendfrom" type="primary">提交</el-button>
      </el-form-item>
    </el-form>

  </el-card>

</template>

<script>
import throttle from "../../utils/throttle";
export default {
  inject: ['reload'],

  data () {
    return {
      userinfo: {
        nickname: "",
        email: "",
        phone: "",
      },
      oldlist: {},
      loading: false,
      id: "",
      //验证规则
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/,
            message: "请输入合法手机号/电话号",
            trigger: "blur",
          },
        ],
        nickname: [{ message: "请输入姓名", trigger: "blur" }],
        email: [
          { message: "请输入邮箱地址", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  created () {
    this.getperson();
  },
  methods: {
    sendfrom: throttle(function () {
      this.send()
    }, 3000),
    getperson () {
      this.$get("/my/GetOne").then((res) => {
        if (res.status !== 0) {
          this.$message.error(res.message);
        } else {
          // this.userinfo = res.data;
          this.userinfo = JSON.parse(JSON.stringify(res.data));
          this.oldlist = res.data;
        }
      });
    },
    //上传功能
    send () {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        if (JSON.stringify(this.oldlist) === JSON.stringify(this.userinfo))
          return this.$message.error("请修改后再提交");
        this.$post("/my/updateUserInfo", this.userinfo).then((data) => {
          if (data.status == 0) {
            try {
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                this.$message.success(data.message);
                this.reload()
              }, 1000);
            } catch (error) {
              this.$message.error(error.message);
            }
          }
        });
      });
    },
  }
};
</script>

<style scoped>
.card {
  position: absolute;
  width: 35%;
  top: 50%;
  left: 50%;
  padding: 40px 40px 40px 10px;
  border: 1px solid #eee;
  transform: translate(-50%, -50%);
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.mtop {
  margin-top: 50px;
}
</style>
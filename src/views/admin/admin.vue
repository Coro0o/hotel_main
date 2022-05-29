<template>
  <div>
    <div class="searcher">

      <!-- <div class="add">
        <el-button type="primary" size="mini">搜索</el-button>
        <el-button type="primary" size="mini">添加</el-button>
        <el-button type="primary" size="mini">导出Excel</el-button>
      </div> -->

    </div>
    <el-table :data="userlist" border stripe>
      <el-table-column type="index" :index="indexMethod" width="100">
      </el-table-column>
      <el-table-column prop="username" label="账号" width="200">
      </el-table-column>
      <el-table-column prop="nickname" label="姓名" width="200">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="200">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="200">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :disabled='getPromiss' type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 抽屉 -->
  </div>
</template>
<script>
import throttle from "../../utils/throttle";
// import { createLogger } from 'vuex';
export default {
  inject: ['reload'],
  name: "",
  props: {},
  data () {
    return {
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      drawer: false,
      userlist: [],
      imageUrl: "",
    };
  },
  created () {
    this.getadmin();
  },
  computed: {
    getPromiss () {
      let str = window.sessionStorage.getItem("name");
      return str === "admin" ? false : true;
    },
  },
  methods: {
    getadmin () {
      this.$get("/my/getadmin").then((data) => {
        this.userlist = data;
        this.imageUrl = data.user_pic;
      });
    },

    indexMethod (index) {
      return index + 1;
    },
    //更换图像
    handleEdit (a, b) {
      this.drawer = true;
    },
    //抽屉
    handleClose (done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },
    //删除用户
    async dele (a) {
      if (a.id === 51) {
        this.$message.error('管理员用户不可删除')
      } else {
        const confirmres = await this.$confirm(
          "此操作将删除该用户, 是否继续?",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).catch((err) => err);
        if (confirmres !== "confirm") {
          return this.$message.info("用户取消了该操作");
        }
        this.$get("/my/deleadmin/" + a.id)
          .then((data) => {
            data.status === 0;
            this.$message.success(data.message);
            this.reload()
          })
          .catch((err) => {
            this.$message.info(err.message);
          })
      }

    },
    handleDelete:
      throttle(function (a) {
        this.dele(a)
      }, 3000),
  }
};
</script>
<style scoped>
.searcher {
  width: 100%;
  padding: 20px 0;
  display: flex;
  align-content: center;
}

.add {
  margin-left: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
}

.page {
  display: flex;
  align-content: center;
  justify-content: center;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  margin-left: 20px;
}

.avatar-uploader :hover {
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
</style>
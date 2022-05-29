<template>
  <div>
    <!-- 上面的功能模块 -->
    <div class="searcher">
      <!-- 类型搜索框 -->
      <div class="search">
        <span style="padding: 10px;">类型:</span>
        <el-select v-model="typevalue" size="medium" clearable placeholder="请选择类型">
          <el-option v-for="item in getfiltypelist" :key="item.index" :label="item.h_type" :value="item.h_type">
          </el-option>
        </el-select>
      </div>
      <div class="add">
        <el-button type="primary" :disabled='getPromiss' size="mini" @click="getdialog">添加</el-button>
      </div>
    </div>
    <!-- 表格模块 -->
    <!-- slici(1,10),截取10行 -->
    <el-table :data="filtype.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" border stripe>
      <el-table-column type="index" :index="indexMethod" width="100">
      </el-table-column>
      <el-table-column prop="h_type" label="房间类型" width="280">
      </el-table-column>
      <el-table-column prop="price" label="房间价格" sortable width="180">
        <template slot-scope="scope">
          ￥ {{scope.row.price|addfuhao}}
        </template>
      </el-table-column>
      <el-table-column prop="num" label="可住人数" width="180">
      </el-table-column>
      <el-table-column prop="text" label="注释" width="280">
        <!-- <template slot-scope="scope">
          <el-tag>{{scope.row.text}}</el-tag>
        </template> -->
      </el-table-column>
      <el-table-column prop="state" label="状态" width="180">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state==='空房'?'success' : 'danger'">{{scope.row.state}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="homenum" label="剩余数量" width="180">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :disabled='getPromiss' @click="handleEdit(scope.row,list.price)">编辑</el-button>
          <el-button size="mini" :disabled='getPromiss' type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[6, 8, 10]" :page-size="pageSize" layout="total,  prev, pager, next, jumper" :total="gettotal" class="page">
    </el-pagination>
    <!-- 添加模块，抽屉 -->
    <el-drawer title="添加 " :before-close="handleClose" :visible.sync="drawer" direction="rtl" size="40%">
      <el-form :model="addform" label-width="100px" :rules="dilogrules" ref="form">
        <!-- 价格 -->
        <el-form-item label="价格" prop="price">
          <el-input v-model.number="addform.price" clearable style="width:300px"></el-input>
        </el-form-item>
        <!-- 可住人数 -->
        <el-form-item label="可住人数" prop="num">
          <el-input v-model.number="addform.num" clearable style="width:300px"></el-input>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" prop="state">
          <el-input v-model.trim="addform.state" clearable style="width:300px"></el-input>
        </el-form-item>
        <!-- 类型 -->
        <el-form-item label="房间类型" prop="h_type">
          <el-input v-model.trim="addform.h_type" clearable style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="房间剩余数量" prop="homenum">
          <el-input v-model.trim="addform.homenum" clearable style="width:300px"></el-input>
        </el-form-item>
        <!-- 注释 -->
        <el-form-item label="注释" prop="text">
          <el-input type="textarea" v-model="addform.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="send">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
    <!-- 更新 -->
    <el-dialog title="编辑数据" :visible.sync="dialogFormVisible" :before-close="handleClose">
      <el-form :model="editdata" :rules="dilogrules" ref="editdata" label-width="100px" class="demo-ruleForm" v-loading='loading'>
        <el-form-item label="房间类型" prop="h_type">
          <el-input v-model="editdata.h_type"></el-input>
        </el-form-item>
        <el-form-item label="房间价格" prop="price">
          <el-input v-model.number="editdata.price"></el-input>
        </el-form-item>
        <el-form-item label="可住人数" prop="num">
          <el-input v-model.number="editdata.num"></el-input>
        </el-form-item>
        <el-form-item label="注释">
          <el-input v-model="editdata.text"></el-input>
        </el-form-item>
        <el-form-item label="房间剩余数量">
          <el-input v-model="editdata.homenum"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-input v-model="editdata.state"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changedislog">立即修改</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import getPromiss from "../../utils/promiss";
export default {
  inject: ['reload'],
  data () {
    //规则
    return {
      //抽屉数据
      // filtypelist: '',
      loading: false,
      drawer: false,
      dialogVisible: false,
      dialogFormVisible: false,
      formLabelWidth: "120px",
      editdata: {},
      form: {
        drwtypeva: "",
        drwprice: "",
        drwnum: "",
        drwtextarea: "",
        drwtextstate: "",
        drwhomenum: ''
      },
      addform: {
        price: '',
        h_type: '',
        num: '',
        text: '',
        homenum: '',
        state: ''
      },
      rules: {
        drwtypeva: [{ required: true, message: "必须给我填", trigger: "blur" }],
        drwprice: [
          { type: "number", required: true, message: "价格必须为数字值" },
        ],
        drwnum: [
          { required: true, message: "年龄不能为空" },
          { type: "number", message: "人数必须为数字值" },
        ],
        drwtextarea: [
          { message: "必须给我填", trigger: "blur" },
        ],
        drwtextstate: [
          { required: true, message: "必须给我填", trigger: "blur" },
        ],
      },
      dilogrules: {
        h_type: [{ required: true, message: "不可以为空" }],
        price: [{ required: true, type: "number", message: "必须为数字值" }],
        num: [{ required: true, type: "number", message: "必须为数字值" }]
      },
      //下拉框数据
      typevalue: "",
      statevalue: "",
      //表格主体数据
      list: [],
      editdata: [],
      statelist: [],
      typelist: [],
      //分页器数据
      currentPage: 1, // 当前页码
      total: null, // 总条数
      pageSize: 10, // 每页的数据条数
      //权限
    };
  },
  //加载完调用获取数据的函数getAll
  created () {
    this.getAll();
  },
  computed: {
    //权限管理
    getPromiss () {
      let str = window.sessionStorage.getItem("name");
      return str === "admin" ? false : true;
    },
    //过滤列表
    getfiltypelist () {
      return (this.typelist = this.list.filter(
        (v, index) =>
          index === this.list.findIndex((y) => y.h_type === v.h_type)
      ));
    },
    //搜索功能
    filtype () {
      var typevalue = this.typevalue;
      if (typevalue) {
        this.currentPage = 1;
        return this.list.filter(function (dataNews) {
          return Object.keys(dataNews).some(function (key) {
            return String(dataNews[key]).toLowerCase().indexOf(typevalue) > -1;
          });
        });
      }
      return this.list;
    },
    //搜索后获取结果的总数
    gettotal () {
      return this.filtype.length;
    },
    //序列加1
  },
  methods: {
    indexMethod (index) {
      return index + 1;
    },
    //获取的数据去重
    getAll () {
      this.$get("/my/getAll").then((data) => {
        this.list = data;
      });
    },
    //重置验证规则
    resetForm () {
      this.$refs.form.resetFields();
    },
    handleEdit (data) {
      this.dialogFormVisible = true;
      //data就是当前行的数据 拷贝一下
      this.editdata = JSON.parse(JSON.stringify(data))
    },
    //删除房间操作
    async handleDelete (index, row) {
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
      this.$get("/my/dele/" + row.id)
        .then((data) => {
          data.status === 0;
          this.$message.success(data.message);
          this.reload()
        })
        .catch((err) => {
          this.$message.warning(err.message);
        });
    },
    //分页功能
    handleSizeChange (val) {
      this.pageSize = val;
    },
    handleCurrentChange (val) {
      this.currentPage = val;
    },
    //抽屉
    handleClose (done) {
      this.$confirm("还有未保存的工作哦确定关闭吗？")
        .then((_) => {
          done();
        })
        .catch((_) => { });
    },
    cancelForm () {
      this.loading = false;
    },
    getdialog () {
      this.drawer = true;
    },
    //添加功能
    send () {
      this.$refs.form.validate((valid) => {
        if (!valid) return;
        this.$post("/my/addhome", this.addform)
          .then((data) => {
            this.$message.success(data.message);
            this.resetForm();
            this.drawer = false;
            this.reload()
          })
          .catch(() => {
            this.$message.warning(data.message);
          });
      });
    },
    //关闭编辑页面
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => { });
    },
    //刷新
    //编辑功能
    changedislog () {
      this.$refs.editdata.validate((valid) => {
        this.$post("/my/updateRoomInfo", this.editdata).then((data) => {
          if (!valid) return
          if (data.status == 0) {
            try {
              this.loading = true;
              setTimeout(() => {
                this.loading = false;
                this.$message.success(data.message);
                this.dialogFormVisible = false
                this.reload()
              }, 300);
            } catch (error) {
              this.$message.error(error.message);
            }
          }
        })
      })
    },
  },
  filters: {
    addfuhao: function (value) {
      let really = value.toFixed(2)
      return really

    }
  }
}
</script>
<style scoped>
.add {
  margin-left: 10px;
  display: flex;
  align-content: center;
  justify-content: center;
}
.searcher {
  width: 100%;
  padding: 20px 0;
  display: flex;
  align-content: center;
}
.page {
  display: flex;
  margin-top: 100px;
  align-content: center;
  justify-content: center;
}
.title {
  font-weight: bold;
}
.desc {
  margin: 10px 0;
  border-bottom: 1px dashed #eee;
  padding-bottom: 10px;
}
</style>
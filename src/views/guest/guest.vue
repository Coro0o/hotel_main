<template>
  <div>
    <!-- 上面的功能模块 -->
    <div class="searcher">
      <!-- 类型搜索框 -->
      <div class="search">
        <el-input v-model="uname" size="medium" clearable placeholder="请输入姓名进行搜索">
        </el-input>
      </div>
      <div class="add">
        <el-button type="primary" :disabled='getPromiss' size="mini" @click="getdialog">添加信息</el-button>
      </div>
    </div>
    <!-- 表格模块 -->
    <!-- slici(1,10),截取10行 -->
    <el-table :data="filtable.slice((currentPage-1)*pageSize,currentPage*pageSize)" style="width: 100%" border stripe v-loading="loading">
      <el-table-column type="index" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="phone" label="电话" width="180">
      </el-table-column>
      <el-table-column prop="card" label="身份证" width="280">
        <template slot-scope="scope">
          <div class="flexbox">
            <span v-if='scope.row.isShow'>{{scope.row.card }}</span>
            <span v-else>{{scope.row.card | filtercard}}</span>
            <span><i class="el-icon-view" @click="show(scope.row)"></i></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="h_type" label="住房类型" width="180">
      </el-table-column>
      <el-table-column prop="enterTime" label="入住时间" width="180">
      </el-table-column>
      <el-table-column prop="exitTime" label="离开时间" width="180">
      </el-table-column>
      <el-table-column prop="text" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.text==='完成'?'success' : 'danger'">{{scope.row.text}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="金额" width="180">
        <template slot-scope="scope">
          ￥ {{scope.row.num}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" :disabled='getPromiss' @click="finish(scope.row)">完成 </el-button>
          <el-button size="mini" :disabled='getPromiss' type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="gettotal" class="page">
    </el-pagination>
    <!-- 添加模块，抽屉 -->
    <el-drawer title="添加信息" :before-close="handleClose" :visible.sync="drawer" direction="rtl" size="40%">
      <el-form :model="form" label-width="100px" ref="form" :rules="rules">
        <el-form-item label="姓名">
          <el-input v-model.number="form.name" clearable style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio v-model="form.sex" label="男">男</el-radio>
          <el-radio v-model="form.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model.number="form.phone" clearable style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="身份证" prop="card">
          <el-input v-model="form.card" clearable style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.h_type" clearable placeholder="请选择类型" @change='getName'>
            <el-option v-for=" item in typelist" :key="item.id" :label="item.h_type" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="num" :rules="[ 
      { required: true, message: '价格不能为空'},
      { type: 'number', message: '价格必须为数字值'}
    ]">
          <el-input v-model.number="form.num" clearable style="width:300px"></el-input>
        </el-form-item>
        <!-- 入住时间 -->
        <el-form-item label="入住时间" required>
          <el-date-picker v-model="form.enterTime" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <!-- 注释 -->
        <el-form-item label="状态">
          <el-input type="textarea" v-model="form.text"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="send">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  inject: ['reload'],
  data () {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('手机号不能为空'));
      } else {
        const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
        console.log(reg.test(value));
        if (reg.test(value)) {
          callback();
        } else {
          return callback(new Error('请输入正确的手机号'));
        }
      }
    };
    const checkIDCard = (rule, value, callback) => {
      const IDCardReg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(([0-2][1-9])|10|20|30|31)\d{3}(\d|X|x)$/
      if (value) {
        if (IDCardReg.test(value)) {
          callback()
        } else {
          callback(new Error('身份证号格式不正确'))
        }
      } else {
        callback(new Error('请输入身份证号'))
      }
    }
    return {
      Form: {
        phone: '',
        card: '',
      },
      rules: {
        phone: [
          { validator: checkPhone, trigger: 'blur', required: true, }
        ],
        card: [
          { validator: checkIDCard, trigger: 'blur', required: true, },
          {
            message: "身份证号码为十八位数字",
            trigger: "blur",
          },
        ]
      },
      typelist: '',
      //取消重复请求
      path: '',
      card: false,
      loading: false,
      drawer: false,
      id: "",
      exitTime: "",
      form: {
        name: '',
        phone: "",
        card: '',
        h_type: '',
        enterTime: '',
        sex: '男',
        num: '',
      },
      homeid: '',
      cardid: '',
      //表格数据
      list: [],
      //搜索功能所用的值
      uname: "",
      currentPage: 1, // 当前页码
      total: null, // 总条数
      pageSize: 10, // 每页的数据条数

    };
  },
  //加载完调用获取数据的函数getAll
  created () {
    this.getType();
    // this.filtercar()
  },
  mounted () {
    this.getguest()

  },
  computed: {
    //权限
    getPromiss () {
      let str = window.sessionStorage.getItem("name");
      return str === "admin" ? false : true;
    },
    filtable () {
      return this.list.filter((p) => {
        return p.name.indexOf(this.uname) !== -1;
      });
    },
    gettotal () {
      return this.filtable.length;
    },
  },
  methods: {
    getName (val) {
      this.form.h_type = val.h_type
      this.form.id = val.id
    },
    //切换身份证显示隐藏
    show (el) {

      el.isShow = !el.isShow;
      el.name = el.name + ' '
    },

    // filtercar () {
    //   console.log(this.list);
    // },
    //获取数据
    getguest () {
      this.$get("/my/getguest").then((data) => {
        this.list = data;
        this.list.map((i) => {
          i.isShow = false
        })
        //获取总数量
        this.total = this.list.length;
      });
    },
    //获取去重后的房间类型
    getType () {
      this.$get("/my/getType").then((data) => {
        this.typelist = data;
      });
    },
    //删除用户
    async handleDelete (index, row) {
      console.log(index, row.id);
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
      const id = row.id;
      this.$get("/my/delegu/" + id).then((data) => {
        if (data.status === 0) {
          this.drawer = false;
          this.loading = true;
          setTimeout(() => {
            this.loading = false;
            this.$message.success('成功');
            this.reload()
          }, 500);
        } else {
          this.$message.warning("错误");
        }
      });
    },
    //表格数据的编号
    indexMethod (index) {
      return index + 1;
    },
    //分页功能
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.currentPage = 6;
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
    getdialog () {
      this.drawer = true;
    },
    //添加数据
    send () {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return
        let id = this.form.id
        this.$get("/my/lessone/" + id).then((res) => {
          if (res.status === 0) {
            this.$post("/my/addguest", this.form).then(() => {
              if (res.status === 0) {
                this.$message.success('成功');
                this.reload()
              }
              else {
                this.$message.error('失败了');
              }
            })
          } else {
            this.$message.error('检查库存');
          }
        }).catch(() => {
          console.log('错误');
        })
      })
    },
    finish (e) {
      var date = new Date();
      const longDataToStr = (longTypeDate) => {
        var date = new Date(longTypeDate)
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var h = date.getHours()
        h = h < 10 ? ('0' + h) : h
        var minute = date.getMinutes()
        var second = date.getSeconds()
        minute = minute < 10 ? ('0' + minute) : minute
        second = second < 10 ? ('0' + second) : second
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second
      }
      this.$confirm('确定完成订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cardid = e.id
        const data = {
          id: this.cardid,
          exitTime: longDataToStr(date),
          h_type: e.h_type
        }
        console.log(data);
        if (e.text === '完成') {
          this.$message.info('请勿重复操作')
        } else {
          this.$post('/my/finish', data).then((data) => {
            if (data.status === 0) {
              this.$message.success('成功了')
              this.reload()
            }
          }).catch((error) => {
            this.$message.error('错误')
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });
      });
    },
  },
  filters: {
    filtercard: function (value) {
      return value.slice(0, 15) + '****'
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
.flexbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flexbox i {
  padding-right: 10px;
}
.flexbox i:hover {
  cursor: pointer;
}
</style>
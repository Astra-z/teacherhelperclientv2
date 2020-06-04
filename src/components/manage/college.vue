<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>学院列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <!--2.搜索框-->
    <label>学院名：</label>
    <el-input class="input_text"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="query">
      <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
    </el-input>
    <el-button type="success" plain @click="openInsertcollegeForm()">添加</el-button>
    <!--3.表格-->
    <el-table
      :data="collegeList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="40">
      </el-table-column>
      <el-table-column
        prop="collegeName"
        label="学院名"
        width="200">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="collegeList">
          <el-button size="mini"
                     @click="openUpdatecollegeForm(collegeList.row)"
                     :plain="true" type="primary" icon="el-icon-edit" circle>
          </el-button>
          <el-button size="mini"
                     @click="openDeletecollegeForm(collegeList.row.collegeId)"
                     :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--4.分页-->
    <el-pagination style="text-align: center"
                   background
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>

    <!--添加学院对话框-->
    <el-dialog title="添加学院" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="学院名" :label-width="formLabelWidth">
          <el-input v-model="insertform.collegeName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertcollege()">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除对话框-->
    <el-dialog
      title="提示"
      :visible.sync="deletedialogFormVisible"
      width="30%">
      <span>是否删除此项？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="deletedialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="deletecollegeForm()">确 定</el-button>
    </span>
    </el-dialog>

    <!--更新学院对话框-->
    <el-dialog title="更新学院" :visible.sync="updatedialogFormVisible">
      <el-form :model="updateform">
        <el-form-item label="学院名" :label-width="formLabelWidth">
          <el-input v-model="updateform.collegeName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatecollege()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: "college",
    data() {
      return {
        query: "",
        fieldName: "",
        //用户列表
        collegeList: [],
        total: -1,
        pagenum: 1,
        pagesize: 100,

        //对话框属性
        updatedialogFormVisible: false,
        insertdialogFormVisible: false,
        deletedialogFormVisible: false,
        formLabelWidth: '120px',
        insertform: {},
        updateform: {},
        deleteId:-1,
        menudata: [],
        //树默认选中节点
        defaultcheckList:[],
      }
    },
    created() {
      this.getcollegeList();
    },
    methods: {
      //获取college列表
      async getcollegeList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        const res = await this.$http
          .get(`colleges/?page=${this.pagenum}&limit=${this.pagesize}`)
        console.log(res)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.collegeList = data;
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
      },
      //打开添加college对话框
      async openInsertcollegeForm() {
        this.insertdialogFormVisible = true;
      },
      //添加college
      async insertcollege() {
        this.insertdialogFormVisible = false;
        const res = await this.$http.post('colleges/', this.insertform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("添加成功!")
          this.getcollegeList();
          this.insertform = {}
        }
        else {
          this.$message.error("添加失败!")
        }
        this.getcollegeList()
      },
      //打开更新对话框
      async openUpdatecollegeForm(college) {
        this.updatedialogFormVisible = true;
        //选中的menus传到对话框
        this.updateform = college;
      },
      //更新college
      async updatecollege() {
        this.updatedialogFormVisible = false;
        const res = await this.$http.patch('colleges/'+this.updateform.collegeId, this.updateform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getcollegeList();
          this.updateform = {}
        }
        else {
          this.$message.error("更新失败!")
        }
      },
      async openDeletecollegeForm(Id) {
        this.deletedialogFormVisible = true;
        this.deleteId=Id
        console.log(this.deleteId)
      },
      async deletecollegeForm(Id) {
        this.deletedialogFormVisible = false;
        const res = await this.$http.delete('colleges/'+this.deleteId)
        this.deleteId=-1;
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getcollegeList();
          this.updateform = {}
        }
        else {
          this.$message.error("更新失败!")
        }
      },
      //复选框单选（待做）
      checkGroupNode() {
      }
    }
  }
</script>

<style scoped>
  .box-card {
    height: 100%;
  }

  .input_text {
    width: 300px;
  }

  label {
    font-size: 15px;
  }

  /*.input_text .input_button{*/
  /*width: 70%;*/
  /*height: 50px;*/
  /*}*/
</style>

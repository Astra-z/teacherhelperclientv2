<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>学生列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <!--2.搜索框-->
    <label>学生名：</label>
    <el-input class="input_text"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="query">
      <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
    </el-input>
    <el-button type="success" plain @click="openInsertStudentForm()">添加</el-button>
    <el-button type="success" plain @click="openNoteForm()">提醒消息</el-button>
    <!--3.表格-->
    <el-table
      :data="studentList"
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="sid"
        label="学号"
        width="200">
      </el-table-column>
      <el-table-column
        prop="realname"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="spec"-->
        <!--label="专业">-->
        <!--<template slot-scope="studentList">-->
          <!--{{studentList.row.createTime|fmtdate}}-->
        <!--</template>-->
      <!--</el-table-column>-->

      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="studentList">
          <el-button size="mini"
                     @click="openStudentInfo(studentList.row)"
                     :plain="true" type="info" icon="el-icon-edit" circle>
          </el-button>
          <el-button size="mini" :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--4.分页-->
    <el-pagination style="text-align: center"
                   background
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>

    <!--添加学生对话框-->
    <el-dialog title="添加学生" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="学生名" :label-width="formLabelWidth">
          <el-input v-model="insertform.studentName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学生描述" :label-width="formLabelWidth">
          <el-input v-model="insertform.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertStudent()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加提醒" :visible.sync="insertNoteFormVisible">
      <el-form :model="insertNoteForm">
        <el-form-item label="提醒描述" :label-width="formLabelWidth">
          <el-input v-model="insertNoteForm.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="insertNoteFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertNote()">确 定</el-button>
        </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: "student",
    data() {
      return {
        query: "",
        fieldName: "",
        //用户列表
        studentList: [],
        total: -1,
        pagenum: 1,
        pagesize: 10,

        //对话框属性
        insertNoteFormVisible: false,
        insertdialogFormVisible: false,
        formLabelWidth: '120px',
        insertform: {},
        insertNoteForm: {},
        menudata: [],
        multipleSelection: [],
        user:{},
      }
    },
    created() {
      this.user=JSON.parse(localStorage.getItem('user'))
      this.getStudentList();
    },
    methods: {
      //获取student列表
      async getStudentList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        const res = await this.$http
          .get(`studentmentors/`+this.user.userId)
        const {data, status, msg} = res.data
        if (status === 200) {
          for (let i = 0; i <data.length ; i++) {
            this.studentList.push(data[i].studentInfo)
          }
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
        console.log(this.studentList)
      },
      //打开添加student对话框
      async openInsertStudentForm() {
        this.insertdialogFormVisible = true;
      },
      //添加student
      async insertStudent() {
        const res = await this.$http.post('studentmentors/', this.insertform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("添加成功!")
          this.getStudentList();
          this.insertform = {}
        }
        else {
          this.$message.error("添加失败!")
        }
        this.insertdialogFormVisible = false;
      },

      openNoteForm(){
        this.insertNoteFormVisible=true
        console.log(this.multipleSelection)
      },
      async insertNote(){
        const sendData=[]
        console.log(this.multipleSelection)
        for (let i = 0; i <this.multipleSelection.length ; i++) {
          sendData.push({
            noteName:'导师消息',
            remark: this.insertNoteForm.remark,
            userId: this.multipleSelection[i].userId
          })
        }
        console.log(sendData)
        const res = await this.$http.post('studentmentors/sendNote', sendData);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      openStudentInfo(student){
        this.$router.push({
          name:'studentinfo',
          params:{
            studentId: student.userId
          }
        })
      },
      //复选框单选（待做）
      checkGroupNode() {
      }
    }
  }
</script>

<style scoped>
  .box-card {
    height: 99%;
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

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
          <el-button size="mini" :plain="true"
                     @click="openDeleteCourseForm(studentList.row.userId)"
                     type="danger" icon="el-icon-delete" circle></el-button>
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
          <el-autocomplete
            class="inline-input"
            v-model="insertform.sid"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            @select="handleSelect"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="学生姓名" :label-width="formLabelWidth">
          <el-input v-model="insertform.realname" autocomplete="off" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="性别" :label-width="formLabelWidth">
          <el-input v-model="insertform.sex" autocomplete="off" disabled="disabled"></el-input>
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

    <el-dialog
      title="提示"
      :visible.sync="deletedialogFormVisible"
      width="30%">
      <span>是否删除此项？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletedialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteCourseForm()">确 定</el-button>
        </span>
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
        studentInfo: [],
        total: -1,
        pagenum: 1,
        pagesize: 10,

        //对话框属性
        insertNoteFormVisible: false,
        insertdialogFormVisible: false,
        deletedialogFormVisible:false,
        formLabelWidth: '120px',
        insertform: {},
        insertNoteForm: {},
        menudata: [],
        multipleSelection: [],
        user:{},
        deleteId:-1,
      }
    },
    created() {
      this.user=JSON.parse(sessionStorage.getItem('user'))
      this.getStudentList();
      this.loadAll();
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
        this.studentList=[]
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
        var data={
          studentId: this.insertform.userId,
          mentorId: this.user.userId
        }
        for (let i = 0; i < this.studentList.length; i++) {
          if(data.studentId===this.studentList[i].userId)
          {
            this.$message.error("不要重复添加")
            return
          }
        }
        const res = await this.$http.post('studentmentors/', data);
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
        sendData.push({
          noteName:'导师消息',
          remark: this.insertNoteForm.remark,
          userId: this.user.userId
        })
        const res = await this.$http.post('studentmentors/sendNote', sendData);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("通知成功!")
          this.insertNoteForm = {}
        }
        else {
          this.$message.error("通知失败!")
        }
        this.insertNoteFormVisible = false;
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
      async openDeleteCourseForm(Id){
        this.deletedialogFormVisible = true;
        this.deleteId=Id
        console.log(this.deleteId)

      },
      async deleteCourseForm() {
        this.deletedialogFormVisible = false;
        let studentId=this.deleteId
        const res = await this.$http.delete('studentmentors/'+studentId)
        this.deleteId=-1;
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getStudentList();
        }
        else {
          this.$message.error("更新失败!")
        }
      },
      querySearch(queryString, cb) {
        var studentinfo = this.studentInfo;
        var results = queryString ? studentinfo.filter(this.createFilter(queryString)) : studentinfo;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (student) => {
          return (student.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      async loadAll() {
        let roleName='学生'
        const res=await this.$http.get(`/users/userbyRole?roleName=${roleName}`)
        const {data}=res.data
        this.studentInfo=data
        for (let i = 0; i < this.studentInfo.length; i++) {
          this.studentInfo[i].value=this.studentInfo[i].sid
        }
       //  return [
       //    { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
       //    { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
       //    { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
       // ];
      },
      handleSelect(item) {
        this.insertform=item
        console.log(item);
      },
      //复选框单选（待做）
      checkGroupNode() {
      }
    },
    async openDeleteCourseForm(Id){
      this.deletedialogFormVisible = true;
      this.deleteId=Id
      console.log(this.deleteId)

    },
    async deleteCourseForm() {
      this.deletedialogFormVisible = false;
      let userId=this.deleteId
      const res = await this.$http.delete('users/'+userId)
      this.deleteId=-1;
      const {status, msg} = res.data
      if (status === 200) {
        this.$message.success("更新成功!")
        this.getStudentList();
      }
      else {
        this.$message.error("更新失败!")
      }
    },
    mounted() {
      // this.studentInfo=this.loadAll()
      // console.log(this.studentInfo)
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

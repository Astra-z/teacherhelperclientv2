<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>成绩列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <!--2.搜索框-->
    <div class="block">
      <span class="demonstration">选择课程成绩：</span>
      <el-cascader
        v-model='courseIdValue'
        :options="courseList"
        :props="{ expandTrigger: 'hover', value:'courseId'}"
        @change="handleChange">
      </el-cascader>
      <el-button
        class="input_button"  @click="searchScore"
        icon="el-icon-search" size="large"></el-button>
    </div>
    <br>
    <!--<div v-if="(user||{}).roleName[0]=='管理员'||(user||{}).roleName[0]=='教师'">-->
      <!--<label>成绩名：</label>-->
      <!--<el-input class="input_text"-->
                <!--placeholder="请输入内容"-->
                <!--prefix-icon="el-icon-search"-->
                <!--v-model="query">-->
        <!--<el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>-->
      <!--</el-input>-->
      <!--<el-button type="success" plain @click="$router.push({name:'scoreadd'})">添加</el-button><br>-->
    <!--</div>-->

    <!--3.表格-->
    <el-table
      :data="scoreList"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="40">
      </el-table-column>
      <el-table-column
        prop="studentId"
        label="学号"
        width="150">
      </el-table-column>
      <el-table-column
        prop="studentName"
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="score"
        label="成绩"
        width="100">
      </el-table-column>

      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scoreList">
          <el-button size="mini"
                     v-if="(user||{}).roleName[0]=='管理员'||(user||{}).roleName[0]=='教师'"
                     @click="openUpdateScoreForm(scoreList.row)"
                     :plain="true" type="primary" icon="el-icon-edit" circle>
          </el-button>
          <el-button size="mini"
                     v-if="(user||{}).roleName[0]=='管理员'||(user||{}).roleName[0]=='教师'"
                     :plain="true" type="danger"
                     icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--4.分页-->
    <el-pagination style="text-align: center"
                   background
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>

    <!--&lt;!&ndash;添加成绩对话框&ndash;&gt;-->
    <!--<el-dialog title="添加成绩" :visible.sync="insertdialogFormVisible">-->
      <!--<el-form :model="insertform">-->
        <!--<el-form-item label="成绩名" :label-width="formLabelWidth">-->
          <!--<el-input v-model="insertform.scoreName" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="成绩描述" :label-width="formLabelWidth">-->
          <!--<el-input v-model="insertform.remark" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<div slot="footer" class="dialog-footer">-->
        <!--<el-button @click="insertdialogFormVisible = false">取 消</el-button>-->
        <!--<el-button type="primary" @click="insertScore()">确 定</el-button>-->
      <!--</div>-->
    <!--</el-dialog>-->


    <el-dialog title="更新成绩" :visible.sync="updatedialogFormVisible">
      <el-form :model="updateform">
        <el-form-item label="学号" :label-width="formLabelWidth">
          <el-input v-model="updateform.studentId" autocomplete="off" disabled="disabled"></el-input>
        </el-form-item>


        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="updateform.studentName" autocomplete="off"  disabled="disabled" ></el-input>
        </el-form-item>

        <el-form-item label="成绩" :label-width="formLabelWidth">
          <el-input v-model="updateform.score"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    maxLength='3'
                    autocomplete="on"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateScore()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: "score",
    data() {
      return {
        query: "",
        fieldName: "",
        //列表
        scoreList: [],
        selectedScoreList:[],
        courseList: [],
        courseIdValue: "",
        total: -1,
        pagenum: 1,
        pagesize: 100,

        //对话框属性
        updatedialogFormVisible: false,
        insertdialogFormVisible: false,
        formLabelWidth: '120px',
        insertform: {},
        updateform: {},
        menudata: [],
        //树默认选中节点
        defaultcheckList:[],
        user:{},
      }
    },
    created() {
      this.user=JSON.parse(localStorage.getItem('user'))
      this.getScoreList();
      this.getCourseList();
    },
    methods: {
      //courses
      async getCourseList() {
        const res = await this.$http.get(`courses/?fieldValue=${this.user.sid}&fieldName=teacherId`)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.courseList = data;
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
        this.courseList=JSON.parse(
          JSON.stringify(this.courseList)
            .replace(/courseName/g, 'label'))
        console.log(this.courseList)
      },
      //获取score列表
      async getScoreList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        const res = await this.$http
          .get(`scores/?page=${this.pagenum}&limit=${this.pagesize}`)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.scoreList = data;
          console.log(data)
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
      },
      //打开更新对话框
      async openUpdateScoreForm(score){
        this.updatedialogFormVisible=true;
        // 选中的menus传到对话框
        this.updateform=score;
      },
      //更新score
      async updateScore() {
        if(this.updateform.score>100){
          this.$message.error("输入成绩错误")
          return
        }
        const res = await this.$http.patch('scores/'+this.updateform.scoreId, this.updateform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getScoreList();
          this.updateform = {}
        }
        else {
          this.$message.error("更新失败!")
        }
        this.updatedialogFormVisible=false
        this.getScoreList()
      },
      handleChange(value) {
      },
      //根据课程搜索成绩
      async searchScore(){
        const res = await this.$http
          .get(`scores/?page=${this.pagenum}&limit=${this.pagesize}&fieldValue=${this.courseIdValue[0]}&fieldName=courseId`)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.scoreList = data;
          this.total = data.length
          this.$message.success(msg)
        }
        else {
          this.$message.error(msg)
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

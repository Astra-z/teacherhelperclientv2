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
      <span class="demonstration">选择专业成绩：</span>
      <el-cascader
        v-model='specIdValue'
        :options="collegeList"
        :props="{ expandTrigger: 'hover', children: 'specList', value:'specId'}"
        @change="handleChange">
      </el-cascader>
      <el-button
        class="input_button"  @click="searchScore"
        icon="el-icon-search" size="large"></el-button>
    </div>
    <br>
    <div v-if="(user||{}).roleName[0]=='管理员'||(user||{}).roleName[0]=='教师'">
      <label>成绩名：</label>
      <el-input class="input_text"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="query">
        <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
      </el-input>
      <el-button type="success" plain @click="$router.push({name:'scoreadd'})">添加</el-button><br>
    </div>


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
        prop="scoreName"
        label="成绩名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="specDO.specName"
        label="专业">
      </el-table-column>
      <el-table-column
        prop="scoreTeacher"
        label="任课教师"
        width="100">
      </el-table-column>
      <el-table-column
        prop="studentNum"
        label="已选人数"
        width="100">
      </el-table-column>
      <el-table-column
        prop="maxNum"
        label="最大人数"
        width="100">
      </el-table-column>
      <el-table-column
        prop=""
        label="操作">
        <template slot-scope="scoreList">
          <el-button size="mini"
                     @click="openInfoScoreForm(scoreList.row)"
                     :plain="true" type="info" icon="el-icon-more" circle></el-button>
          <el-button size="mini"
                     v-if="(user||{}).roleName[0]=='管理员'||(user||{}).roleName[0]=='教师'"
                     @click="openUpdateScoreForm(scoreList.row)"
                     :plain="true" type="primary" icon="el-icon-edit" circle>
          </el-button>
          <el-button size="mini"
                     v-if="(user||{}).roleName[0]=='管理员'||(user||{}).roleName[0]=='教师'"
                     :plain="true" type="danger"
                     icon="el-icon-delete" circle></el-button>
          <el-button size="mini"
                     :plain="true"
                     type="success"
                     icon="el-icon-check"
                     @click="selectScoreOpen(scoreList.row)"
                     v-if="(user||{}).roleName[0]=='学生'"
                     circle></el-button>

        </template>
      </el-table-column>
    </el-table>
    <!--4.分页-->
    <el-pagination style="text-align: center"
                   background
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>

    <!--添加成绩对话框-->
    <el-dialog title="添加成绩" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="成绩名" :label-width="formLabelWidth">
          <el-input v-model="insertform.scoreName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="成绩描述" :label-width="formLabelWidth">
          <el-input v-model="insertform.remark" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertScore()">确 定</el-button>
      </div>
    </el-dialog>


    <!--更新成绩对话框-->
    <!--<el-dialog title="更新成绩" :visible.sync="updatedialogFormVisible">-->
    <!--<el-form :model="updateform">-->
    <!--<el-form-item label="成绩名" :label-width="formLabelWidth">-->
    <!--<el-input v-model="updateform.scoreName" autocomplete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--<el-form-item label="专业" :label-width="formLabelWidth">-->
    <!--<el-input v-model="updateform.specName" autocomplete="off"></el-input>-->
    <!--</el-form-item>-->
    <!--</el-form>-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="updatedialogFormVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="updateScore()">确 定</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <el-dialog title="更新成绩" :visible.sync="updatedialogFormVisible">
      <el-form :model="updateform">
        <el-form-item label="成绩名" :label-width="formLabelWidth">
          <el-input v-model="updateform.scoreName" autocomplete="off" disabled="disabled"></el-input>
        </el-form-item>


        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="updateform.specName" autocomplete="on"></el-input>
        </el-form-item>

        <el-form-item label="任课教师" :label-width="formLabelWidth">
          <el-input v-model="updateform.scoreTeacher" autocomplete="on"></el-input>
        </el-form-item>

        <el-form-item label="最大人数" :label-width="formLabelWidth">
          <el-input v-model="updateform.maxNum" autocomplete="off"></el-input>
        </el-form-item>


        <!--<el-form-item label="学期" :label-width="formLabelWidth">-->
        <!--<el-input v-model="updateform.specName" autocomplete="off"></el-input>-->
        <!--</el-form-item>-->


        <el-form-item label="上课地点" :label-width="formLabelWidth">
          <el-input v-model="updateform.scoreAddress" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="updateform.remark" autocomplete="off"></el-input>
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
        collegeList: [],
        specIdValue: "",
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
      this.getCollegeList();
      console.log(this.user)
    },
    methods: {
      //获取college列表
      async getCollegeList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        const res = await this.$http
          .get(`colleges/?page=${this.pagenum}&limit=${this.pagesize}`)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.collegeList = data;
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
        this.collegeList=JSON.parse(
          JSON.stringify(this.collegeList)
            .replace(/collegeName/g, 'label')
            .replace(/specName/g, 'label'))
        console.log(this.collegeList)
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
          // this.scoreList.speDOdata=JSON.stringify(this.scoreList.specDO)
          console.log(data)
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
        if(this.user.roleName[0]=='学生'){
          const selecteddata=await this.$http
            .get(`scores/?fieldValue=${this.user.sid}&fieldName=studentId`)
          this.selectedScoreList=selecteddata.data.data
        }

      },
      //打开添加score对话框
      async openInsertScoreForm() {
        this.insertdialogFormVisible = true;
      },
      //添加score
      async insertScore() {
        const res = await this.$http.post('scores/', this.insertform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("添加成功!")
          this.getScoreList();
          this.insertform = {}
        }
        else {
          this.$message.error("添加失败!")
        }
        this.insertdialogFormVisible = false;
      },
      //打开更新对话框
      async openUpdateScoreForm(score){
        this.updatedialogFormVisible=true;
        // 选中的menus传到对话框
        const data=score.specDO
        this.updateform=score;
        this.updateform.specName=data.specName
        console.log(this.updateform)
        // 查找菜单
        // console.log(this.updateform)
      },
      //更新score
      async updateScore() {
        this.updatedialogFormVisible = false;
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
      },
      handleChange(value) {

      },
      //根据专业搜索成绩
      async searchScore(){
        const res = await this.$http
          .get(`scores/?page=${this.pagenum}&limit=${this.pagesize}&fieldValue=${this.specIdValue[1]}&fieldName=specId`)
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
      openInfoScoreForm(score){
        let remark
        let data = ['成绩名：'+score.scoreName,
          '学期：'+score.term,
          '任课老师：'+score.scoreTeacher,
          '上课地点：'+score.scoreAddress,
          '备注：'+(score.remark||'无'),];
        //2.新建newDatas数组
        let newDatas = [];
        const h = this.$createElement;
        //3.通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
        for(let i in data){
          //4.将data数据push进newDatas数组中
          newDatas.push(h('p',null,data[i]));
        }
        this.$alert(h('div',null, newDatas), '成绩详情', {
          confirmButtonText: '确定',
        });
      },
      //学生选课
      selectScoreOpen(score) {
        this.$confirm('是否添加该成绩?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(async () => {
          if(score.studentNum==score.maxNum){
            this.$message.error("成绩人数已满")
            return
          }
          console.log(this.selectedScoreList,score.scoreId)
          for (let i = 0; i <this.selectedScoreList.length ; i++) {
            if (score.scoreId===this.selectedScoreList[i].scoreId) {
              this.$message.error("不能重复选择成绩")
              return
            }
          }
          var selectscoredata={
            studentId:this.user.sid,
            scoreId:score.scoreId,
            teacherId:score.teacherId
          }
          // console.log(selectscoredata)
          const res=await this.$http.post('scores/',selectscoredata)
          const{status,msg,data}= res.data
          if(status===200){
            this.$message.success("选择成绩成功!");
          }
          else {
            this.$message.error("添加失败!")
          }
          this.getScoreList()
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

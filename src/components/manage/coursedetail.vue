<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/courselist' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--tab标签页-->
    <el-tabs class="mytabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程信息" name="1">
        <h2>{{this.myCourse.courseName}}</h2>
        <p>课程编号：{{this.myCourse.courseId}}</p>
        <p>开课学期：{{this.myCourse.term}}</p>
        <p>任课老师：{{this.myCourse.courseTeacher}}</p>
        <p>上课地点：{{this.myCourse.courseAddress}}</p>
        <p>开课时间：{{((this.myCourse.courseTimeList||{})[0]||{}).startTime}}</p>
        <p>课程备注：{{this.myCourse.remark||'无'}}</p>
      </el-tab-pane>
      <el-tab-pane label="课程任务" name="2">任务</el-tab-pane>

      <el-tab-pane label="课程资料" name="3">

      </el-tab-pane>
      <el-tab-pane label="课程作业" name="4">
        <div style="margin-bottom: 30px">
          <strong style="font-size: 25px">课程现有作业:</strong>
          <el-button
            v-if="user.roleName[0]==='教师'"
            style="float: right"
           type="success" plain size="small"
           @click="openInsertHomeworkForm()">添加</el-button><br>
        </div>
        <el-collapse v-model="homeworkActiveName" accordion>
          <el-collapse-item
            @click.native="collapseHandleClick(homeworkItem.courseHomeworkId)"
            v-for="(homeworkItem,homeworkindex) in courseHomeworkList"
            :key="homeworkindex" :title="homeworkItem.courseHomeworkName"
            :name="homeworkItem.courseHomeworkId">
            <h3>作业概述：</h3>
            <p style="margin-bottom: 30px">{{homeworkItem.remark||'无'}}</p>
              <el-upload
                class="upload-demo"
                ref="upload"
                :action="actionUrl()"
                :on-success="handleUploadSuccess"
                :data="uploaddata"
                :before-upload="beforeUpload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="fileList"
                :multiple="false"
                :auto-upload="false">
                <div v-if="user.roleName[0]==='管理员'||user.roleName[0]==='教师'">已上传作业：</div>
                <el-button
                  v-if="user.roleName[0]!=='管理员'&&user.roleName[0]!=='教师'"
                  slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button
                  v-if="user.roleName[0]!=='管理员'&&user.roleName[0]!=='教师'"
                  style="margin-left: 10px;" size="small"
                  type="success" @click="submitUpload(homeworkindex)">上传作业</el-button>
              </el-upload>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
    <!--添加作业对话框-->
    <el-dialog title="添加作业" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="作业名" :label-width="formLabelWidth">
          <el-input v-model="insertform.courseHomeworkName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="作业描述" :label-width="formLabelWidth">
          <el-input v-model="insertform.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertHomework()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

    export default {
      name: "coursedetail",
      data(){
        return {
          courseId:this.$route.params.courseId,
          myCourse:{},
          activeName:'1',
          homeworkActiveName:'',
          fileList: [
          ],
          courseHomeworkList:[],
          //已经点过的id
          courseHomeworkId:-1,
          uploaddata:{},
          //user信息
          user:{},
          //对话框信息
          updatedialogFormVisible: false,
          insertdialogFormVisible: false,
          formLabelWidth: '120px',
          insertform: {},
          updateform: {},
        }
      },
      created(){
        this.getCourseList();
        this.user=JSON.parse(sessionStorage.getItem('user'))
      },
      methods:{
        //获取课程信息
        async getCourseList(){
          const res = await this.$http
            .get(`courses/`+this.courseId)
          // console.log(res)
          const {data, status, msg} = res.data
          if (status === 200) {
            this.myCourse=data;
          }
          else {
            this.$message.error(msg)
          }
        },
        //上传文件前
        beforeUpload(){
          const username=JSON.parse(sessionStorage.getItem('user')).username
          this.uploaddata.username=username;
          this.uploaddata.courseHomeworkId=this.courseHomeworkId;
          this.uploaddata.courseId=this.myCourse.courseId;
        },
        //上传文件
        submitUpload(homeworkindex) {
          // el-collapse-item会重复渲染里面的内容因此ref是个数组
          this.$refs.upload[homeworkindex].submit();
        },
        //上传成功显示
        handleUploadSuccess(response){
          const {status,msg}=response;
          if(status===200){
            this.$message.success(msg)
          }
          else {
            this.$message.error(msg)
          }
        },
        //动态修改请求url
        actionUrl(){
          return `http://127.0.0.1:8888/v1/courses/uploadhomework`;
        },
        //文件移除
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        //点击文件
        handlePreview(file) {
          window.open(`http://127.0.0.1:8888/v1/coursehomeworks/filesdownloads?fileName=${file.name}&courseHomeworkId=${file.courseHomeworkId}&courseId=${this.myCourse.courseId}`)
        },
        //标签页点击事件
        async handleClick(){
          if(this.activeName==='4') {
            this.getHomework()
          }
        },
        async getHomework(){
          const res=await this.$http.get(`coursehomeworks/?fieldValue=${this.myCourse.courseId}&fieldName=courseId`)
          // console.log(res.data)
          const{status,msg,data}=res.data
          if(status===200){
            this.courseHomeworkList=data;
          }
          else{
            this.$message.error("查找作业失败！")
          }
        },
        //折叠页切换时间
        async collapseHandleClick(courseHomeworkId){
          //防止多次发送请求
          if(courseHomeworkId!=this.courseHomeworkId)
            this.courseHomeworkId=courseHomeworkId
          else
            return;
          const username=JSON.parse(sessionStorage.getItem('user')).username

          if(this.user.roleName[0]==='管理员'||this.user.roleName[0]==='教师'){
            const res=await this.$http.get(`courses/homeworklist?courseId=${this.myCourse.courseId}&courseHomeworkId=${courseHomeworkId}`)
            const courseNameList=res.data.data
            this.fileList=[]
            if(courseNameList!=null){
              for(let i=0;i<courseNameList.length;i++){
                this.fileList.push({name:courseNameList[i],
                                    courseHomeworkId:courseHomeworkId})
              }
            }
          }
          else if(this.user.roleName[0]=='学生'){
            const res=await this.$http.get(`courses/homeworklist?courseId=${this.myCourse.courseId}&courseHomeworkId=${courseHomeworkId}&username=${username}`)
            // console.log(res)
            const courseNameList=res.data.data
            this.fileList=[]
            if(courseNameList!=null){
              for(let i=0;i<courseNameList.length;i++){
                this.fileList.push({name:courseNameList[i]})
              }
            }
          }
        },
        openInsertHomeworkForm(){
          this.insertdialogFormVisible=true;
        },
        async insertHomework(){
          this.insertform.courseId=this.myCourse.courseId
          const res=await this.$http.post('coursehomeworks/',this.insertform)
          const {status,msg,data}=res.data;
          if(status===200){
            this.$message.success("添加作业成功")
          }
          else{
            this.$message.error("添加作业失败")
          }
          this.insertdialogFormVisible=false
          this.insertform={}
          this.getHomework()
        },
      }
    }
</script>

<style scoped>
  .box-card {
    height: 99%;
  }
  .mytabs{
    margin-top: 10px;
  }
</style>

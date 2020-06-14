<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/courselist' }">学生列表</el-breadcrumb-item>
      <el-breadcrumb-item>学生详情</el-breadcrumb-item>
    </el-breadcrumb>

    <!--tab标签页-->
    <el-tabs class="mytabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="学生信息" name="1">
        <h2>学生信息</h2>
        <p>   学号：{{"      "+this.studentInfo.sid}}</p>
        <p>   姓名：{{"      "+this.studentInfo.realname}}</p>
        <p>   性别：{{"      "+this.studentInfo.sex}}</p>
        <p>政治面貌：{{this.studentInfo.politicsStatus}}</p>

      </el-tab-pane>
      <el-tab-pane label="文件上传" name="2">
        <div style="margin-bottom: 20px">
          <strong style="font-size: 25px">已上传文件:</strong>
        </div>
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
            <el-button
              slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button
              style="margin-left: 10px;" size="small"
              type="success" @click="submitUpload()">上传文件</el-button>
          </el-upload>
        <!--v-if="user.roleName[0]!=='管理员'&&user.roleName[0]!=='教师'"-->
      </el-tab-pane>
    </el-tabs>
    <!--添加文件对话框-->
    <el-dialog title="添加文件" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="文件名" :label-width="formLabelWidth">
          <el-input v-model="insertform.courseFileName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="文件描述" :label-width="formLabelWidth">
          <el-input v-model="insertform.remark" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertFile()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

    export default {
      name: "coursedetail",
      data(){
        return {
          studentId:this.$route.params.studentId,
          mentorId:'',
          studentSid:'',
          studentInfo:{},
          activeName:'1',
          fileActiveName:'',
          fileList: [
          ],

          courseFileId:-1,
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
        this.getStudentInfo();
        this.user=JSON.parse(localStorage.getItem('user'))
      },
      methods:{
        //获取学生信息
        async getStudentInfo(){
          const res = await this.$http
            .get(`users/`+this.studentId)
          const {data, status, msg} = res.data
          if (status === 200) {
            this.studentInfo=data;
          }
          else {
            this.$message.error(msg)
          }
        },
        //上传文件前
        beforeUpload(){
          this.uploaddata.studentId=this.studentSid
          this.uploaddata.mentorId=this.mentorId
        },
        //上传文件
        submitUpload() {
          this.$refs.upload.submit();
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
          return `http://127.0.0.1:8888/v1/studentmentors/uploadfile`;
        },
        //文件移除
        handleRemove(file, fileList) {
          console.log(file, fileList);
        },
        //点击文件
        handlePreview(file) {
          window.open(`http://127.0.0.1:8888/v1/studentmentors/filesdownloads?fileName=${file.name}&mentorId=${this.mentorId}&studentId=${this.studentSid}`)
        },
        //标签页点击事件
        async handleClick(){
          if(this.activeName==='2') {
            this.getFile()
          }
        },
        async getFile(){
          if(this.user.roleName[0]==='学生'){
            this.studentSid=this.studentInfo.sid
            const res=await this.$http.get(`studentmentors/?fieldValue=${this.studentSid}&fieldName=studentId`)
            this.mentorId=res.data.mentorId
          }
          else if(this.user.roleName[0]==='管理员'||this.user.roleName[0]==='教师')
          {
            this.mentorId=this.user.sid
            this.studentSid=this.studentInfo.sid
          }
          const res=await this.$http.get(`studentmentors/studenfilelist/?mentorId=${this.mentorId}&studentId=${this.studentSid}`)
          const{status,msg,data}=res.data
          if(status===200){
            this.fileList=[]
            for(let i=0;i<data.length;i++){
              this.fileList.push({name:data[i]})
            }
          }
          else{
            this.$message.error("查找文件失败！")
          }
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

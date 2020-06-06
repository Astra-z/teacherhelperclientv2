<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/courselist' }">课程列表</el-breadcrumb-item>
      <el-breadcrumb-item>课程详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs class="mytabs" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="课程信息" name="1">
        <h2>{{this.myCourse.courseName}}</h2>
        <p>课程编号：{{this.myCourse.courseId}}</p>
        <p>开课学期：{{this.myCourse.term}}</p>
        <p>任课老师：{{this.myCourse.courseTeacher}}</p>
        <p>上课地点：{{this.myCourse.courseAddress}}</p>
        <p>开课时间：{{(this.myCourse.courseTimeList[0]||{}).startTime}}</p>
        <p>课程备注：{{this.myCourse.remark||'无'}}</p>
      </el-tab-pane>
      <el-tab-pane label="课程任务" name="2">任务</el-tab-pane>
      <el-tab-pane label="课程资料" name="3">资料</el-tab-pane>
      <el-tab-pane label="课程作业" name="4">作业</el-tab-pane>
    </el-tabs>

  </el-card>
</template>

<script>
    export default {
      name: "coursedetail",
      data(){
        return {
          courseId:this.$route.params.courseId,
          myCourse:[],
          activeName:'1'
        }
      },
      created(){
        this.getCourseList();
      },
      methods:{
        async getCourseList(){
          const res = await this.$http
            .get(`courses/`+this.courseId)
          console.log(res)
          const {data, status, msg} = res.data
          if (status === 200) {
            this.myCourse=data;
          }
          else {
            this.$message.error(msg)
          }
        }
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

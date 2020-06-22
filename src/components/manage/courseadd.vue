<template>
  <el-card class="box-card">
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/course' }">课程管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程添加</el-breadcrumb-item>
    </el-breadcrumb>
    <el-alert class="card-alert"
      title="添加课程"
      type="info"
      center
      :closable="false"
      show-icon>
    </el-alert>
    <!--步骤条-->
    <el-steps :active="parseInt(stepActive)" :align-center="true">
      <el-step title="课程基本信息" icon="el-icon-edit"></el-step>
      <el-step title="课程时间安排" icon="el-icon-time"></el-step>
      <el-step title="完成" icon="el-icon-finished"></el-step>
    </el-steps>
    <!--标签页-->
    <el-tabs tab-position="right" v-model="stepActive" class="tabs-page">
      <el-tab-pane name="1" label="课程基本信息">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="课程名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>

          <el-form-item label="课程专业">

            <el-cascader
              v-model='specIDValue'
              :options="collegeList"
              :props="{ expandTrigger: 'hover', children: 'specList', value:'specId'}"
              @change="handleChange">
            </el-cascader>
          </el-form-item>

          <el-form-item label="课程学年">
            <el-col :span="11">
              <el-date-picker
                v-model="form.startYearValue"
                type="year"
                :editable="false"
                @change="changeEndYear"
                placeholder="起始学年"
                format="yyyy"
                value-format="yyyy">
              </el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
            <el-col :span="11">
              <el-date-picker
                v-model="form.endYearValue"
                type="year"
                :readonly="true"
                placeholder="">
              </el-date-picker>
            </el-col>
          </el-form-item>

          <el-form-item label="课程学期">
            <el-select v-model="form.region" placeholder="请选择活动区域">
              <el-option label="春季学期" value="春季学期"></el-option>
              <el-option label="秋季学期" value="秋季学期"></el-option>
              <el-option label="冬季学期" value="冬季学期"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="开课时间">
            <el-col :span="11">
              <el-date-picker
                v-model="form.courseStartTime"
                type="date"
                :editable="false"
                @change="changeEndYear"
                placeholder="开始时间"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="教师工号">
            <el-input v-model="form.teacherId"></el-input>
          </el-form-item>

          <el-form-item label="教师姓名">
            <el-input v-model="form.courseTeacher"></el-input>
          </el-form-item>

          <el-form-item label="上课地点">
            <el-input v-model="form.courseAddress"></el-input>
          </el-form-item>

          <el-form-item label="最大人数">
            <el-input v-model="form.maxNum"></el-input>
          </el-form-item>


          <el-form-item label="课程备注">
            <el-input type="textarea" :rows="3" v-model="form.remark"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane name="2" label="课程时间安排">


        <div v-for="(tab,index) in formData.tabs" :key="index">
          <el-form :model="tab" label-width="80px">
            <el-form-item> <strong>第{{index+1}}节课</strong></el-form-item>
            <el-form-item label="时间(周)">
              <el-select v-model="tab.weekday" placeholder="选择周几上课">
                <el-option label="星期一" value="0"></el-option>
                <el-option label="星期二" value="1"></el-option>
                <el-option label="星期三" value="2"></el-option>
                <el-option label="星期四" value="3"></el-option>
                <el-option label="星期五" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="上课节数">
              <el-row>
                <el-col :span="11">
                  <el-select v-model="tab.startLesson"
                             @change="startLessonChange(index)"
                             placeholder="选择开始节">
                    <el-option label="1" value="0"></el-option>
                    <el-option label="2" value="1"></el-option>
                    <el-option label="3" value="2"></el-option>
                    <el-option label="4" value="3"></el-option>
                    <el-option label="5" value="4"></el-option>
                    <el-option label="6" value="5"></el-option>
                    <el-option label="7" value="6"></el-option>
                    <el-option label="8" value="7"></el-option>
                  </el-select>
                </el-col>
                <el-col :span="2" style="text-align: center">-</el-col>
                <el-col :span="11">
                  <el-select v-model="tab.endLesson"
                             @change="endLessonChange(index)"
                             placeholder="选择结束节">
                    <el-option label="1" value="0"></el-option>
                    <el-option label="2" value="1"></el-option>
                    <el-option label="3" value="2"></el-option>
                    <el-option label="4" value="3"></el-option>
                    <el-option label="5" value="4"></el-option>
                    <el-option label="6" value="5"></el-option>
                    <el-option label="7" value="6"></el-option>
                    <el-option label="8" value="7"></el-option>
                  </el-select>
                </el-col>
              </el-row>
            </el-form-item>
          </el-form>

        </div>

        <div style="text-align: center;margin-bottom: 30px">
          <el-button @click="addForm()"
                     :plain="true" type="danger" icon="el-icon-circle-plus-outline" circle>
          </el-button>
          <el-button @click="minusForm()"
                     :plain="true" type="info" icon="el-icon-remove-outline" circle>
          </el-button>
        </div>

        <div style="text-align: center">
          <el-button type="primary"
                     @click="insertcourseOpen"
                     round icon="el-icon-finished" >提交
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
    export default {
      data() {
        return {
          query: "",
          fieldName: "",
          //列表
          courseList: [],
          collegeList: [],
          specIDValue: "",
          total: -1,
          pagenum: 1,
          pagesize: 100,
          //表单属性
          form: {
            name: '',
            region: '春季学期',
            startYearValue: '2020',
            endYearValue:'2021',
            teacherId:'',
            remark: '',
            courseTerm: '',
            courseAddress:'',
            maxNum:50,
            courseStartTime:''
          },

          formData:{
            tabs:[{
              weekday: '0',
              endLesson:'0',
              startLesson:'0',
            }]
          },

          buttontext:'下一页',
          stepActive: "1",
        }
      },
      created(){
        this.getCollegeList();
      },
      methods: {
        onSubmit() {
          console.log('submit!');
        },
        changeEndYear(){
          this.form.endYearValue=(parseInt(this.form.startYearValue)+1)+''
        },
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
        },
        handleChange(){
        },
        nextStep(){
          if(this.stepActive==="1")
            this.stepActive="2";
          else
            this.stepActive="1";

          if(this.stepActive==="2")
            this.buttontext='提交';
          else
            this.buttontext='下一页'
        },
        lastStep(){
          if (this.stepActive-- <= 0) this.stepActive = 0;
        },
        endLessonChange(index){
          if (parseInt(this.formData.tabs[index].endLesson)<parseInt(this.formData.tabs[index].startLesson)){
            this.$message.error("结束节不能小于开始节！")
            this.formData.tabs[index].endLesson=this.formData.tabs[index].startLesson
          }
        },
        startLessonChange(index){
          if (parseInt(this.formData.tabs[index].endLesson)<parseInt(this.formData.tabs[index].startLesson)){
            this.formData.tabs[index].endLesson=this.formData.tabs[index].startLesson
          }
        },
        insertcourseOpen() {
          let self=this
          this.$confirm('是否添加该课程?', '确认', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(async () => {
            let courseTimeList=[]
            for (let i = 0; i <this.formData.tabs.length ; i++) {
              for (let j = i+1; j < this.formData.tabs.length; j++) {
                if(this.formData.tabs[i].weekday===this.formData.tabs[j].weekday){
                  let max=this.formData.tabs[i]
                  if(this.formData.tabs[i].endLesson<this.formData.tabs[j].endLesson){
                    if(parseInt(this.formData.tabs[j].startLesson)<=parseInt(this.formData.tabs[i].endLesson))
                    {
                      this.$message.error("课程时间重复！请重新输入")
                      return
                    }
                  }
                  else {
                    if(parseInt(this.formData.tabs[i].startLesson)<=parseInt(this.formData.tabs[j].endLesson))
                    {
                      this.$message.error("课程时间重复！请重新输入")
                      return
                    }
                  }
                }
              }
            }
            for (let i = 0; i <this.formData.tabs.length ; i++) {
              courseTimeList.push({
                weekday:this.formData.tabs[i].weekday,
                startLesson:this.formData.tabs[i].startLesson,
                endLesson:this.formData.tabs[i].endLesson,
                startTime:this.form.courseStartTime,
              })
            }

            let coursedata={
              courseName: this.form.name,
              term: this.form.startYearValue+'-'+this.form.endYearValue+'学年'+this.form.region,
              teacherId: this.form.teacherId,
              specId: this.specIDValue[1],
              remark: this.form.remark,
              courseTeacher: this.form.courseTeacher,
              courseAddress: this.form.courseAddress,
              maxNum:this.form.maxNum,
              studentNum:0,
              courseTimeList: courseTimeList
            };
            console.log(coursedata)
            const res=await this.$http.post('courses/',coursedata)
            const{status,msg,data}= res.data
            if(status===200){
                this.$message.success("添加成功!");
                $router.push({name:'course'});
            }
            else {
              this.$message.error("内容填写错误或没有填写，添加失败!")
            }
          })
        },
        addForm(){
          this.formData.tabs.push({
            weekday: '0',
            endLesson:'0',
            startLesson:'0',
          })
        },
        minusForm(){
          this.formData.tabs.pop();
        },

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
  .card-alert{
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .page-button{
    float: bottom;
    text-align: center;
  }
  .tabs-page{
    margin-top: 10px;
  }
</style>

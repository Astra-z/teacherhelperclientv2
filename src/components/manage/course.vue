<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>课程列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <!--2.搜索框-->
    <div class="block">
      <span class="demonstration">选择专业课程：</span>
      <el-cascader
        v-model='specIdValue'
        :options="collegeList"
        :props="{ expandTrigger: 'hover', children: 'specList', value:'specId'}"
        @change="handleChange">
      </el-cascader>
      <el-button
        class="input_button" @click="searchCourse"
        icon="el-icon-search" size="large"></el-button>
    </div>
    <br>
    <div v-if="(user||{}).roleName[0]==='管理员'">
      <label>课程名：</label>
      <el-input class="input_text"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="query">
        <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
      </el-input>
      <el-button type="success" plain @click="$router.push({name:'courseadd'})">添加</el-button>
      <br>
    </div>


    <!--3.表格-->
    <el-table
      :data="courseList"
      style="width: 100%">

      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="学期:">
              <span>{{ props.row.term }}</span>
            </el-form-item>
            <el-form-item label="上课地点:">
              <span>{{ props.row.courseAddress }}</span>
            </el-form-item>

            <el-form-item style="    margin-right: 0;
    margin-bottom: 0;
    width: 100%;" label="上课时间:">
              <div
                v-for="(value,index) in props.row.courseTimeList">

                <h5>第{{index +1}}
                  次课:周
                  {{ value.weekday+1 }}
                  第
                  {{value.startLesson+1}}
                  -
                  {{value.endLesson+1}}
                  节 </h5>
              </div>
            </el-form-item>

            <el-form-item label="备注:">
              <span>{{ props.row.remark||'无' }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>


      <el-table-column
        type="index"
        label="#"
        width="40">
      </el-table-column>
      <el-table-column
        prop="courseName"
        label="课程名"
        width="150">
      </el-table-column>
      <el-table-column
        prop="specDO.specName"
        label="专业">
      </el-table-column>
      <el-table-column
        prop="courseTeacher"
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
        <template slot-scope="courseList">
          <el-button size="mini"
                     @click="openInfoCourseForm(courseList.row)"
                     :plain="true" type="info" icon="el-icon-more" circle></el-button>
          <el-button size="mini"
                     v-if="(user||{}).roleName[0]==='管理员'"
                     @click="openUpdateCourseForm(courseList.row)"
                     :plain="true" type="primary" icon="el-icon-edit" circle>
          </el-button>
          <el-button size="mini"
                     v-if="(user||{}).roleName[0]==='管理员'"
                     @click="openDeleteCourseForm(courseList.row.courseId)"
                     :plain="true" type="danger"
                     icon="el-icon-delete" circle></el-button>
          <!--<el-button size="mini" type="warning" icon="el-icon-star-off" circle></el-button>-->
          <el-button size="mini"
                     :plain="true"
                     type="success"
                     icon="el-icon-check"
                     @click="selectCourseOpen(courseList.row)"
                     v-if="(user||{}).roleName[0]==='学生'"
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

    <!--添加课程对话框-->
    <el-dialog title="添加课程" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="课程名" :label-width="formLabelWidth">
          <el-input v-model="insertform.courseName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="课程描述" :label-width="formLabelWidth">
          <el-input v-model="insertform.remark" autocomplete="off"></el-input>
        </el-form-item>

      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertCourse()">确 定</el-button>
      </div>
    </el-dialog>


    <el-dialog title="更新课程" :visible.sync="updatedialogFormVisible">
      <el-form :model="updateform">
        <el-form-item label="课程名" :label-width="formLabelWidth">
          <el-input v-model="updateform.courseName" autocomplete="off" disabled="disabled"></el-input>
        </el-form-item>


        <el-form-item label="专业" :label-width="formLabelWidth">
          <el-input v-model="updateform.specDO.specName" autocomplete="on" disabled="disabled"></el-input>
        </el-form-item>


        <el-form-item label="任课教师" :label-width="formLabelWidth">
          <el-input v-model="updateform.courseTeacher" autocomplete="on"></el-input>
        </el-form-item>

        <el-form-item label="最大人数" :label-width="formLabelWidth">
          <el-input v-model="updateform.maxNum" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="上课地点" :label-width="formLabelWidth">
          <el-input v-model="updateform.courseAddress" autocomplete="off"></el-input>
        </el-form-item>


        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="updateform.remark" autocomplete="off"></el-input>
        </el-form-item>

        <div v-for="(value,index) in updateform.courseTimeList">
          <el-form-item label="" :label-width="formLabelWidth">
            <h4>第 {{index+1}}次课:周 {{ value.weekday+1 }} 第 {{ parseInt(value.startLesson )+1 }} -
              {{parseInt(value.endLesson )+1 }} 节 </h4>
            <el-row style="margin-bottom: 10px;">
              新时间：
              <el-select v-model="updateform.courseTimeList[index].weekday">
                <el-option v-for="(item,weekdayindex) in selectWeekDayOptionList" :label="item.label"
                           :value="item.value" :key="weekdayindex"></el-option>
              </el-select>
            </el-row>
            <el-row>
              <el-col :span="1">
                第
              </el-col>
              <el-col :span="8">
                <el-select @change="startLessonChange(index)"
                           v-model="updateform.courseTimeList[index].startLesson">
                  <el-option v-for="(item,startindex) in selectOptionList"
                             :label="item.label" :value="item.value" :key="startindex"></el-option>
                </el-select>
              </el-col>
              <el-col :span="1" style="text-align: center"><strong>-</strong></el-col>
              <el-col :span="8">
                <el-select @change="endLessonChange(index)"
                           v-model="updateform.courseTimeList[index].endLesson">
                  <el-option v-for="(item,endindex) in selectOptionList" :key="endindex"
                             :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="1">
                节
              </el-col>
            </el-row>
          </el-form-item>
        </div>
        <div style="text-align: center;margin-bottom: 30px">
          <el-button @click="addForm(updateform.courseId)"
                     :plain="true" type="danger" icon="el-icon-circle-plus-outline" circle>
          </el-button>
          <el-button @click="minusForm()"
                     :plain="true" type="info" icon="el-icon-remove-outline" circle>
          </el-button>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateCourse()">确 定</el-button>
      </div>
    </el-dialog>
    <!--删除框-->
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
    name: "course",
    data() {
      return {
        query: "",
        fieldName: "",
        //列表
        courseList: [],
        selectedCourseList: [],
        collegeList: [],
        specIdValue: "",
        total: -1,
        pagenum: 1,
        pagesize: 100,

        //对话框属性
        updatedialogFormVisible: false,
        insertdialogFormVisible: false,
        deletedialogFormVisible: false,
        formLabelWidth: '120px',
        insertform: {},
        updateform: {
          courseName: "",
          specDO: {specName: ""},
          courseTeacher: "",
          maxNum: 0,
          courseAddress: "",
          remark: ""
        },
        menudata: [],
        //树默认选中节点
        defaultcheckList: [],
        user: {},

        selectOptionList: [
          {
            label: "1",
            value: 0
          },
          {
            label: "2",
            value: 1
          },
          {
            label: "3",
            value: 2
          },
          {
            label: "4",
            value: 3
          },
          {
            label: "5",
            value: 4
          },
          {
            label: "6",
            value: 5
          },
          {
            label: "7",
            value: 6
          },
          {
            label: "8",
            value: 7
          },
        ],

        selectWeekDayOptionList: [
          {
            label: "星期一",
            value: 0
          },
          {
            label: "星期二",
            value: 1
          },
          {
            label: "星期三",
            value: 2
          },
          {
            label: "星期四",
            value: 3
          },
          {
            label: "星期五",
            value: 4
          },
        ]
      }
    },
    filters: {
      numToStr(num) {
        num = num.toString()
        return num
      },
    },
    created() {
      this.user = JSON.parse(sessionStorage.getItem('user'))
      this.getCourseList();
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
        this.collegeList = JSON.parse(
          JSON.stringify(this.collegeList)
            .replace(/collegeName/g, 'label')
            .replace(/specName/g, 'label'))
        console.log(this.collegeList)
      },
      //获取course列表
      async getCourseList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        const res = await this.$http
          .get(`courses/?page=${this.pagenum}&limit=${this.pagesize}`)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.courseList = data;
          // this.courseList.speDOdata=JSON.stringify(this.courseList.specDO)
          console.log(data)
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
        if (this.user.roleName[0] == '学生') {
          const selecteddata = await this.$http
            .get(`scores/?fieldValue=${this.user.sid}&fieldName=studentId`)
          this.selectedCourseList = selecteddata.data.data
        }

      },
      //打开添加course对话框
      async openInsertCourseForm() {
        this.insertdialogFormVisible = true;
      },
      //添加course
      async insertCourse() {
        const res = await this.$http.post('courses/', this.insertform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("添加成功!")
          this.getCourseList();
          this.insertform = {}
        }
        else {
          this.$message.error("添加失败!")
        }
        this.insertdialogFormVisible = false;
      },
      //打开更新对话框
      async openUpdateCourseForm(course) {
        this.updatedialogFormVisible = true;
        // 选中的menus传到对话框
        this.updateform = course;
      },
      //更新course
      async updateCourse() {
        for (let i = 0; i < this.updateform.courseTimeList.length; i++) {
          for (let j = i + 1; j < this.updateform.courseTimeList.length; j++) {
            if (this.updateform.courseTimeList[i].weekday === this.updateform.courseTimeList[j].weekday) {
              let max = this.updateform.courseTimeList[i]
              if (this.updateform.courseTimeList[i].endLesson < this.updateform.courseTimeList[j].endLesson) {
                if (parseInt(this.updateform.courseTimeList[j].startLesson) <= parseInt(this.updateform.courseTimeList[i].endLesson)) {
                  this.$message.error("课程时间重复！请重新输入")
                  return
                }
              }
              else {
                if (parseInt(this.updateform.courseTimeList[i].startLesson) <= parseInt(this.updateform.courseTimeList[j].endLesson)) {
                  this.$message.error("课程时间重复！请重新输入")
                  return
                }
              }
            }
          }
        }

        console.log(this.updateform)
        this.updatedialogFormVisible = false;
        const res = await this.$http.patch('courses/' + this.updateform.courseId, this.updateform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getCourseList();
          this.updateform = {
            courseName: "",
            specDO: {specName: ""},
            courseTeacher: "",
            maxNum: 0,
            courseAddress: "",
            remark: ""
          }
        }
        else {
          this.$message.error("更新失败!")
        }
      },
      async openDeleteCourseForm(Id) {
        this.deletedialogFormVisible = true;
        this.deleteId = Id
      },
      async deleteCourseForm() {
        this.deletedialogFormVisible = false;
        let courseId = this.deleteId
        const res = await this.$http.delete('courses/' + courseId)
        this.deleteId = -1;
        const {status, msg} = res.data
        console.log(res)
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getCourseList();
          this.updateform = {
            courseName: "",
            specDO: {specName: ""},
            courseTeacher: "",
            maxNum: 0,
            courseAddress: "",
            remark: ""
          };
        }
        else {
          this.$message.error("更新失败!")
        }
      },
      handleChange(value) {
      },
      //根据专业搜索课程
      async searchCourse() {
        const res = await this.$http
          .get(`courses/?page=${this.pagenum}&limit=${this.pagesize}&fieldValue=${this.specIdValue[1]}&fieldName=specId`)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.courseList = data;
          this.total = data.length
          this.$message.success(msg)
        }
        else {
          this.$message.error(msg)
        }
      },
      openInfoCourseForm(course) {
        let remark
        let data = ['课程名：' + course.courseName,
          '学期：' + course.term,
          '任课老师：' + course.courseTeacher,
          '上课地点：' + course.courseAddress,
          '备注：' + (course.remark || '无'),];
        //2.新建newDatas数组
        let newDatas = [];
        const h = this.$createElement;
        //3.通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
        for (let i in data) {
          //4.将data数据push进newDatas数组中
          newDatas.push(h('p', null, data[i]));
        }
        this.$alert(h('div', null, newDatas), '课程详情', {
          confirmButtonText: '确定',
        });
      },
      //学生选课
      selectCourseOpen(course) {
        console.log(course)
        this.$confirm('是否添加该课程?', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(async () => {
          if (course.studentNum === course.maxNum) {
            this.$message.error("课程人数已满")
            return
          }
          // console.log(this.selectedCourseList,course.courseId)
          for (let i = 0; i < this.selectedCourseList.length; i++) {
            if (course.courseId === this.selectedCourseList[i].courseId) {
              this.$message.error("不能重复选择课程")
              return
            }
          }
          var selectcoursedata = {
            studentId: this.user.sid,
            studentName: this.user.realname,
            courseId: course.courseId,
            teacherId: course.teacherId
          }
          // console.log(selectcoursedata)
          const res = await this.$http.post('scores/', selectcoursedata)
          const {status, msg, data} = res.data
          if (status === 200) {
            this.$message.success("选择课程成功!");
          }
          else {
            this.$message.error("添加失败!")
          }
          this.getCourseList()
        })
      },

      endLessonChange(index) {
        if (this.updateform.courseTimeList[index].startLesson > this.updateform.courseTimeList[index].endLesson) {
          this.$message.error("结束节不能小于开始节！")
          this.updateform.courseTimeList[index].endLesson = this.updateform.courseTimeList[index].startLesson
        }
      },
      startLessonChange(index) {
        if (this.updateform.courseTimeList[index].startLesson > this.updateform.courseTimeList[index].endLesson) {
          this.updateform.courseTimeList[index].endLesson = this.updateform.courseTimeList[index].startLesson
        }
      },

      addForm(courseId) {
        this.updateform.courseTimeList.push({
          courseId: courseId,
          weekday: 0,
          endLesson: 0,
          startLesson: 0,
        })
      },
      minusForm() {
        this.updateform.courseTimeList.pop();
      },

      //复选框单选（待做）
      checkGroupNode() {
      }
    }
  }
</script>

<style scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

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

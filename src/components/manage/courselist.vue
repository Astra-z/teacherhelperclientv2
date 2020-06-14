<template>
  <el-card class="box-card">
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>管理</el-breadcrumb-item>
    <el-breadcrumb-item>课程表查看</el-breadcrumb-item>
  </el-breadcrumb><br>
  <div class="class-table" v-model="data">
    <div class="table-wrapper">
      <div class="tabel-container">
        <table>
          <thead>
            <tr>
              <th>时间</th>
              <th v-for="(weekNum, weekIndex) in classTableData.courses.length" :key="weekIndex"> {{'周' + digital2Chinese(weekIndex+1, 'week')}}</th>
            </tr>
          </thead>
          <tbody>
          <tr  v-for="(lesson, lessonIndex) in classTableData.lessons" :key="lessonIndex">
            <td>
              <p>{{'第' + digital2Chinese(lessonIndex+1) + "节"}}</p>
              <p class="period">{{ lesson }}</p>
            </td>
            <!--(course[lessonIndex]||{}).courseDisplay-->
            <td @click="openMessage((course[lessonIndex]||{}))"
                :rowspan="(course[lessonIndex]||{}).courseSpan"
                v-show="(course[lessonIndex]||{}).courseDisplay"
                v-for="(course, courseIndex) in classTableData.courses" :key="courseIndex">
              <!--数组中的有些东西不是对象导致取不到.courseName 因此要加||{}-->
              <div >
                {{(course[lessonIndex]||{}).courseName||'-'}}
                <p>{{ (course[lessonIndex]||{}).courseAddress }}</p>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  </el-card>
</template>

<script>

  export default {
    data() {
      return {
        user:{},
        classTableData: {
          lessons: [
            '08:00-09:00',
            '09:00-10:00',
            '10:00-11:00',
            '11:00-12:00',
            '13:00-14:00',
            '14:00-15:00',
            '15:00-16:00',
            '16:00-17:00'
          ],
          courses:[
            [], [],[], [],[],
            ],
        },
        //模拟数据
        data:[
          // {
          //   courseId:1,
          //   courseName:'高等数学',
          //   courseTeacher:'张三',
          //   weekday: 0,
          //   courseStartTime: 0,
          //   courseEndTime: 1,
          //   courseAdress:'3B201',
          // },
          // {
          //   courseId:2,
          //   courseName:'计算机',
          //   courseTeacher:'张三',
          //   weekday: 0,
          //   courseStartTime: 2,
          //   courseEndTime: 4,
          //   courseAdress:'1A502',
          // },
          // {
          //   courseId:3,
          //   courseName:'大学英语',
          //   courseTeacher:'张三',
          //   weekday: 0,
          //   courseStartTime: 6,
          //   courseEndTime: 7,
          //   courseAdress:'3G201',
          // },
          // {
          //   courseId:1,
          //   courseName:'高等数学',
          //   courseTeacher:'张三',
          //   weekday: 4,
          //   courseStartTime: 3,
          //   courseEndTime: 5,
          //   courseAdress:'3B201',
          // },
          // {
          //   courseId:1,
          //   courseName:'高等数学',
          //   courseTeacher:'张三',
          //   weekday: 1,
          //   courseStartTime: 1,
          //   courseEndTime: 3,
          //   courseAdress:'3B201',
          // },
        ]
      };
    },
    created() {
      this.user=JSON.parse(sessionStorage.getItem('user'))
      this.createCourseList();
    },
    methods: {
      /**
       * 数字转中文
       * @param {Number} num 需要转换的数字
       * @param {String} identifier 标识符
       * @returns {String} 转换后的中文
       */
      digital2Chinese(num, identifier) {
        const character = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
        return character[num];
      },

      async createCourseList(){
        //初始化classTableData
        let courses=this.classTableData.courses
        for(let i=0 ;i< 5; i++) {
          for (let j = 0; j < 8; j++) {
            courses[i].push({})
            courses[i][j].courseDisplay = true
          }
        }

        if(this.user.roleName[0]==='学生')
        {
          var res= await this.$http.get('courses/getMyCourse/'+this.user.sid)
        }
        else if (this.user.roleName[0]==='教师'){
          var res= await this.$http.get(`courses/?fieldValue=${this.user.sid}&fieldName=teacherId`)
        }

        const {status,msg,data}=res.data
        if(status!==200)
          return;
        let count=0;
        for(let i=0;i<data.length;i++){
          if (data[i].courseTimeList.length>0){
            for (let j = 0; j < data[i].courseTimeList.length; j++) {
              //!!!!vue对直接赋值数组的操作不会监听，因此如果写成this.data[count]={}会发生
              //数据改变了但是vue不进行渲染的情况
              this.data.push({})
              this.data[count].courseId=data[i].courseId
              this.data[count].weekday=data[i].courseTimeList[j].weekday
              this.data[count].courseStartTime=data[i].courseTimeList[j].startLesson
              this.data[count].courseEndTime=data[i].courseTimeList[j].endLesson
              this.data[count].courseName=data[i].courseName
              this.data[count].courseAddress=data[i].courseAddress
              this.data[count].courseTeacher=data[i].courseTeacher
              count++;
            }
          }
        }

        //放入后台传的数据
        for(let i=0;i<this.data.length;i++) {
          if (this.data[i] != null) {
            let n = this.data[i].courseStartTime, m = this.data[i].weekday;
            this.classTableData.courses[m][n] = this.data[i]
          }
        }

        //合并单元格
        for(let i=0;i<courses.length;i++){
          for(let j=0;j<courses[i].length;j++){
            if(courses[i][j].hasOwnProperty('courseStartTime')){
              courses[i][j].courseSpan=courses[i][j].courseEndTime-courses[i][j].courseStartTime+1
              courses[i][j].courseDisplay=true;
              let k=courses[i][j].courseSpan
              for(let m=j+1;m<j+k;m++){
                courses[i][m]={}
                courses[i][m].courseSpan=1
                courses[i][m].courseDisplay=false
              }
              j=j+k-1;//跳过已经不显示的单元格
            }
          }
        }
        // console.log(courses)
      },
      openMessage(course){
        this.$message.success(course.courseName)
        this.$router.push({
          name:'coursedetail',
          params:{
            courseId: course.courseId
          }
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .class-table {
    .table-wrapper {
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .tabel-container {
      margin: 7px;
      table {
        border-radius: 2px;
        border: 1px solid #ccc;
        table-layout: fixed;
        width: 100%;

        thead {
          background-color: #67a1ff;
          th {
            border: 1px solid #ccc;
            color: #fff;
            line-height: 17px;
            font-weight: normal;
          }
        }
        tbody {
          background-color: #eaf2ff;
          td {
            border: 1px solid #ccc;
            color: #677998;
            line-height: 12px;
          }
        }
        th,
        td {
          width: 60px;
          padding: 12px 2px;
          font-size: 12px;
          text-align: center;
        }

        tr td:first-child {
          color: #333;
          .period {
            font-size: 8px;
          }
        }
      }
    }
  }
</style>

<template>
  <div class="class-table">
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
            <td :rowspan="(course[lessonIndex]||{}).courseSpan"
                v-show="(course[lessonIndex]||{}).courseDisplay"
                v-for="(course, courseIndex) in classTableData.courses" :key="courseIndex">
              <!--数组中的有些东西不是对象导致取不到.courseName 因此要加||{}-->
              {{(course[lessonIndex]||{}).courseName||'-'}}
              <p >{{ (course[lessonIndex]||{}).courseAdress||'' }}</p>
            </td>

          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
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
            ]
        },
        //模拟数据
        data:[
          {
            courseId:1,
            courseName:'高等数学',
            courseTeacher:'张三',
            weekday: 1,
            courseStartTime: 0,
            courseEndTime: 1,
            courseAdress:'3B201',
          },
          {
            courseId:2,
            courseName:'计算机',
            courseTeacher:'张三',
            weekday: 1,
            courseStartTime: 2,
            courseEndTime: 4,
            courseAdress:'1A502',
          },
          {
            courseId:3,
            courseName:'大学英语',
            courseTeacher:'张三',
            weekday: 1,
            courseStartTime: 6,
            courseEndTime: 7,
            courseAdress:'3G201',
          },
          {
            courseId:1,
            courseName:'高等数学',
            courseTeacher:'张三',
            weekday: 5,
            courseStartTime: 3,
            courseEndTime: 5,
            courseAdress:'3B201',
          },
          {
            courseId:1,
            courseName:'高等数学',
            courseTeacher:'张三',
            weekday: 2,
            courseStartTime: 1,
            courseEndTime: 3,
            courseAdress:'3B201',
          },
        ]
      };
    },
    created() {
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

      createCourseList(){
        //初始化classTableData
        var courses=this.classTableData.courses
        for(var i=0;i<5;i++) {
          for (var j = 0; j <8; j++) {
            courses[i][j] ={}
            courses[i][j].courseDisplay = true
          }
        }

        //放入后台传的数据
        var data=this.data;
        for(var i=0;i<data.length;i++) {
          if (data[i] != null) {
            let n = data[i].courseStartTime, m = data[i].weekday - 1;
            this.classTableData.courses[m][n] = data[i]
          }
        }

        //合并单元格
        for(var i=0;i<courses.length;i++){
          for(var j=0;j<courses[i].length;j++){
            if(courses[i][j].hasOwnProperty('courseStartTime')){
              courses[i][j].courseSpan=courses[i][j].courseEndTime-courses[i][j].courseStartTime+1
              courses[i][j].courseDisplay=true;
              let k=courses[i][j].courseSpan
              for(var m=j+1;m<j+k;m++){
                courses[i][m]={}
                courses[i][m].courseSpan=1
                courses[i][m].courseDisplay=false
              }
              j=j+k-1;//跳过已经不显示的单元格
            }
          }
        }


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

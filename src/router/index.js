import Vue from 'vue'
import Router from 'vue-router'
// import Login from '../components/login/login.vue'
//webpack 使用@-> src
import Login from '../components/login/login.vue'
import Home from '../components/home/home.vue'
import Users from '../components/manage/user.vue'
import Roles from '../components/manage/role.vue'
import Perms from '../components/manage/menu.vue'
import CourseList from '../components/manage/courselist.vue'
import College from '../components/manage/college.vue'
import Course from '../components/manage/course.vue'
import CourseAdd from '../components/manage/courseadd.vue'
import CourseDetail from  '../components/manage/coursedetail.vue'
import Note from  '../components/manage/note.vue'
import Score from '../components/manage/score.vue'
import StudentMentor from '../components/manage/notesend.vue'
import Info from '../components/manage/studentinfo.vue'
import Jump from '../components/manage/jumpinfo.vue'
import Weather from '../components/manage/weather.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login,
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children:[
        {
          name:'user',
          path:'/user',
          component:Users,
        },
        {
          name:'role',
          path:'/role',
          component:Roles
        },
        {
          name:'menu',
          path:'/menu',
          component:Perms
        },
        {
          name:'courselist',
          path:'/courselist',
          component:CourseList
        },
        {
          name:'college',
          path:'/college',
          component:College
        },
        {
          name:'course',
          path:'/course',
          component:Course
        },
        {
          name:'courseadd',
          path:'/courseadd',
          component:CourseAdd
        },
        {
          name:'coursedetail',
          path:'/coursedetail/:courseId',
          component:CourseDetail
        },
        {
          name:'note',
          path:'/note',
          component:Note
        },
        {
          name:'score',
          path:'/score',
          component:Score
        },
        {
          name:'notesend',
          path:'/studentmentor',
          component:StudentMentor
        },
        {
          name:'studentinfo',
          path:'/studentinfo/:studentId',
          component:Info
        },
        {
          name:'jumpto',
          path:'/jumpto',
          component:Jump
        },
        {
          name:'weather',
          path:'/weather',
          component:Weather
        },
      ]
    }
  ]
})

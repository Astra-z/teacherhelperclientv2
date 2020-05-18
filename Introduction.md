1.scr/
2.build/ webpack相关代码
3.config/ 本地服务器相关代码

一、登录模块创建
1.component里面创建一个登录目录用于存放所有登录模块的东西
2.router里面注册这个组件 具体：index.js里面引入component
  routes: [{
        name: 'login',
        path: '/123',
        component: Login,
      }
    ]
    其中name是路由选项里面的名字
    path是url地址
    component需export default的Login模块

3.样式调整
  height是一层一层往下的所以不止要调整body html height还要调整第一层app的height
  /*弹性盒子布局：flex
      just水平居中
      align垂直居中*/

4.提示框
// function (response) { 这样的话this指向的是axios不是vue
//使用箭头函数自动指向上层的this这里也就是vue的this
 this.$message.success(msg);使用$代表Vue的属性或者方法

5.配置home路由
  1.js编程式导航this.$router.push({name:'home'})
  2.App.vue <router-viewer>使用(看在哪里使用路由)
  3.新建home组件
  4.router的index.js配置routers

6.设置拦截
  利用localStorage.setItem('token',data.token)
  login里面存储token信息
  如果有token信息则显示home 没有就跳转到login
    //获取token
          //if token 继续渲染
          //token 跳到登录
        //newVue有实例之前自动触发
        beforeCreate(){
          const token =localStorage.getItem('token')
          if(!token){
            this.$router.push({name:'login'})
          }
        }

7.设置user组件
  1. this.$http.defaults.headers.common['Authorization'] = token;设置请求头
  2.const {data:{pagenum,total,users},meta:{msg,status}}=res.data
    const里面的属性可以直接用 如this.userList=users
  3.设置属性
     userList: [],
     total:-1,
     pagenum:1,
     pagesize:5,

<template>
    <div class="formLogindiv">
      <div class="topbar">上海大学计算机学院老年教师工作提醒簿平台V2.0.1</div>
      <el-form class="formLogin" label-position="top" label-width="80px" :model="formlogin">
        <h2 style="text-align: center;font-size:22px;">用户登录</h2>
        <el-form-item label="用户名">
          <el-input v-model="formlogin.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <!--el-input必须使用keyup.enter.native-->
          <el-input  type="password" v-model="formlogin.password" @keyup.enter.native="loginhandler"></el-input>
        </el-form-item>

        <el-button
          @click.prevent="loginhandler"
          class="form_button" type="primary">登录</el-button>
      </el-form>
      <div class="footer">
        <div>Copyright © 2020 All Rights Reserved Powered By Group Three</div>
      </div>
    </div>

</template>

<script>
    export default {

        name: "login",
        //Componet组件传递数据需要用data()函数return对象
        data(){
          return{
            formlogin:{
              username:"",
              password:"",
            }
          }
        },
        methods:{
            async loginhandler(){
            //让异步操作看起来像同步操作-》（利用async和await）
            //1.找到异步操作有结果的代码 在这行代码的前面+await 修饰符
            //2.找到距离异步操作有结果的代码最近的方法前面+async 修饰符
             const response=await this.$http.post('dologin',this.formlogin)
              // function (response) { 这样的话this指向的是axios不是vue
              //使用箭头函数自动指向上层的this这里也就是vue的this

                  const {data,msg,status}=response.data
              // console.log(response)
              // console.log(user)
              // console.log(Authorization)
             if(status===200){
                //利用路由跳转路由name为home的组件
                localStorage.setItem('Authorization',data.Authorization)
                localStorage.setItem('user',JSON.stringify(data.user))
                console.log(localStorage.getItem('user'))
                this.$router.push({name:'home'})
                this.$message.success(msg);
             }
             else{
               this.$message.warning(msg);
             }

            // this.$http.post('login',this.formlogin).then(
            //   // function (response) { 这样的话this指向的是axios不是vue
            //   //使用箭头函数自动指向上层的this这里也就是vue的this
            //     (response)=> {
            //     const {data,meta:{msg,status}}=response.data
            //
            //     if(status===200){
            //       // console.log(data)
            //       // console.log(this)
            //       //利用路由跳转路由name为home的组件
            //       this.$router.push({name:'home'})
            //       this.$message.success(msg);
            //     }
            //     else{
            //       this.$message.warning(msg);
            //     }
            //
            //   }
            // )
          }
        }
    }
</script>

<style scoped>
  .formLogindiv{
    /*
    css分类器 .是class #是id
    空格是父子关系 逗号是元素并列关系
    */
    height: 100%;
    background-image: url("/static/img/login-bg.jpg");
    background-size: cover;
    background-repeat: no-repeat;

    /*弹性盒子布局：flex
    just水平居中
    align垂直居中*/
    display: flex;
    justify-content: left;
    align-items: center;
  }
  .formLogindiv .formLogin{
    background-color: rgba(255, 255, 255, 0.8);
    width: 280px;
    padding: 0 40px 30px 40px;
    border-radius: 5px;
    margin-left: 20px;
  }
  .form_button{
    width: 100%;
  }
  .topbar {
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 9;
    background: url("/static/img/headerbg.jpg") repeat-x;
    height: 95px;
    line-height: 95px;
    text-align: center;
    font-family: cursive;
    color: #fff;
    font-size: 24px;
  }
  .footer {
    font-size: 12px;
    position: absolute;
    bottom: 0;
    width: 100%;
    background: url("/static/img/footerbg.jpg") repeat-x;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #fff;
  }
  .el-button--primary {
    color: #FFF;
    background-color: #275085;
    border-color: #275085;
    opacity: 1;
}
</style>

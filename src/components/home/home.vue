<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
      <el-col :span="4">
        <div class="grid-content bg-purple" >
          <img src="../../assets/home.jpg" height="60px" alt="logo">
        </div>
      </el-col>
      <el-col :span="18" class="middle">
        <h3>老年教师管理系统</h3>
      </el-col>
      <el-col :span="2">
        <div class="grid-content bg-purple">
          <a class="loginout" @click.prevent="handlerSignout">退出</a>
        </div>
      </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px" >
        <!--标签需要用v-bind绑定模式不然console会报错-->
        <el-menu class="aside_menu"
          :unique-opened="true"
          :router="true">
          <!--1-->
          <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.text}}</span>
            </template>
            <el-menu-item class="aside_menu_item" :index="item2.url"
                          v-for="(item2,index) in item1.children" :key="index">
              <i class="el-icon-menu"></i>
              <span>{{item2.text}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        //获取token
        //if token 继续渲染
        //token 跳到登录
      //newVue有实例之前自动触发
      data(){
        return {
          user: [],
          menus: [],
        }
      },
      beforeCreate(){
        const Authorization =localStorage.getItem('Authorization')
        if(!Authorization){
          this.$router.push({name:'login'})
        }
      },
      created(){
        this.getUserMenu();
      },
      methods:{
        handlerSignout(){
          localStorage.clear()
          this.$message.success("退出成功")
          this.$router.push({name:'login'})
        },
        async getUserMenu(){
          //获取用户菜单
          const username=JSON.parse(localStorage.getItem('user')).username
          const res=await this.$http.get(`/menus/getUserMenus?username=`+username);
          this.menus=res.data.data.children;
          console.log(this.menus)
        }
      }
    }
</script>

<style scoped>
  .container{
    height: 100%;
  }
  .header{
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;
    background-color: #32c787;
  }
  .aside{
    height: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    background-color: #f6f6f6;
  }
  .aside .aside_menu{
    border-radius: 6px;
    height: 100%;
  }

  .main{
    background-color: #f6f6f6;
  }
  .middle{
    text-align: center;
    /*文字居中*/
  }
  .loginout{
    /*垂直居中*/
    line-height: 60px;
    text-decoration: none;
  }

</style>

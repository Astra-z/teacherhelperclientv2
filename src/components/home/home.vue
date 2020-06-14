<template>
  <el-container class="container">
    <el-header class="header">
      <el-row>
      <!--<el-col :span="4">-->
        <!--<div class="grid-content bg-purple" >-->
          <!--&lt;!&ndash;<img src="../../assets/home.jpg" height="60px" alt="logo">&ndash;&gt;-->
        <!--</div>-->
      <!--</el-col>-->
      <el-col :span="23" class="middle">
        <h3>老年教师管理系统</h3>
      </el-col>
      <el-col :span="1">
        <div class="grid-content bg-purple">
          <a class="loginout" @click.prevent="handlerSignout">退出</a>
        </div>
      </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside class="aside" width="180px" >
        <!--标签需要用v-bind绑定模式不然console会报错-->
        <el-menu class="aside_menu"
          :unique-opened="true"
          :router="true">
          <!--导航-->
          <el-submenu :index="''+item1.order" v-for="(item1,index) in menus" :key="index">
            <template slot="title">
              <i :class="item1.icon!==null?item1.icon: defaultclass"></i>
              <span>{{item1.text}}</span>
            </template>
            <el-menu-item class="aside_menu_item" :index="'/'+item2.url"
                          v-for="(item2,index) in item1.children" :key="index">
              <i class="el-icon-menu"></i>
              <span>{{item2.text}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>

      </el-aside>
      <el-main class="main">
        <!--<el-button-->
          <!--@click.prevent="websocketsend"-->
          <!--class="form_button" type="primary">websocketsend</el-button>-->
        <router-view v-if="isRouterAlive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    import moment from 'moment'
    import Note from '../manage/note.vue'
    export default {
      provide() {
        return {
          reload: this.reload
        };
      },
        //获取token
        //if token 继续渲染
        //token 跳到登录
      //newVue有实例之前自动触发
      data(){
        return {
          user: [],
          menus: [],
          defaultclass: "el-icon-location",
          websock:{},
          isRouterAlive: true
        }
      },
      beforeCreate(){
        const Authorization =sessionStorage.getItem('Authorization')
        if(!Authorization){
          this.$router.push({name:'login'})
        }
      },
      created(){
        this.user =JSON.parse(sessionStorage.getItem('user'))
        this.getUserMenu()
        this.initWebSocket()
        console.log(this.user)
      },
      methods:{
        initWebSocket: function () {
          // WebSocket与普通的请求所用协议有所不同，ws等同于http，wss等同于https
          this.websock = new WebSocket("ws://127.0.0.1:8888/webSocket/"+this.user.userId);
          this.websock.onopen = this.websocketonopen;
          this.websock.onerror = this.websocketonerror;
          this.websock.onmessage = this.websocketonmessage;
          this.websock.onclose = this.websocketclose;
        },
        websocketonopen: function () {
          console.log("WebSocket连接成功");
          this.websocketsend();
        },
        websocketonerror: function (e) {
          console.log("WebSocket连接发生错误");
        },
        websocketonmessage: function (e) {
          const message=JSON.parse(e.data)

          for (let i = 0; i <message.length ; i++) {
            let remark
            if(message[i].hasOwnProperty('remark'))
              remark=message[i].remark;
            else
              remark="无"
            let now=new Date().getTime()
            let Time=moment(message[i].endTime).format('YYYY-MM-DD HH:mm:ss')
            let note=''
            if(now-message[i].endTime>6000)
              note='(已过期)'
            let data = ['提醒名：'+message[i].noteName,
              '备注：'+remark,
              '开始时间：'+Time,
            ];
            //2.新建newDatas数组
            let newDatas = [];
            const h = this.$createElement;
            //3.通过循环data数组，调用h方法，将每项值传给h,h('标签名',样式,具体内容)
            for(let i in data){
              //4.将data数据push进newDatas数组中
              newDatas.push(h('p',null,data[i]));
            }
            console.log(h)
            this.$notify.info({
              title: '提醒消息'+note,
              message: h('div',null, newDatas),
              duration: 0
            });
            this.reload();
          }
        },
        websocketclose: function (e) {
          console.log("connection closed (" + e.code + ")");
        },
        async websocketsend(){
          console.log(this.user.userId)
          await this.$http.get(`webSocketSend/?userId=${this.user.userId}`)
        },

        async handlerSignout(){
          this.websock.close()
          sessionStorage.clear()
          this.$message.success("退出成功")
          this.$router.push({name:'login'})
        },
        async getUserMenu(){
          //获取用户菜单
          const username=JSON.parse(sessionStorage.getItem('user')).username
          const res=await this.$http.get(`/menus/getUserMenus?username=`+username);
          this.menus=res.data.data.children;
          // console.log(this.menus)
          // this.sortMenus(this.menus);
        },
        //排序菜单
        // sortMenus(arr){
        //   var newarr=[]
        //   for(var i=0;i<arr.length;i++){
        //     for(var j=0;j<arr.length;j++){
        //       if(arr[j].order==(i+1).toString()){
        //         newarr.push(arr[j])
        //       }
        //     }
        //   }
        //   this.menus=[].concat(newarr)
        // }
        //刷新路由
        reload() {
          this.isRouterAlive = false;
          this.$nextTick(function() {
            this.isRouterAlive = true;
          });
        },

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
    height: 99%;
  }

  .main{
    background-color: #f6f6f6;
    height: 100%;
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

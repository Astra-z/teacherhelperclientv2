<template xmlns:slot-scope="http://www.w3.org/1999/XSL/Transform">
    <el-card class="box-card">
    <!--1.面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <br>

      <!--2.搜索-->
      <el-row>
        <el-col>
          <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
          <el-button type="success" plain>添加</el-button>
        </el-col>
      </el-row>

      <!--3.表格-->
      <el-table
        :data="userList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名"
          width="150">
        </el-table-column>
        <el-table-column
          prop="realname"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="sid"
          label="工号/学号">
        </el-table-column>

        <el-table-column
          prop="roleName"
          label="角色">
        </el-table-column>
        <el-table-column
          label="创建时间"
          width="200">
          <!--
          1.单元格中显示内容不是字符串需要给内容套上一个template
          2.每个组件都拥有一个独立的变量域，
          内层的template要使用外层的数据需要使用slot-scope指定数据源
          3.{{userList.row.create_time|fmtdate}}使用插值表达式
          4.row绑定的是数组中的每个对象
          5.slot-scope="userList"会自动找上级的数据源，因此写啥都行
          -->

          <template slot-scope="userList">
            {{userList.row.create_time|fmtdate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="msg_sate"
          label="用户状态">
          <template slot-scope="userList">
            <el-switch
              v-model="lock"
              @change="lockSwitch()"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="userList">
            <el-button size="mini" :plain="true" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" :plain="true" type="success" icon="el-icon-check" circle></el-button>
            <el-button size="mini" :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  <!--4.分页-->
</template>

<script>
    export default {
      data(){
        return{
          query:"",
          //用户列表
          userList: [],
          total:-1,
          pagenum:1,
          pagesize:5,

          lock:true,
        }
      },
      created(){
        this.getUserList();
      },
      methods:{
          async getUserList(){
            // query	查询参数	可以为空
            // pagenum	当前页码	不能为空
            // pagesize	每页显示条数	不能为空
            const res=await this.$http
              .get(`users/?page=${this.pagenum}&limit=${this.pagesize}`)
            const {data,status,msg}=res.data
            if(status===200){
                this.userList=data;
            }
            else{
              this.$message.error(msg);
            }
          },
        lockSwitch(){
            if(this.lock)
              this.lock=false;
            else
              this.lock=true;
        }
      }
    }
</script>

<style scoped>
  .box-card{
    height: 100%;
  }
  .input-with-select{
    width: 300px;
  }
</style>

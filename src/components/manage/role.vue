<template>
    <el-card class="box-card">
      <!--1.面包屑-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb><br>

      <!--2.搜索框-->
      <label>角色名：</label>
      <el-input class="input_text"
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="query">
        <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
      </el-input>

      <!--3.表格-->
      <el-table
        :data="roleList"
        style="width: 100%">
        <el-table-column
          prop="roleId"
          label="#"
          width="40">
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名"
          width="200">
        </el-table-column>
        <el-table-column
          prop="remark"
          label="描述"
        >
        </el-table-column>
        <el-table-column
          label="创建时间">
          <template slot-scope="roleList">
            {{roleList.row.createTime|fmtdate}}
          </template>
        </el-table-column>

        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="roleList">
            <el-button size="mini" :plain="true" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini" :plain="true" type="success" icon="el-icon-check" circle></el-button>
            <el-button size="mini" :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination style="text-align: center"
        background
        layout="prev, pager, next"
        :total="total">
      </el-pagination>


    </el-card>
</template>

<script>
    export default {
        name: "role",
      data() {
        return {
          query:"",
          fieldName:"",
          //用户列表
          roleList: [],
          total:-1,
          pagenum:1,
          pagesize:10,
        }
      },
      created(){
        this.getRoleList();
      },
      methods:{
        async getRoleList(){
          // query	查询参数	可以为空
          // pagenum	当前页码	不能为空
          // pagesize	每页显示条数	不能为空
          const res=await this.$http
            .get(`roles/?page=${this.pagenum}&limit=${this.pagesize}`)
          console.log(res)
          const {data,status,msg}=res.data
          if(status===200){
            this.roleList=data;
            this.total=data.length
          }
          else {
            this.$message.error(msg)
          }
        }
      }
    }
</script>

<style scoped>
  .box-card{
    height: 100%;
  }
  .input_text{
      width: 300px;
  }
  label{
    font-size: 15px;
  }
  /*.input_text .input_button{*/
      /*width: 70%;*/
     /*height: 50px;*/
  /*}*/
</style>

<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <br>

    <!--2.搜索框-->
    <label>权限名：</label>
    <el-input class="input_text"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="query">
      <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
    </el-input>
    <el-button type="success" plain @click="insertdialogFormVisible = true">添加</el-button>
    <!--添加权限对话框-->
    <el-dialog title="添加权限" :visible.sync="insertdialogFormVisible">
      <el-form :model="form">
        <el-form-item label="菜单名" :label-width="formLabelWidth">
          <el-input v-model="form.menuName" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="权限表" :label-width="formLabelWidth">
          <el-select v-model="form.menuURL" placeholder="请选择权限类型">
            <el-option label="学院" value="college"></el-option>
            <el-option label="课程" value="course"></el-option>
            <el-option label="上课时间" value="coursefrequency"></el-option>
            <el-option label="课程作业" value="coursehomework"></el-option>
            <el-option label="成绩" value="score"></el-option>
            <el-option label="专业" value="spec"></el-option>
            <el-option label="学生_导师" value="studentmentor"></el-option>
            <el-option label="用户" value="user"></el-option>
            <el-option label="提醒" value="note"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-select v-model="form.menuPerm" placeholder="请选择权限类型">
            <el-option label="添加" value=":add"></el-option>
            <el-option label="查看" value=":list"></el-option>
            <el-option label="更新" value=":update"></el-option>
            <el-option label="删除" value=":delete"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父节点" :label-width="formLabelWidth">
          <el-tree
            :data="menudata"
            show-checkbox
            :default-expand-all="false"
            node-key="id"
            ref="DeviceGroupTree"
            :highlight-current="true"
            :check-strictly="true"
            @check="checkGroupNode()"
            :props="{children: 'children',label: 'text'}" >
          </el-tree>
          <!--<el-input v-model="form.menuParentId" autocomplete="off"></el-input>-->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertdialogFormVisible = false;insertPermsList()">确 定</el-button>
      </div>
    </el-dialog>

    <!--更新信息对话框-->
    <el-dialog title="更新权限" :visible.sync="updatedialogFormVisible">
      <el-form :model="updateform">
        <el-form-item label="菜单名" :label-width="formLabelWidth">
          <el-input v-model="updateform.text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="url" :label-width="formLabelWidth">
          <el-input  v-model="updateform.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-input v-model="updateform.perms" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父节点" :label-width="formLabelWidth">
          <el-tree
            :data="menudata"
            show-checkbox
            :default-expand-all="false"
            node-key="id"
            ref="DeviceGroupTree"
            :highlight-current="true"
            :check-strictly="true"
            @check="checkGroupNode()"
            :props="{children: 'children',label: 'text'}" >
          </el-tree>
          <!--<el-input v-model="form.menuParentId" autocomplete="off"></el-input>-->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePermsList()">确 定</el-button>
      </div>
    </el-dialog>
    <!--信息表-->
    <el-table
      :data="menudata"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      :default-expand-all="false"
      :tree-props="{children: 'children', hasChildren: 'hasChildrens'}">
      <el-table-column
        prop="id"
        label="菜单ID"
        sortable
        width="120">
      </el-table-column>
      <el-table-column
        prop="text"
        label="菜单名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="url"
        label="url">
      </el-table-column>
      <el-table-column
        label="图标"
        width="80">
        <template slot-scope="menu">
          <i :class="menu.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="menu">
          <el-button size="mini"
                     @click="showUpdateMenusDia(menu.row)"
                     :plain="true" type="primary" icon="el-icon-edit" circle></el-button>
          <el-button size="mini" :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
  export default {
    name: "menu1",
    data() {
      return {
        menudata: [],
        query: "",
        //对话框属性
        form: {
          menuName: '',
          menuParentId:'',
          menuURL: '',
          menuPerm: '',
          // menuUrl:'',
          // menuType:0,
        },
        //更新对话框
        updateform: {
        },

        insertdialogFormVisible: false,
        updatedialogFormVisible:false,
        formLabelWidth: '120px'
      }
    },

    created() {
      this.getpermList();
    }
    ,
    methods: {

      showUpdateMenusDia(menus){
        this.updatedialogFormVisible=true;
        //选中的menus传到对话框
        this.updateform=menus;
        console.log(this.updateform)
      },
      //更新权限
      async updatePermsList(){

        if(this.$refs.DeviceGroupTree.getCheckedKeys().length>1){
          this.$message.error("最多添加一个父节点！")
          return
        }
        else if(this.$refs.DeviceGroupTree.getCheckedKeys()[0]===this.updateform.id){
          this.$message.error("父节点不能是自己！")
          return
        }

        var data={}
        data.menuName = this.updateform.text
        data.url=this.updateform.url
        data.perms = this.updateform.perms;
        data.parentId=this.$refs.DeviceGroupTree.getCheckedKeys()[0];
        if(data.parentId==null)
          data.parentId=0
        const res = await this.$http.patch('menus/'+this.updateform.id, data);
        const {status,msg} = res.data

        if (status === 200) {
          this.$message.success("更新成功！")
          this.getpermList();
          this.form = {}
        }
        else{
          this.$message.error("更新失败！")
        }
        this.updatedialogFormVisible=false;
      },
      //获取menulist
      async getpermList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        // const token=localStorage.getItem("Authorization")
        // this.$http.defaults.headers.common['Authorization'] = token;
        // const res=await this.$http
        //   .get(`menus/?page=${this.pagenum}&limit=${this.pagesize}`)
        const res = await this.$http.get(`menus/getAllMenus`)
        const {data: {children}, status, msg} = res.data
        if (status === 200) {
          this.menudata = children;
        }
        else {
          this.$message.error(msg)
        }
      },

      async insertPermsList() {
        //添加权限
        if(this.$refs.DeviceGroupTree.getCheckedKeys().length>1){
          this.$message.error("最多添加一个父节点！")
          return
        }
        var data={}
        data.menuName = this.form.menuName
        data.url=this.form.menuURL
        data.perms = this.form.menuURL + this.form.menuPerm;

        data.parentId=this.$refs.DeviceGroupTree.getCheckedKeys()[0];
        console.log(data.parentId)
        if(this.$refs.DeviceGroupTree.getCheckedKeys().length===0)
          data.parentId=0;
        const res = await
          this.$http.post('menus/', data);
        const {status,msg} = res.data
        if (status === 200) {
          this.$message.success("添加成功!")
          this.getpermList();
          this.form = {}
        }
        else{
          this.$message.error("添加失败!")
        }
      },
      //选中复选框
      checkGroupNode(){

      }
    },
  }

</script>

<style scoped>
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

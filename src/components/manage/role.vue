<template>
  <el-card class="box-card">
    <!--1.面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <br>
    <!--2.搜索框-->
    <label>角色名：</label>
    <el-input class="input_text"
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              v-model="query">
      <el-button class="input_button" slot="append" icon="el-icon-search" size="mini"></el-button>
    </el-input>
    <el-button type="success" plain @click="openInsertRoleForm()">添加</el-button>
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
          <el-button size="mini"
                     @click="openUpdateRoleForm(roleList.row)"
                     :plain="true" type="primary" icon="el-icon-edit" circle>
          </el-button>
          <el-button size="mini" :plain="true" type="success" icon="el-icon-check" circle></el-button>
          <el-button size="mini" :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--4.分页-->
    <el-pagination style="text-align: center"
                   background
                   layout="prev, pager, next"
                   :total="total">
    </el-pagination>

    <!--添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="insertdialogFormVisible">
      <el-form :model="insertform">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="insertform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="insertform.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" :label-width="formLabelWidth">
          <el-tree
            :data="menudata"
            show-checkbox
            :default-expand-all="false"
            node-key="id"
            ref="DeviceGroupTree"
            :highlight-current="true"
            :check-strictly="true"
            :default-checked-keys="defaultcheckList"
            @check="checkGroupNode()"
            :props="{children: 'children',label: 'text'}">
          </el-tree>
          <!--<el-input v-model="form.menuParentId" autocomplete="off"></el-input>-->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="insertdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="insertRole()">确 定</el-button>
      </div>
    </el-dialog>


    <!--更新角色对话框-->
    <el-dialog title="更新角色" :visible.sync="updatedialogFormVisible">
      <el-form :model="updateform">
        <el-form-item label="角色名" :label-width="formLabelWidth">
          <el-input v-model="updateform.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="updateform.remark" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" :label-width="formLabelWidth">
          <el-tree
            :data="menudata"
            show-checkbox
            :default-expand-all="false"
            node-key="id"
            ref="DeviceGroupTree"
            :highlight-current="true"
            :check-strictly="true"
            @check="checkGroupNode()"
            :props="{children: 'children',label: 'text'}">
          </el-tree>
          <!--<el-input v-model="form.menuParentId" autocomplete="off"></el-input>-->
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="updatedialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  export default {
    name: "role",
    data() {
      return {
        query: "",
        fieldName: "",
        //用户列表
        roleList: [],
        total: -1,
        pagenum: 1,
        pagesize: 10,

        //对话框属性
        updatedialogFormVisible: false,
        insertdialogFormVisible: false,
        formLabelWidth: '120px',
        insertform: {},
        updateform: {},
        menudata: [],
        //树默认选中节点
        defaultcheckList:[],
      }
    },
    created() {
      this.getRoleList();
    },
    methods: {
      //获取role列表
      async getRoleList() {
        // query	查询参数	可以为空
        // pagenum	当前页码	不能为空
        // pagesize	每页显示条数	不能为空
        const res = await this.$http
          .get(`roles/?page=${this.pagenum}&limit=${this.pagesize}`)
        console.log(res)
        const {data, status, msg} = res.data
        if (status === 200) {
          this.roleList = data;
          this.total = data.length
        }
        else {
          this.$message.error(msg)
        }
      },
      //打开添加role对话框
      async openInsertRoleForm() {
        this.insertdialogFormVisible = true;
        const res = await this.$http.get(`menus/getAllMenus`)
        const {data: {children}, status, msg} = res.data
        if (status === 200) {
          this.menudata = children;
          console.log(this.menudata);
        }
        else {
          this.$message.error(msg)
        }
      },
      //添加role
      async insertRole() {
        this.insertform.menuIdList = this.$refs.DeviceGroupTree.getCheckedKeys();
        if (this.insertform.menuIdList.length <= 0) {
          this.$message.error("至少选择一个权限！")
          return;
        }
        const res = await this.$http.post('roles/', this.insertform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("添加成功!")
          this.getRoleList();
          this.insertform = {}
        }
        else {
          this.$message.error("添加失败!")
        }
        this.insertdialogFormVisible = false;
      },
      //打开更新对话框
      async openUpdateRoleForm(role){
        this.updatedialogFormVisible=true;
        //选中的menus传到对话框
        this.updateform=role;
        //查找菜单
        const res = await this.$http.get(`menus/getAllMenus`)
        const {data: {children}, status, msg} = res.data
        if (status === 200) {
          this.menudata = children;
        }
        else {
          this.$message.error(msg)
        }
        //获得选中树形菜单

        this.defaultcheckList=role.menuIdList//清空数组
        this.$refs.DeviceGroupTree.setCheckedKeys(this.defaultcheckList);
        console.log(this.updateform)
      },
      //查找选中节点
      // findAllChildren(data, arr) {
      //   data.forEach((item, index) => {
      //     if(item.children.length !== 0) {
      //       this.findAllChildren(item.children, arr);
      //     }
      //     if(item.id!=0){//去除根节点
      //       arr.push(item.id);
      //     }
      //   })
      // },
      //更新role
      async updateRole() {
        this.updatedialogFormVisible = false;
        this.updateform.menuIdList = this.$refs.DeviceGroupTree.getCheckedKeys();
        if (this.updateform.menuIdList.length <= 0) {
          this.$message.error("至少选择一个权限！")
          return;
        }
        const res = await this.$http.patch('roles/'+this.updateform.roleId, this.updateform);
        const {status, msg} = res.data
        if (status === 200) {
          this.$message.success("更新成功!")
          this.getRoleList();
          this.updateform = {}
        }
        else {
          this.$message.error("更新失败!")
        }

      },
      //复选框单选（待做）
      checkGroupNode() {
      }
    }
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

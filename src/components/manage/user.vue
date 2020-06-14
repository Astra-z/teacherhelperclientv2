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
          <el-button
            @click="openInsertUserForm"
            type="success" plain>添加</el-button>
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
            <el-button size="mini"
                       @click="openUpdateUserForm(userList.row)"
                       :plain="true" type="primary" icon="el-icon-edit" circle></el-button>
            <el-button size="mini"
                       @click="openDeleteCourseForm(userList.row.userId)"
                       :plain="true" type="danger" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--添加角色对话框-->
      <el-dialog title="添加角色" :visible.sync="insertdialogFormVisible">
        <el-form :model="insertform">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="insertform.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="formLabelWidth">
            <el-input v-model="insertform.realname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="菜单权限" :label-width="formLabelWidth">
            <el-tree
              :data="roledata"
              show-checkbox
              :default-expand-all="false"
              node-key="id"
              ref="DeviceGroupTree"
              :highlight-current="true"
              :check-strictly="true"
              :default-checked-keys="defaultcheckList"
              @check="checkGroupNode()"
              :props="{label: 'roleName'}">
            </el-tree>
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="insertdialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="insertUser()">确 定</el-button>
        </div>
      </el-dialog>


      <!--更新角色对话框-->
      <el-dialog title="更新角色" :visible.sync="updatedialogFormVisible">
        <el-form :model="updateform">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="updateform.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" :label-width="formLabelWidth">
            <el-input v-model="updateform.realname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色分配" :label-width="formLabelWidth">
            <el-tree
              :data="roledata"
              show-checkbox
              :default-expand-all="false"
              node-key="roleName"
              ref="DeviceGroupTree"
              :highlight-current="true"
              :check-strictly="true"
              @check="checkGroupNode()"
              :props="{label: 'roleName'}">
            </el-tree>
            <!--<el-input v-model="form.roleParentId" autocomplete="off"></el-input>-->
          </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="updatedialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateUser()">确 定</el-button>
        </div>
      </el-dialog>

      <!--删除对话框-->
      <el-dialog
        title="提示"
        :visible.sync="deletedialogFormVisible"
        width="30%">
        <span>是否删除此项？</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="deletedialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="deleteCourseForm()">确 定</el-button>
    </span>
      </el-dialog>
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
          pagesize:100,

          user:{},

          lock:true,

          //对话框属性
          updatedialogFormVisible: false,
          insertdialogFormVisible: false,
          deletedialogFormVisible:false,

          formLabelWidth: '120px',
          insertform: {},
          updateform: {},
          roledata: [],
          //树默认选中节点
          defaultcheckList:[],
        }
      },
      created(){
        this.user=JSON.parse(sessionStorage.getItem('user'))
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
        changeNoteSwitch(){
            console.log()
        },
        //打开添加role对话框
        async openInsertUserForm() {
          this.insertdialogFormVisible = true;
          const res = await this.$http.get(`roles/`)
          const {data, status, msg} = res.data
          if (status === 200) {
            this.roledata = data;
            // console.log(this.roledata);
          }
          else {
            this.$message.error(msg)
          }
        },
        //添加role
        async insertUser() {
          this.insertform.roleIdList = this.$refs.DeviceGroupTree.getCheckedKeys();
          if (this.insertform.roleIdList.length <= 0) {
            this.$message.error("至少选择一个权限！")
            return;
          }
          const res = await this.$http.post('roles/', this.insertform);
          const {status, msg} = res.data
          if (status === 200) {
            this.$message.success("添加成功!")
            this.getUserList();
            this.insertform = {}
          }
          else {
            this.$message.error("添加失败!")
          }
          this.insertdialogFormVisible = false;
        },
        //打开更新对话框
        async openUpdateUserForm(user){
          this.updatedialogFormVisible=true;
          //选中的roles传到对话框
          this.updateform=user;
          //查找角色
          const res = await this.$http.get(`roles/`)
          const {data, status, msg} = res.data
          if (status === 200) {
            this.roledata = data;
          }
          else {
            this.$message.error(msg)
          }
          //获得选中树形菜单
          this.defaultcheckList=user.roleName
          this.$refs.DeviceGroupTree.setCheckedKeys(this.defaultcheckList);

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
        async updateUser() {
          this.updatedialogFormVisible = false;
          this.updateform.roleIdList = this.$refs.DeviceGroupTree.getCheckedKeys();
          if (this.updateform.roleIdList.length <= 0) {
            this.$message.error("至少选择一个权限！")
            return;
          }
          const res = await this.$http.patch('roles/'+this.updateform.roleId, this.updateform);
          const {status, msg} = res.data
          if (status === 200) {
            this.$message.success("更新成功!")
            this.getUserList();
            this.updateform = {}
          }
          else {
            this.$message.error("更新失败!")
          }
        },
        async openDeleteCourseForm(Id){
          this.deletedialogFormVisible = true;
          this.deleteId=Id
          console.log(this.deleteId)

        },
        async deleteCourseForm() {
          this.deletedialogFormVisible = false;
          let courseId=this.deleteId
          const res = await this.$http.delete('users/'+userId)
          this.deleteId=-1;
          const {status, msg} = res.data
          if (status === 200) {
            this.$message.success("更新成功!")
            this.getRoleList();
          }
          else {
            this.$message.error("更新失败!")
          }

        },
        checkGroupNode(){},
      }
    }
</script>

<style scoped>
  .box-card{
    height: 99%;
  }
  .input-with-select{
    width: 300px;
  }
</style>

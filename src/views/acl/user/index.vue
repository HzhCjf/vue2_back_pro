<template>
  <div>
    <el-card style="margin: 20px">
      <el-form inline>
        <el-form-item>
          <el-input
            placeholder="用户名"
            v-model="searchUserName"
            @input="changeUserName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="search"
            >查询</el-button
          >
          <el-button @click="reset_search">取消</el-button>
        </el-form-item>
      </el-form>

      <div style="margin: 30px 0">
        <el-button type="primary" size="medium" @click="addUser()"
          >添加</el-button
        >
        <el-button type="danger" size="medium" @click="batchDelete">批量删除</el-button>
      </div>

      <el-table border stripe :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" label=""></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户名"
          width="150px"
          prop="username"
        ></el-table-column>
        <el-table-column label="用户昵称" prop="nickName"></el-table-column>
        <el-table-column label="角色列表" prop="roleName"></el-table-column>
        <el-table-column label="创建时间" prop="gmtCreate"></el-table-column>
        <el-table-column label="更新时间" prop="gmtModified"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="info"
              icon="el-icon-user-solid"
              @click="editRoleUser(row)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="addUser(row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteUser(row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="margintop: 20px"
        :total="total"
        :current-page="page"
        @size-change="handleSizeChange"
        :page-size="limit"
        @current-change="pageChangeHandler"
        :page-sizes="[5, 10, 15]"
        layout="prev, pager, next, jumper,sizes, ->, total"
      ></el-pagination>
    </el-card>

    <el-dialog
      :title="dialogTitle + '用户'"
      top="0"
      :visible.sync="isShowDialog"
      @close="closeDialog"
    >
      <template v-slot>
        <el-form
          :model="formData"
          :rules="rules"
          label-width="120px"
          ref="formRef"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username"></el-input>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input v-model="formData.nickName"></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password" v-if="!formData.id">
            <el-input v-model="formData.password"></el-input>
          </el-form-item>
        </el-form>
      </template>

      <template #footer>
        <el-button @click="closeDialog">取消</el-button>
        <el-button type="primary" @click="addUserSure">确定</el-button>
      </template>
    </el-dialog>

    <el-dialog
      title="设置角色"
      top="0"
      :visible.sync="isShowRoleDialog"
      @close="closeRoleDialog"
    >
      <template>
        <el-form label-width="100px">
          <el-form-item label="用户名">
            <el-input v-model="formData.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="角色列表">
            <template>
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="roleList"
                @change="handleCheckedRoleChange"
              >
                <el-checkbox
                  v-for="item in notRoleList"
                  :label="item.id"
                  :key="item.id"
                  >{{ item.roleName }}</el-checkbox
                >
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-form>
      </template>
      <template #footer>
        <el-button type="primary" @click="keepUserRole">保存</el-button>
        <el-button @click="closeRoleDialog">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqAclUserList,
  reqAddUser,
  reqEditUser,
  reqDeleteUser,
  reqRoleListByUserId,
  reqUserDoAssign,
  reqBatchDeleteUser
} from "@/api/aclUser";
export default {
  name: "User",
  data() {
    return {
      userList: [],
      page: 1,
      limit: 5,
      total: 0,
      searchUserName: "",
      isShowDialog: false,
      formData: {
        username: "",
        nickName: "",
        password: "",
      },
      dialogTitle: "",
      rules: {
        username: [
          { required: true, message: "用户名必须输入", trigger: "blur" },
          { min: 4, message: "用户名不能小于4位", trigger: "blur" },
          {},
        ],
        password: [
          {
            required: true,
            min: 6,
            message: "密码不能小于6位",
            trigger: "blur",
          },
        ],
      },
      isShowRoleDialog: false,
      roleList: [],
      notRoleList: [],
      isIndeterminate: true,
      checkAll: false,
      selectedIds:[]
    };
  },

  mounted() {
    this.getAclUserList();
  },
  methods: {
    // 获取用户信息的分页列表
    async getAclUserList() {
      const result = await reqAclUserList(this.page, this.limit);
      this.userList = result.data.items;

      this.total = result.data.total;
    },
    // 当前页的改变
    pageChangeHandler(newValue) {
      this.page = newValue;
      this.getAclUserList();
    },
    // 每页条数的改变
    handleSizeChange(val) {
      this.limit = val;
      this.getAclUserList();
    },
    // 查询
    search() {
      this.userList.forEach(async (user) => {
        if (user.username.includes(this.searchUserName)) {
          try {
            const result = await reqAclUserList(
              this.page,
              this.limit,
              this.searchUserName
            );
            this.userList = result.data.items;
            // console.log(this.userList);
            this.total = result.data.total;
          } catch (e) {}
        } else {
          // this.searchUserName = ''
        }
      });
    },
    // 重置查询
    reset_search() {
      this.searchUserName = "";
      this.getAclUserList();
    },
    // 当查询的字段清空时重新获取数据
    changeUserName() {
      if (this.searchUserName.trim() === "") {
        this.getAclUserList();
      }
    },
    // 添加用户
    addUser(row) {
      if (row) {
        this.isShowDialog = true;
        this.formData = { ...row };
        this.dialogTitle = "修改";
      } else {
        this.isShowDialog = true;
        this.formData = {
          username: "",
          nickName: "",
          password: "",
        };
        this.dialogTitle = "添加";
      }
      // 重置表单和校验
      this.$nextTick(() => {
        this.$refs.formRef.clearValidate();
      });
    },
    // 关闭添加
    closeDialog() {
      this.isShowDialog = false;
    },
    //确认添加
    async addUserSure() {
      await this.$refs.formRef.validate(async (v) => {
        if (v) {
          // 修改
          if (this.formData.id) {
            try {
              await reqEditUser(this.formData);
              this.isShowDialog = false;
              this.getAclUserList();
              // console.log(this.formData);
            } catch (e) {}
          } else {
            // 添加
            try {
              await reqAddUser(this.formData);
              this.isShowDialog = false;
              this.page = 1;
              this.getAclUserList();
              console.log(676767);
            } catch (e) {
              console.log(68787848545);
            }
          }

          this.$message.success(this.dialogTitle + "成功");
        } else {
          // this.$message.error('请填写正确')
        }
      });
    },
    // 删除单个用户
    async deleteUser(id) {
      try {
        await reqDeleteUser(id);
        this.getAclUserList();
        this.$message.success("删除成功");
      } catch (e) {
        this.$message.error("删除失败");
      }
    },
    // 关闭角色的对话框
    closeRoleDialog() {
      this.isShowRoleDialog = false;
    },
    // 设置用户角色
    async editRoleUser(row) {
      this.isShowRoleDialog = true;
      this.formData = { ...row };
      // 根据用户id请求角色
      const result = await reqRoleListByUserId(row.id);
      // console.log(result);
      this.roleList = result.data.assignRoles.map((item) => item.id);
      // console.log(result.data.assignRoles);
      // console.log(this.roleList);
      this.notRoleList = result.data.allRolesList;
      this.checkAll =
        result.data.allRolesList.length === result.data.assignRoles.length;
      this.isIndeterminate =
        result.data.assignRoles.length > 0 &&
        result.data.assignRoles.length < result.data.allRolesList.length;
    },
    // 是否全选
    handleCheckAllChange(val) {
      // this.roleList = val ? this.notRoleList : []
      this.roleList = val ? this.notRoleList.map((item) => item.id) : [];
      // console.log(val);
      this.isIndeterminate = false;
    },
    // 角色列表选中项发生改变的监听
    handleCheckedRoleChange() {
      this.checkAll = this.roleList.length === this.notRoleList.length && this.notRoleList.length > 0;
      this.isIndeterminate = this.roleList.length > 0 && this.roleList.length < this.notRoleList.length;
    },
    // 重置角色的所有设置
    resetRoleData() {
      this.isShowRoleDialog = false;
      this.notRoleList = [];
      this.roleList = [];
      isIndeterminate = false;
      checkAll = false;
    },
    // 请求给用户进行角色授权,保存
    async keepUserRole() {
      // console.log(this.formData);
      const userId = this.formData.id;
      const roleId = this.roleList.join(",");
      await reqUserDoAssign({userId,roleId})
      this.$message.success('分配角色成功')
      this.getAclUserList()
      this.resetRoleData();
    },
    // 列表选中状态发生改变的监听回调
    handleSelectionChange(selection){
      this.selectedIds = selection.map(item => item.id)
      console.log(this.selectedIds);
    },
    // 批量删除用户
    async batchDelete(){
      try{
        await reqBatchDeleteUser(this.selectedIds)
        this.getAclUserList()
        this.$message.success('批量删除成功')
      }catch(e){
        this.$message.error('批量删除失败')
      }
    }
  },
};
</script>


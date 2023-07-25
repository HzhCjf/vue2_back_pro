<template>
  <div>
    <el-card style="margin: 20px">
      <el-form inline>
        <el-form-item>
          <el-input
            placeholder="用户名"
            v-model="searchRoleName"
            @input="changeRoleName"
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
        <el-button type="primary" size="medium" @click="addRole"
          >添加</el-button
        >
        <el-button type="danger" size="medium" @click="batchDelete"
          >批量删除</el-button
        >
      </div>

      <el-table
        border
        stripe
        :data="roleList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" label=""></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="角色名称">
          <template  v-slot="{ row }">
            <template v-if="row.isEdit">
              <el-input v-model="row.roleName" size="small"></el-input>
              <el-button type="warning" size="small" icon="el-icon-refresh" @click="cancelHandler(row)">取消</el-button>
            </template>
            <span v-else>{{ row.roleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="info"
              icon="el-icon-info"
              @click="$router.push({ name: 'RoleAuth', params: { row } })"
            ></el-button>
            <el-button type="primary" icon="el-icon-check" title="确定修改角色" @click="editRole(row)"></el-button>
            <el-button type="primary" icon="el-icon-edit-outline" @click="row.isEdit = true" title="修改角色"></el-button>
            <el-button type="danger" icon="el-icon-delete" title="删除角色" @click="deleteRole(row.id)"></el-button>
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
  </div>
</template>

<script>
import { reqRoleList, reqAddRole, reqBatchDeleteRole ,reqEditRole ,reqDeleteRole} from "@/api/role";
export default {
  name: "Role",
  data() {
    return {
      roleList: [],
      page: 1,
      limit: 5,
      total: 0,
      searchRoleName: "",
      isShowAddRole: false,
      selectedIds: [],
      
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const result = await reqRoleList(this.page, this.limit);
      this.roleList = result.data.items.map(item => {
        return  item = {
          ...item,
          isEdit:false
        }
      });
      // console.log(this.roleList);
      this.total = result.data.total;
    },
    // 当前页的改变
    pageChangeHandler(newValue) {
      this.page = newValue;
      this.getRoleList();
    },
    // 每页条数的改变
    handleSizeChange(val) {
      this.limit = val;
      this.getRoleList();
    },
    // 查询
    search() {
      this.roleList.forEach(async (role) => {
        if (role.roleName.includes(this.searchRoleName)) {
          try {
            const result = await reqRoleList(
              this.page,
              this.limit,
              this.searchRoleName
            );
            this.roleList = result.data.items;
            // console.log(this.searchRoleName);
            // console.log(this.roleList);
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
      this.searchRoleName = "";
      this.getRoleList();
    },
    // 当查询的字段清空时重新获取数据
    changeRoleName() {
      if (this.searchRoleName.trim() === "") {
        this.getRoleList();
      }
    },
    // 添加角色
    addRole() {
      this.$prompt("请输入新名称", "添加角色", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          reqAddRole({ roleName: value }).then(() => {
            this.getRoleList();
            this.$message.success("添加角色成功");
          });
        })
        .catch(() => {
          this.$message.warning("取消添加");
        });
    },
    // 列表选中状态发生改变的监听回调
    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
      // console.log(this.selectedIds);
    },
    // 批量删除用户
    async batchDelete() {
      try {
        await reqBatchDeleteRole(this.selectedIds);
        this.getRoleList();
        this.$message.success("批量删除成功");
      } catch (e) {
        this.$message.error("批量删除失败");
      }
    },
    // 编辑的取消
    cancelHandler(row){
      row.isEdit = false
      this.$message.warning('取消角色修改')
    },
    // 确认修改用户
    async editRole(row){
      try{
        await reqEditRole(row)
        this.getRoleList()
        this.$message.success('修改角色成功')
      }catch(e){
        this.$message.error('修改角色失败')
      }
    },
    // 删除角色
    async deleteRole(id){
      try{
        await reqDeleteRole(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
      }catch(e){
        this.$message.error('删除角色失败')
      }
    }
  },
};
</script>

<style scoped>
</style>
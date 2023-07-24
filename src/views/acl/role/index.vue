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
        <el-button type="primary" size="medium"
          >添加</el-button
        >
        <el-button type="danger" size="medium"
          >批量删除</el-button
        >
      </div>

      <el-table
        border
        stripe
        :data="roleList"
        
      >
        <el-table-column type="selection" label=""></el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="80px"
          align="center"
        ></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button type="info" icon="el-icon-info" @click="$router.push({
                name:'RoleAuth',
                params:{
                    row,
                }
            })"></el-button>
            <el-button type="primary" icon="el-icon-check"></el-button>
            <el-button type="primary" icon="el-icon-edit-outline"></el-button>
            <el-button type="danger" icon="el-icon-delete"></el-button>
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
import { reqRoleList } from "@/api/role";
export default {
  name: "Role",
  data() {
    return {
      roleList: [],
      page: 1,
      limit: 5,
      total: 0,
      searchRoleName:''
    };
  },
  mounted() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const result = await reqRoleList(this.page, this.limit);
      this.roleList = result.data.items;
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
            console.log(this.searchRoleName);
            console.log(this.roleList);
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
  },
};
</script>

<style scoped>
</style>
<template>
  <div style="margin: 30px">
    <el-tree
      :data="permissionMenu"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="defaultArr"
      :props="defaultProps"
      :default-expand-all="true"
      ref="treeRef"
    >
    </el-tree>

    <div style="margin: 30px">
      <el-button type="primary" @click="AssignPermissions">保存</el-button>
      <el-button @click="$router.push('/acl/role/list')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { reqListtoAssign, reqRoloAssignPermissions } from "@/api/role";
import router from '@/router';
export default {
  name: "RoleAuth",
  data() {
    return {
      permissionMenu: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  props: ["row"],
  mounted() {
    this.getAssign();
  },
  methods: {
    // 获取权限数据
    async getAssign() {
      const result = await reqListtoAssign(this.row.id);
      this.permissionMenu = result.data.children;
    },

    // 保存(角色分配权限)
    async AssignPermissions() {
      const selectAllId = this.$refs.treeRef.getCheckedKeys(false, true);
      const semiSelectedId = this.$refs.treeRef.getHalfCheckedKeys();
      // console.log(selectAllId,semiSelectedId);
      const ids = selectAllId.concat(semiSelectedId).join(",");
      try {
        await reqRoloAssignPermissions(this.row.id, ids);
        this.$message.success('更改权限成功')
        router.replace('/acl/role/list')
        this.getAssign()
      } catch (e) {
        this.$message.error('更改权限失败')
      }
    },
  },
  computed: {
    // 用递归拿到select为true,并且没有children的叶子的id来进行默认勾选
    defaultArr() {
      function recursion(data) {
        let result = [];
        data.forEach((item) => {
          if (
            item.select === true &&
            (!item.children || item.children.length === 0)
          ) {
            result.push(item.id);
          }
          if (item.children && item.children.length > 0) {
            let childrenResult = recursion(item.children);
            result = result.concat(childrenResult);
          }
        });
        return result;
      }

      // 调用递归函数并返回结果
      return recursion(this.permissionMenu);
    },
  },
};
</script>

<style scoped>
</style>
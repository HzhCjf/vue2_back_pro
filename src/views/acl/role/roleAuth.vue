<template>
  <div style="margin: 30px">
    <el-tree
      :data="permissionMenu"
      show-checkbox
      node-key="id"
      :default-expanded-keys="[2, 3]"
      :default-checked-keys="[5]"
      :props="defaultProps"
      :default-expand-all="true"
    >
    </el-tree>

    <div style="margin: 30px">
      <el-button type="primary">保存</el-button>
      <el-button @click="$router.push('/acl/role/list')">取消</el-button>
    </div>
  </div>
</template>

<script>
import { reqListtoAssign } from "@/api/role";
export default {
  name: "RoleAuth",
  data() {
    return {
      permissionMenu: [],
      defaultProps: {
        children: "children",
        label: "name",
      },
      default: [],
    };
  },
  props: ["row"],
  mounted() {
    this.getAssign();
    
    this.recursion(this.permissionMenu)
    console.log(this.default);
  },
  methods: {
    async getAssign() {
      console.log(this.row.id);
      const result = await reqListtoAssign(this.row.id);
      this.permissionMenu = result.data.children;
      
    },
    recursion(data) {
      // 使用map方法对data进行递归遍历
      return data.map((item) => {
          if (item.select == true) {
            let add =  {
              id: item.id,
              label: item.name,
            };
            this.default.push(add)
            console.log(85445);
          } else if (item.children && item.children.length > 0) {
            // 递归调用recursion函数处理子节点
            item.children = this.recursion(item.children);
          }
          return item;
        })
        .filter((item) => item);
    },
  },
};
</script>

<style scoped>
</style>
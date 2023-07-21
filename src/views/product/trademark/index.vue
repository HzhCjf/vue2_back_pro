<template>
  <div>
    <el-card shadow="hover" :style="{margin:'20px'}">
      <template #header >
        <el-button type="primary" icon="el-icon-plus">添加</el-button>
      </template>

      <el-table>
        <el-table-column label="序号"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name:'Trademark'
  }
</script>

<style scoped>
  
</style>
<template>
  <div>
    <el-card shadow="hover" :style="{ margin: '20px' }">
      <template #header>
        <el-button type="primary" icon="el-icon-plus" @click="addTrademark()"
          >添加</el-button
        >
      </template>

      <el-table :data="trademarkList">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="品牌名称" prop="tmName"></el-table-column>
        <el-table-column label="品牌LOGO">
          <template v-slot="{ row }">
            <img :src="row.logoUrl" width="100" />
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button
              type="warning"
              icon="el-icon-edit-outline"
              @click="addTrademark(row)"
              >修改</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="deleteTrademark(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog
        :title="dialogTitle + '品牌'"
        @close="closeDialog"
        :visible.sync="isShowDialog"
        top="0"
      >
        <template v-slot>
          <el-form
            :model="formData"
            label-width="100px"
            :rules="rules"
            ref="formRef"
          >
            <el-form-item prop="tmName" label="品牌名称">
              <el-input v-model="formData.tmName"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" prop="logoUrl">
              <el-upload
                :action="uploadUrl"
                list-type="picture-card"
                :show-file-list="false"
                :on-success="addTrademarkLogoUrl"
                :before-upload="beforeUpload"
              >
                <img
                  v-if="formData.logoUrl"
                  :src="formData.logoUrl"
                  alt=""
                  style="width: 148px; height: 148px"
                />
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <el-button @click="cancelDialog">取消</el-button>
          <el-button type="primary" @click="addTrademarkSure()">确定</el-button>
        </template>
      </el-dialog>
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
import {
  reqTrademarkList,
  reqAddTrademark,
  reqDeleteTrademark,
  reqEditTrademark,
} from "@/api/trademark";
export default {
  name: "Trademark",
  data() {
    return {
      // 品牌列表
      trademarkList: [],
      // 当前页
      page: 1,
      // 每页条数
      limit: 5,
      // 总条数
      total: 0,
      //是否显示对话框
      isShowDialog: false,
      // 添加or修改品牌的表单
      formData: {
        tmName: "",
        logoUrl: "",
      },
      uploadUrl: `${process.env.VUE_APP_BASE_API}/admin/product/upload`,
      rules: {
        tmName: [
          {
            // 必填
            required: true,
            // 最小个数
            min: 1,
            // 最大个数
            max: 20,
            // 校验错误提示
            message: "品牌名称必须填写",
            // 触发时机
            trigger: "blur",
          },
        ],
        logoUrl: [
          {
            // 必填
            required: true,
            // 触发时机
            trigger: "blur",
            // 自定义校验规则回调函数,rule为规则,value是当前的值,callbakc为回调函数,当里面有值的时候为失败,没有值为成功
            validator(rule, value, callback) {
              // 当没有图片地址的时候
              if (value === "") {
                // 失败回调
                callback("品牌logo必须上传");
              } else {
                // 把地址取到最后一个.后面,然后+1位,不要.,拿到图片格式
                const ext = value.substring(value.lastIndexOf(".") + 1);
                // 当图片格式不是以下几种的时候直接调用失败回调
                if (["png", "jpg", "gif"].includes(ext)) {
                  callback();
                } else {
                  callback("请上传正确的logo图片格式!(png,jpg,gif)");
                }
              }
            },
          },
        ],
      },
      dialogTitle: "",
    };
  },

  mounted() {
    this.gerTrademarkList();
  },
  methods: {
    // 获取品牌列表
    async gerTrademarkList() {
      try {
        const result = await reqTrademarkList(this.page, this.limit);
        // console.log(result);
        this.trademarkList = result.data.records;
        this.page = result.data.current;
        this.limit = result.data.size;
        this.total = result.data.total;
      } catch (e) {}
    },
    // 当前页的改变
    pageChangeHandler(newValue) {
      this.page = newValue;

      // console.log(newValue);
      this.gerTrademarkList();
    },
    // 每页条数的改变
    handleSizeChange(val) {
      this.limit = val;
      this.gerTrademarkList();
    },
    // 添加按钮
    addTrademark(row) {
      if (row) {
        this.dialogTitle = "修改";
        this.formData = row;
        this.isShowDialog = true;
      } else {
        this.dialogTitle = "添加";
        this.formData = {
          tmName: "",
          logoUrl: "",
        };
        console.log(this.formData);
        this.isShowDialog = true;
      }
      this.$refs.formRef.resetFields()
    },
    // 关闭对话框
    closeDialog() {
      this.isShowDialog = false;
    },
    // 图片上传成功
    addTrademarkLogoUrl(response) {
      this.formData.logoUrl = response.data;
    },
    // 图片上传之前
    beforeUpload(file) {
      // console.log(file);
      if (
        ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
          file.type
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    // 取消
    cancelDialog() {
      this.isShowDialog = false;
    },
    // 确定添加
    async addTrademarkSure() {
      await this.$refs.formRef.validate(async (v) => {
        if (v) {
          if (this.formData.id) {
            try {
              await reqEditTrademark(this.formData);
              this.isShowDialog = false;
              this.gerTrademarkList();
            } catch (e) {}
          } else {
            try {
              await reqAddTrademark(this.formData);
              this.isShowDialog = false;
              this.page = Math.ceil((this.total + 1) / this.limit);
              this.gerTrademarkList();
              
            } catch (e) {}
          }
          
          this.$message.success(this.dialogTitle + "成功");
        } else {
          // this.$message.error(this.dialogTitle + "失败");
        }
      });
    },
    // 删除品牌
    async deleteTrademark(row) {
      try {
        await reqDeleteTrademark(row.id);
        this.$message.success("删除成功");
        if(this.trademarkList.length <= 1){
          this.page = this.page - 1
        }
        this.gerTrademarkList();
      } catch (e) {}
    },
  },
};
</script>

<style scoped>
</style>
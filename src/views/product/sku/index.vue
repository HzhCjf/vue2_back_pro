<template>
  <div>
    <el-card style="margin: 20px" shadow="hover">
      <el-table :data="skuList">
        <el-table-column
          label="序号"
          type="index"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column label="名称" prop="skuName"></el-table-column>
        <el-table-column label="描述" prop="skuDesc"></el-table-column>
        <el-table-column label="默认图片">
          <template v-slot="{ row }">
            <img :src="row.skuDefaultImg" alt="" width="100px" />
          </template>
        </el-table-column>
        <el-table-column label="重量(KG)" prop="weight"></el-table-column>
        <el-table-column label="价格(元)" prop="price"></el-table-column>
        <el-table-column label="操作" width="300">
          <template v-slot="{ row }">
            <el-button
              v-if="row.isSale === 0"
              type="info"
              icon="el-icon-top"
              @click="onSaleHandler(row.id)"
            ></el-button>
            <el-button
              v-else
              type="success"
              icon="el-icon-bottom"
              @click="cancelSaleHandler(row.id)"
            ></el-button>
            <el-button
              type="primary"
              icon="el-icon-edit-outline"
              @click="$message.success('需要100000000000才能继续进入')"
            ></el-button>
            <el-button
              type="info"
              icon="el-icon-info"
              @click="drawerHandler(row.id)"
            ></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteSku(row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-drawer
        v-if="skuByIdList"
        :title="skuByIdList.skuName"
        :visible.sync="isShowDrawer"
        size="50%"
        @close="closeDrawer"
      >
        <el-row>
          <el-col class="title" :span="6">名称</el-col>
          <el-col class="content" :span="16">{{ skuByIdList.skuName }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">描述</el-col>
          <el-col class="content" :span="16">{{ skuByIdList.skuDesc }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">价格</el-col>
          <el-col class="content" :span="16">{{ skuByIdList.price }}</el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">平台属性</el-col>
          <el-col class="content" :span="16">
            <el-tag
              type="success"
              v-for="item in skuByIdList.skuAttrValueList"
              :key="item.id"
              >{{ item.attrName }}-{{ item.valueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">销售属性</el-col>
          <el-col class="content" :span="16">
            <el-tag
              type="success"
              v-for="item in skuByIdList.skuSaleAttrValueList"
              :key="item.id"
              >{{ item.saleAttrName }}-{{ item.saleAttrValueName }}</el-tag
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col class="title" :span="6">商品图片</el-col>
          <el-col class="content" :span="16">
            <el-carousel indicator-position="outside">
              <el-carousel-item v-for="item in skuByIdList.skuImageList" :key="item">
                <img :src="item.imgUrl" style="width: 100%;height: 100%;" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>

      <el-pagination style="margintop: 20px" :total="total" :current-page="page" :page-size="limit" @current-change="pageChangeHandler" @size-change="handleSizeChange" :page-sizes="[5, 10, 15]" layout="prev, pager, next, jumper,sizes, ->, total"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  reqSkuList,
  reqOnSale,
  reqCancelSale,
  reqSkuByIdList,
  reqDeleteSku
} from "@/api/sku";
export default {
  name: "Sku",
  data() {
    return {
      skuList: [],
      page: 1,
      limit: 5,
      total: 0,
      isShowDrawer: false,
      skuByIdList: {} | null,
    };
  },

  mounted() {
    this.getSkuList();
  },
  methods: {
    // 获取sku分页列表
    async getSkuList() {
      const reslut = await reqSkuList(this.page, this.limit);
      this.skuList = reslut.data.records;
      this.page = reslut.data.current;
      this.limit = reslut.data.size;
      this.total = reslut.data.total;
    },
    // 上架
    async onSaleHandler(id) {
      try {
        await reqOnSale(id);
        this.getSkuList();
        this.$message.success("上架成功");
      } catch (e) {
        this.$message.error("上架失败");
      }
    },

    // 下架
    async cancelSaleHandler(id) {
      try {
        await reqCancelSale(id);
        this.getSkuList();
        this.$message.success("下架成功");
      } catch (e) {
        this.$message.error("下架失败");
      }
    },

    // 查看sku详情
    async drawerHandler(id) {
      this.isShowDrawer = true;
      try {
        const reslut = await reqSkuByIdList(id);
        this.skuByIdList = reslut.data;
      } catch (e) {}
    },

    // 关闭抽屉
    closeDrawer() {
      this.isShowDrawer = false;
    },

    // 当前页改变
    pageChangeHandler(newVal){
      this.page = newVal
      this.getSkuList()
    },

    // 每页条数改变
    handleSizeChange(newVal){
      this.limit = newVal
      this.getSkuList()
    },

    // 删除sku
    async deleteSku(id){
      try{
        await reqDeleteSku(id)
        this.$message.success('删除成功')
        this.getSkuList()
      }catch(e){
        this.$message.error('删除失败')
      }
    }

  },
};
</script>

<style scoped>
.title {
  font-weight: 900;
  font-size: 25px;
  text-align: right;
  margin-right: 10px;
  margin-bottom: 20px;
}
.title::after {
  content: ":";
}
.content {
  font-size: 18px;
  margin-bottom: 20px;
  padding-top: 8px;
}
</style>
import request from '@/utils/request'

// sku的分页列表
export function reqSkuList(page,limit){
    return request.get(`/product/list/${page}/${limit}`)
}

// 上架
export function reqOnSale(id){
    return request.get(`/product/onSale/${id}`)
}

// 下架
export function reqCancelSale(id){
    return request.get(`/product/cancelSale/${id}`)
}

// 添加sku
export function reqAddSkuInfo(data){
    return request.post(`/product/saveSkuInfo`,data)
}


// 删除sku
export function reqDeleteSku(skuId){
    return request.delete(`/product/deleteSku/${skuId}`)
}

// 获取指定id的sku列表
export function reqSkuByIdList(skuId){
    return request.get(`/product/getSkuById/${skuId}`)
}
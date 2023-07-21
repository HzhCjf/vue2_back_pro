import request from '@/utils/request'

// 获取品牌列表
export function reqTrademarkList(page,limit){
    return request.get(`/product/baseTrademark/${page}/${limit}`)
}

// 添加品牌
export function reqAddTrademark(data){
    return request.post(`/product/baseTrademark/save`,data)
}

// 删除品牌
export function reqDeleteTrademark(id){
    return request.delete(`/product/baseTrademark/remove/${id}`)
}

// 更新品牌
export function reqEditTrademark(data){
    return request.put(`/product/baseTrademark/update`,data)
}
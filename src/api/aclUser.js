import request from '@/utils/request'

// 1.请求用户分页列表数据或者搜索用户
export function reqAclUserList(page,limit,username){
    return request.get(`/acl/user/${page}/${limit}`,{
        params:{username}
    })
}

// 2.添加用户
export function reqAddUser(data){
    return request.post(`/acl/user/save`,data)
}

// 3.修改用户
export function reqEditUser(data){
    return request.put(`/acl/user/update`,data)
}

// 4.删除用户
export function reqDeleteUser(id){
    return request.delete(`/acl/user/remove/${id}`)
}

// 5.根据用户id获取角色数据列表
export function reqRoleListByUserId(userId){
    return request.get(`/acl/user/toAssign/${userId}`)
}

// 6.根据用户分配角色,保存
export function reqUserDoAssign(params){
    return request.post(`/acl/user/doAssign`,null,{params})
}

// 7.批量删除用户
export function reqBatchDeleteUser(idList){
    return request.post(`/acl/user/batchRemove`,idList)
}
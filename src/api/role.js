import request from '@/utils/request'

export function reqRoleList(page,limit,roleName){
    return request.get(`/acl/role/${page}/${limit}`,{params:{roleName}})
}

// 根据角色获取菜单
export function reqListtoAssign(roleId){
    return request.get(`/acl/permission/toAssign/${roleId}`)
}

// 为角色分配权限
export function reqRoloAssignPermissions(roleId,permissionId){
    return request.post(`/acl/permission/doAssign`,null,{
        params:{
            roleId,
            permissionId
        }
    })
}

// 新增角色
export function reqAddRole(role){
    return request.post(`/acl/role/save`,role)
}

// 批量删除角色
export function reqBatchDeleteRole(idList){
    return request.post(`/acl/role/batchRemove`,idList)
}

// 修改角色
export function reqEditRole(role){
    return request.put(`/acl/role/update`,role)
}

// 删除角色
export function reqDeleteRole(id){
    return request.delete(`/acl/role/remove/${id}`)
}
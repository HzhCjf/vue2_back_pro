import request from '@/utils/request'

export function reqRoleList(page,limit,roleName){
    return request.get(`/acl/role/${page}/${limit}`,{params:{roleName}})
}

// 根据角色获取菜单
export function reqListtoAssign(roleId){
    return request.get(`/acl/permission/toAssign/${roleId}`)
}
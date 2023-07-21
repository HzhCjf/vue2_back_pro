import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
      hidden: true,
  },

  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error/404.vue'),
    hidden: true,
  },

  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
        icon: 'el-icon-s-home',
      }
    }]
  },
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    redirect: '/acl/user/list',
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'user/list',
        name: 'User',
        component: () => import('@/views/acl/user/index.vue'),
        meta: {
          title: '用户管理'
        }
      },
      // {
      //   path: 'role/list',
      //   name: 'Role',
      //   component: () => import('@/views/acl/role/index.vue'),
      //   meta: {
      //     title: '角色管理'
      //   }
      // },
      // {
      //   path: 'roleAuth/list',
      //   name: 'RoleAuth',
      //   component: () => import('@/views/acl/role/roleAuth.vue'),
      //   meta: {
      //     title: '角色权限管理',
      //     hidden: true
      //   }
      // },
      {
        path: 'permission/list',
        name: 'Permission',
        component: () => import('@/views/acl/permission/index.vue'),
        meta: {
          title: '菜单管理'
        }
      },
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    redirect: '/product/trademark/list',
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'el-icon-s-goods'
    },
    children: [
      {
        path: 'trademark/list',
        name: 'Trademark',
        component: () => import('@/views/product/trademark/index.vue'),
        meta: {
          title: '品牌管理'
        }
      },
      // {
      //   path: 'attr/list',
      //   name: 'Attr',
      //   component: () => import('@/views/product/attr/index.vue'),
      //   meta: {
      //     title: '平台属性管理'
      //   }
      // },
      {
        path: 'sku/list',
        name: 'Sku',
        component: () => import('@/views/product/sku/index.vue'),
        meta: {
          title: 'SKU属性管理'
        }
      },
      // {
      //   path: 'spu/list',
      //   name: 'Spu',
      //   component: () => import('@/views/product/spu/index.vue'),
      //   meta: {
      //     title: 'SPU管理'
      //   }
      // },
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

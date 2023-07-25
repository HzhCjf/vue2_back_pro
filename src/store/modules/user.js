import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, allAsyncRoutes, constantRoutes } from '@/router'
import _ from 'lodash'
import router from '@/router'


function filterUserRouter(routes, userRouter) {
  return routes.filter(r => {
    if (r.children && r.children.length > 0) {
      r.children = filterUserRouter(r.children, userRouter)
    }
    return userRouter.includes(r.name)
  })
}

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    routes: [],
    buttons: [],
    // 不同角色的用户将要显示的管理菜单
    // menuRoutes: []
  }
}

const state = getDefaultState()
// 为角色筛选菜单



const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROUTES: (state, routes) => {
    state.routes = routes
  },
  SET_BUTTONS: (state, buttons) => {
    state.buttons = buttons
  },
  SET_MENU_ROUTES(state, menuRoutes) {
    state.menuRoutes = menuRoutes;
  }

}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },


  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar, roles, buttons, routes } = data
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        // 把角色和菜单,还有功能的数据都放在仓库中
        commit('SET_ROLES', roles)
        commit('SET_BUTTONS', buttons)

        // console.log(fliterUserRouter(_.clone(allAsyncRoutes),routes));
        const userRouter = filterUserRouter(_.clone(allAsyncRoutes), routes)

        commit('SET_ROUTES', [...constantRoutes, ...userRouter])
        // console.log(userRouter);
        // router.addRoutes([...userRouter,...constantRoutes])
        // 动态菜单
        // state.routes = [...constantRoutes, ...userRouter]
        // console.log(userRouter);
        // console.log(state.routes);
        router.addRoutes(userRouter)
        // console.log(router.options.routes);
        // console.log(router);
        // commit('SET_MENU_ROUTES', menuRoutes);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        dispatch('resetToken')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      // console.log(router.hasRoute);
      allAsyncRoutes.forEach(route => {
        const routeIdx = router.matcher.match(route.path).index;
        if (routeIdx > -1) {
          router.matcher.matched.splice(routeIdx, 1);
        }
      });

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


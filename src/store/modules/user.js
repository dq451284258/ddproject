import { getUserInfo } from '@/api/user'
import { getUserId } from '@/utils/auth'

const user = {
  state: {
    name: '',
    avatar: '',
    userid: ''
  },

  mutations: {
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_USERID: (state, userid) => {
      state.userid = userid
    }
  },

  actions: {

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.userid).then(response => {
          const data = response.data
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    GetDingUserId({ commit }) {
      commit('SET_USERID', getUserId())
    }
  }
}

export default user

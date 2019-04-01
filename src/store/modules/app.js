
import { getDdcode } from '@/utils/auth'

const app = {
  state: {
    ready: false, //判断钉钉config接口注入权限验证配置是否成功
    ddCode: '',
    dingConfig: {
      agentId: '', // 必填，微应用ID
      corpId: '',//必填，企业ID
      timeStamp: '', // 必填，生成签名的时间戳
      nonceStr: '', // 必填，生成签名的随机串
      signature: '', // 必填，签名
    },
    pageLoading: false
  },
  mutations: {
    IS_READY: (state, ready) => {
      state.ready = ready
    },
    GET_DDCODE: (state, ddCode) => {
      state.ddCode = ddCode
    },
    GET_DINGCONFIG: (state, { agentId, corpId, timeStamp, nonceStr, signature }) => {
      state.dingConfig.agentId = agentId
      state.dingConfig.corpId = corpId
      state.dingConfig.timeStamp = timeStamp
      state.dingConfig.nonceStr = nonceStr
      state.dingConfig.signature = signature
    },
    SET_PAGELOADING: (state, pageLoading) => {
      state.pageLoading = pageLoading
    }
  },
  actions: {
    IsReady({ commit }, { ready }) {
      commit('IS_READY', ready)
    },
    GetDdCode({ commit }) {
      commit('GET_DDCODE', getDdcode())
    },
    GetDingConfig({ commit }, { agentId, corpId, timeStamp, nonceStr, signature }) {
      commit('GET_DINGCONFIG', { agentId, corpId, timeStamp, nonceStr, signature })
    },
    SetPageLoading({ commit }, pageLoading) {
      commit('SET_PAGELOADING', pageLoading)
    }
  }
}

export default app

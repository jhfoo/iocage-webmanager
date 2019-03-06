import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    RuntimeConfig: {}
  },
  getters: {
    getRuntimeConfig: (state) => {
      return state.RuntimeConfig
    }
  },
  mutations: {
    setRuntimeConfig (state, config) {
      state.RuntimeConfig = config
    }
  },
  actions: {

  }
})

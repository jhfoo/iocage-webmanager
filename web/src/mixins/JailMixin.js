import axios from 'axios'
import https from 'https'
import Config from '../Config.js'

export default {
  data() {
    return {
      jmJails: [],
      jmLastJailErr: null,
      jmJailRefreshTimer: null,
      jmJailRefreshTimeout: 5 * 1000
    }
  },
  created() {
    console.log('Hello from JailMixin!')
  },
  methods: {
    jmGetWebClient() {
      return axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
    },
    async jmGetJails(RefreshTimeout) {
      try {
        let resp = await this.jmGetWebClient().get(Config.service.BaseUrl + '/list/')
        this.jmJails = resp.data
        this.jmLastJailErr = null
      } catch(err) {
        this.jmLastJailErr = err
      } finally {
        if (RefreshTimeout !== undefined) {
          // timer is set
          if (RefreshTimeout <= 0) {
            RefreshTimeout = 5 * 1000
          }
          this.jmJailRefreshTimer = setTimeout(() => {
            this.jmGetJails(RefreshTimeout)
          }, RefreshTimeout)
        }
      }
    },
    async jmGetJailsAsync() {
      // return raw API response
      this.jmGetWebClient().get(Config.service.BaseUrl + '/list/')
    },
  }
}
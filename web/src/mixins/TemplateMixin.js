import axios from 'axios'
import https from 'https'
import Config from '../Config.js'

export default {
  data() {
    return {
      tmTemplates: [],
      tmLastErr: null,
      tmRefreshTimer: null,
      tmRefreshTimeout: 5 * 1000
    }
  },
  created() {
    console.log('Hello from TemplateMixin!')
  },
  methods: {
    tmGetWebClient() {
      return axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
    },
    async tmGetTemplates(RefreshTimeout) {
      try {
        let resp = await this.tmGetWebClient().get(Config.service.BaseUrl + '/list/template')
        this.tmTemplates = resp.data
        this.tmLastErr = null
      } catch(err) {
        this.tmLastErr = err
      } finally {
        if (RefreshTimeout !== undefined) {
          // timer is set
          if (RefreshTimeout <= 0) {
            RefreshTimeout = 5 * 1000
          }
          this.tmRefreshTimer = setTimeout(() => {
            this.jmGetJails(RefreshTimeout)
          }, RefreshTimeout)
        }
      }
    },
    async tmGetTemplatesAsync() {
      // return raw API response
      this.tmGetWebClient().get(Config.service.BaseUrl + '/list/template')
    },
  }
}
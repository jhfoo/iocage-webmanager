<template>
  <div class="about">
    <table>
      <tr>
        <td width="50%" style="text-align: left">
          Jails
          <table border="1">
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Address</td>
              <td>Release</td>
              <td>State</td>
            </tr>
            <tr v-for="item in jails">
              <td>{{item.id}}</td>
              <td><router-link :to="{name:'jaildetail', params: {jailname: item.name}}" >{{item.name}}</router-link></td>
              <td>{{item.ipv4}}</td>
              <td>{{item.release}}</td>
              <td>{{item.state}}</td>
            </tr>
          </table>
        </td>
        <td width="50%" style="text-align: left; vertical-align: top">
          Templates
          <table border="1">
            <tr>
              <td>Id</td>
              <td>Name</td>
              <td>Address</td>
              <td>Release</td>
              <td>State</td>
            </tr>
            <tr v-for="item in templates">
              <td>{{item.id}}</td>
              <td>{{item.name}}</td>
              <td>{{item.ipv4}}</td>
              <td>{{item.release}}</td>
              <td>{{item.state}}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import axios from 'axios'
import https from 'https'

export default {
  data: () => {
    return {
      jails: [],
      templates: []
    }
  },
  mounted: function () {
    this.wait4RuntimeConfig()
  },
  methods: {
    getWebClient: () => {
      return axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
    },
    wait4RuntimeConfig: function() {
      if (this.$store.getters.getRuntimeConfig.ServiceBaseUrl) {
        this.getJails()
      } else {
        setTimeout(() => {
          this.wait4RuntimeConfig()
        }, 500)
      }
    },
    getJails: function() {
      this.getWebClient().get(this.$store.getters.getRuntimeConfig.ServiceBaseUrl + '/iocage/list/')
      .then((resp) => {
        this.jails = resp.data
        this.getTemplates()
      })
      .catch((err) => {
        console.error(err)
      })
    },
    getTemplates: function() {
      this.getWebClient().get(this.$store.getters.getRuntimeConfig.ServiceBaseUrl + '/iocage/list/template')
      .then((resp) => {
        this.templates = resp.data
      })
      .catch((err) => {
        console.error(err)
      })
    }
  }
}
</script>
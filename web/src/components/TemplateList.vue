<template>
    <div>
      <v-toolbar dense flat>
        <v-toolbar-title>Templates</v-toolbar-title>
        <v-spacer></v-spacer>

        <template v-if="$vuetify.breakpoint.smAndUp">
          <v-btn icon>
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <v-simple-table fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Release</th>
              <th>State</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="templates.length > 0">
              <tr v-for="item in templates" :key="item.id">
                <td>{{item.id}}</td>
                <td>{{item.name}}</td>
                <td>{{item.ipv4}}</td>
                <td>{{item.release}}</td>
                <td>{{item.state}}</td>
              </tr>
            </template>
            <template v-else>
              <tr><td colspan="5"  class="text-center">No templates available</td></tr>
            </template>
          </tbody>
        </template>
      </v-simple-table>
    </div>
</template>

<script>
import axios from 'axios'
import https from 'https'
import Config from '../Config.js'

export default {
  data: () => {
    return {
      templates: []
    }
  },
  mounted: function () {
    this.getTemplates()
  },
  methods: {
    getWebClient() {
      return axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
    },
    getTemplates() {
      this.getWebClient().get(Config.service.BaseUrl + '/iocage/list/template')
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
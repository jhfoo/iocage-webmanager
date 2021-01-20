<template>
    <div>
        <v-toolbar dense flat>
            <v-toolbar-title>Jails</v-toolbar-title>
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
                <tr v-for="item in jails" :key="item.id">
                    <td>{{item.id}}</td>
                    <td><a @click="$emit('SelectJailId', item.name)">{{item.name}}</a></td>
                    <td>{{item.ipv4}}</td>
                    <td>{{item.release}}</td>
                    <td>{{item.state}}</td>
                </tr>
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
      jails: [],
    }
  },
  mounted: function () {
    this.getJails()
  },
  methods: {
    getWebClient() {
      return axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
    },
    async getJails() {
      try {
        let resp = await this.getWebClient().get(Config.service.BaseUrl + '/api/list/')
        this.jails = resp.data
      } catch(err) {
        console.error(err)
      }
    },
  }
}
</script>
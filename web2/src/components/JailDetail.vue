<template>
  <div v-if="JailId">
    <v-toolbar dense flat>
        <v-toolbar-title>Jail Properties ({{JailId}})</v-toolbar-title>
        <v-spacer></v-spacer>

        <template v-if="$vuetify.breakpoint.smAndUp">
            <v-btn icon>
            <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </template>
    </v-toolbar>
    <v-row>
      <v-col md="7">
        <v-row no-gutters>
          <v-col md="4">State</v-col>
          <v-col md="5">{{displayUppercase(properties.state)}}</v-col>
          <v-col md="3"><a href="#" @click="toggleStart">Toggle</a></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="4">Allow raw sockets (eg. PING)</v-col>
          <v-col md="5">{{displayBoolean(properties.allow_raw_sockets)}}</v-col>
          <v-col md="3">
            <v-btn @click="toggleProperty('allow_raw_sockets', 'ToggleRawSocket')" :loading="buttons.ToggleRawSocket.isLoading" text>Toggle</v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="4">Address</v-col>
          <v-col md="5"><input type="text" :value="properties.ip4_addr"/></v-col>
          <v-col md="3">Update</v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="4">Is Template</v-col>
          <v-col md="5">{{displayBoolean(properties.template)}}</v-col>
          <v-col md="3">
            <v-btn @click="toggleProperty('template', 'ToggleTemplate')" :loading="buttons.ToggleTemplate.isLoading" text>Toggle</v-btn>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="4">Boot</v-col>
          <v-col md="5">{{displayBoolean(properties.boot)}}</v-col>
          <v-col md="3"><v-btn @click="toggleProperty('boot', 'ToggleBoot')" :loading="buttons.ToggleRawSocket.isLoading" text>Toggle</v-btn></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="9">Notes<br/>
            <textarea cols="60" rows="10"></textarea>
          </v-col>
          <v-col md="3"><v-btn text>Update</v-btn></v-col>
        </v-row>
      </v-col>
      <v-col md="5">
        Raw Properties
        <v-simple-table fixed-header height="300">
            <template v-slot:default>
                <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="key in FilteredPropertyKeys" v-bind:key="key">
                    <td>{{key}}</td>
                    <td>{{properties[key]}}</td>
                  </tr>
                </tbody>
            </template>
        </v-simple-table>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import axios from 'axios'
import Config from '../Config.js'

export default {
  props: ['JailId'], 
  data: () => {
    return {
      properties: {},
      buttons: {
        ToggleRawSocket: {
          isLoading: false
        },
        ToggleTemplate: {
          isLoading: false
        },
        ToggleBoot: {
          isLoading: false
        }
      }
    }
  },
  mounted: function () {
    if (this.JailId) {
      this.getProperties()
    }
  },
  watch: {
    JailId: function() {
      this.properties = []
      this.getProperties()
    }
  },
  computed: {
    FilteredPropertyKeys: function() {
      let ExcludedKeys = ['ip4_addr', 'allow_raw_sockets', 'template', 'notes']
      return Object.keys(this.properties).reduce((acc, value) => {
        if (!ExcludedKeys.includes(value))
          acc.push(value)
        return acc
      }, [])
    }
  },
  methods: {
    displayUppercase(value) {
      if (!value) {
        return ''
      }
      return value.toUpperCase()
    },
    displayBoolean(value) {
      if (value === null) {
        return ''
      }
      return parseInt(value) === 0 ? 'NO': 'YES'
    },
    toggleStart: function() {
      if (this.properties.state === 'down') {
        axios.get(Config.service.BaseUrl + '/iocage/start/' + this.jailname)
        .then((resp) => {
          console.log(resp.data)
          this.properties = resp.data
        })
        .catch((err) => {
          console.error(err)
        })
      }
      return false
    },
    async setProperty(PropName, NewValue) {
      try {
        let resp = await axios.post(Config.service.BaseUrl + '/iocage/property/' + this.JailId + '/' + PropName, { 
          value: NewValue
        })
        console.log(resp)
        if (resp.data.status === 'OK') {
          this.properties[PropName] = NewValue
        }
      } catch(err) {
        console.error(err)
      }
    },
    async toggleProperty(PropName, BtnName) {
      if (BtnName) {
        this.buttons[BtnName].isLoading = true
      }
      let NewValue;
      switch (PropName) {
        case 'allow_raw_sockets':
          NewValue = parseInt(this.properties[PropName]) === 1 ? 0 : 1
          break
        case 'template':
          NewValue = this.properties[PropName] === '0' ? '1' : '0'
          break
        case 'boot':
          NewValue = parseInt(this.properties[PropName]) === 1 ? 0 : 1
          break
      }
      await this.setProperty(PropName, NewValue)
      if (BtnName) {
        this.buttons[BtnName].isLoading = false
      }
    },
    getProperties: function() {
      axios.get(Config.service.BaseUrl + '/iocage/property/' + this.JailId + '/all')
      .then((resp) => {
        console.log(resp.data)
        this.properties = resp.data
      })
      .catch((err) => {
        console.error(err)
      })
    },
  }
}
</script>
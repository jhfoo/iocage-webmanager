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
          <v-col md="12">
            <v-switch v-model="properties.state" @click="toggleStart('ToggleState')" :loading="buttons.ToggleState.isLoading" :label="'State: ' + displayBoolean(properties.state)" dense></v-switch>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="12">
            <v-switch v-model="properties.allow_raw_sockets" @click="toggleProperty('allow_raw_sockets','ToggleRawSocket')" :loading="buttons.ToggleRawSocket.isLoading" :label="'Allow raw sockets (eg. PING): ' + displayBoolean(properties.allow_raw_sockets)" dense></v-switch>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="12"><v-text-field v-model="properties.ip4_addr" label="Network Address" placeholder="vnet0|your.ip.address.here">
            <template v-slot:append-outer>
              <v-btn @click="toggleProperty('allow_raw_sockets')" text>Update</v-btn>
            </template>
          </v-text-field></v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="12">
            <v-switch v-model="properties.template" @click="toggleProperty('template','ToggleTemplate')" :loading="buttons.ToggleTemplate.isLoading" :label="'Is Template: ' + displayBoolean(properties.template)" dense>
            </v-switch>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="12">
            <v-switch v-model="properties.template" @click="toggleProperty('boot','ToggleBoot')" :loading="buttons.ToggleBoot.isLoading" :label="'Boot: ' + displayBoolean(properties.boot)" dense></v-switch>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="9">
            <v-textarea outlined label="Notes" v-model="properties.notes"></v-textarea>
          </v-col>
          <v-col md="3"><v-btn @click="setProperty('notes', properties.notes)" :loading="buttons.SetNotes.isLoading" text>Update</v-btn></v-col>
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
        SetNotes: {
          isLoading: false
        },
        ToggleRawSocket: {
          isLoading: false
        },
        ToggleState: {
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
      return value ? 'YES': 'NO'
    },
    async toggleStart() {
      let resp
      try {
        this.buttons.ToggleState.isLoading = true
        if (this.properties.state) {
          resp = await axios.get(Config.service.BaseUrl + '/api/stop/' + this.JailId)
        } else {
          resp = await axios.get(Config.service.BaseUrl + '/api/start/' + this.JailId)
        }
        console.log(resp.data)
      } catch (err) {
        console.error(err)
      }
      this.buttons.ToggleState.isLoading = false
      return false
    },
    async setProperty(PropName, NewValue) {
      try {
        let resp = await axios.post(Config.service.BaseUrl + '/api/property/' + this.JailId + '/' + PropName, { 
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
      console.log('BtnName: %s', BtnName)
      if (BtnName) {
        this.buttons[BtnName].isLoading = true
      }
      let NewValue;
      switch (PropName) {
        case 'allow_raw_sockets':
          NewValue = this.properties[PropName] ? 0 : 1
          break
        case 'template':
          NewValue = this.properties[PropName] ? 0 : 1
          break
        case 'boot':
          NewValue = this.properties[PropName] ? 0 : 1
          break
      }
      await this.setProperty(PropName, NewValue)
      if (BtnName) {
        this.buttons[BtnName].isLoading = false
      }
    },
    getProperties: function() {
      axios.get(Config.service.BaseUrl + '/api/property/' + this.JailId + '/all')
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
<template>
  <div v-if="JailId">
    <v-toolbar color="cyan" dark flat>
      <v-toolbar-title>Properties ({{JailId}})</v-toolbar-title>

      <v-spacer></v-spacer>
      <template v-slot:extension>
        <v-tabs v-model="SelectedTab" grow>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab v-for="item in tabs" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>
    <v-tabs-items v-model="SelectedTab">
      <v-tab-item>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ 'State: ' + displayBoolean(properties.state) }}</v-list-item-title>
            <v-list-item-action>
              <v-switch v-model="properties.state" @click="toggleStart('ToggleState')" :loading="buttons.ToggleState.isLoading" dense></v-switch>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>{{ 'Allow raw sockets: ' + displayBoolean(properties.allow_raw_sockets) }}</v-list-item-title>
            <v-list-item-action>
              <v-switch v-model="properties.allow_raw_sockets" @click="toggleProperty('allow_raw_sockets','ToggleRawSocket')" :loading="buttons.ToggleRawSocket.isLoading" dense></v-switch>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>{{ 'Is Template: ' + displayBoolean(properties.template) }}</v-list-item-title>
            <v-list-item-action>
              <v-switch v-model="properties.template" @click="toggleProperty('template','ToggleTemplate')" :loading="buttons.ToggleTemplate.isLoading" dense>
              </v-switch>
            </v-list-item-action>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>{{ 'Boot: ' + displayBoolean(properties.boot) }}</v-list-item-title>
            <v-list-item-action>
              <v-switch v-model="properties.boot" @click="toggleProperty('boot','ToggleBoot')" :loading="buttons.ToggleBoot.isLoading" dense></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-text>
          <v-text-field v-model="properties.ip4_addr" label="Network Address" placeholder="vnet0|your.ip.address.here" append-outer-icon="mdi-send" @click:append-outer="toggleProperty('allow_raw_sockets')">
          </v-text-field>
        </v-card-text>

        <v-row no-gutters>
          <v-col md="9">
            <v-textarea outlined label="Notes" v-model="properties.notes"></v-textarea>
          </v-col>
          <v-col md="3"><v-btn @click="setProperty('notes', properties.notes)" :loading="buttons.SetNotes.isLoading" text>Update</v-btn></v-col>
        </v-row>
      </v-tab-item>
      <v-tab-item>
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
      </v-tab-item>
    </v-tabs-items>
    <!--
        <template v-if="$vuetify.breakpoint.smAndUp">
    -->
  </div>
</template>
<script>
import axios from 'axios'
import Config from '../Config.js'

export default {
  props: ['JailId'], 
  data: () => {
    return {
      SelectedTab: 0,
      tabs: ['Basic', 'Advanced'],
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
          resp = await axios.get(Config.service.BaseUrl + '/stop/' + this.JailId)
        } else {
          resp = await axios.get(Config.service.BaseUrl + '/start/' + this.JailId)
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
        let resp = await axios.post(Config.service.BaseUrl + '/property/' + this.JailId + '/' + PropName, { 
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
          console.log(this.properties[PropName])
          NewValue = this.properties[PropName] ? 1 : 0
          break
        case 'template':
          NewValue = this.properties[PropName] ? 1 : 0
          break
        case 'boot':
          NewValue = this.properties[PropName] ? 1 : 0
          break
      }
      await this.setProperty(PropName, NewValue)
      if (BtnName) {
        this.buttons[BtnName].isLoading = false
      }
    },
    getProperties: function() {
      axios.get(Config.service.BaseUrl + '/property/' + this.JailId + '/all')
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
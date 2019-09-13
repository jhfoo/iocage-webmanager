<template>
  <div class="about">
    <table>
      <tr>
        <td width="50%" style="text-align: left">
          {{jailname}} Raw Properties 
          <table border="1">
            <tr>
              <td>Key</td>
              <td>Value</td>
            </tr>
            <tr v-for="key in FilteredPropertyKeys">
              <td>{{key}}</td>
              <td>{{properties[key]}}</td>
            </tr>
          </table>
        </td>
        <td width="50%" style="text-align: left; vertical-align: top">
          <table>
            <tr>
              <td>State</td>
              <td>{{properties.state}}</td>
              <td><a href="#" @click="toggleStart">Toggle</a></td>
            </tr>
            <tr>
              <td>Address</td>
              <td><input type="text" :value="properties.ip4_addr"/></td>
              <td>Update</td>
            </tr>
            <tr>
              <td>Allow raw sockets (eg. PING)</td>
              <td>{{properties.allow_raw_sockets}}</td>
              <td><a href="#" @click="toggleProperty('allow_raw_sockets')">Toggle</a></td>
            </tr>
            <tr>
              <td>Is Template</td>
              <td>{{properties.template}}</td>
              <td><a href="#" @click="toggleProperty('template')">Toggle</a></td>
            </tr>
            <tr>
              <td>Boot</td>
              <td>{{properties.boot}}</td>
              <td><a href="#" @click="toggleProperty('boot')">Toggle</a></td>
            </tr>
          </table>
          Notes<br/>
          <textarea cols="60" rows="10"></textarea><br/>
          <button>Update Notes</button>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
import axios from 'axios'

export default {
  props: ['jailname'],
  data: () => {
    return {
      properties: {},
    }
  },
  mounted: function () {
    this.wait4RuntimeConfig()
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
    toggleStart: function() {
      if (this.properties.state === 'down') {
        axios.get(this.$store.getters.getRuntimeConfig.ServiceBaseUrl + '/iocage/start/' + this.jailname)
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
    setProperty: function(PropName, NewValue) {
      axios.post(this.$store.getters.getRuntimeConfig.ServiceBaseUrl + '/iocage/property/' + this.jailname + '/' + PropName,
        { value: NewValue})
      .then((resp) => {
        this.properties[PropName] = NewValue
        console.log(resp.data)
      })
      .catch((err) => {
        console.error(err)
      })
    },
    toggleProperty: function(PropName) {
      let NewValue;
      switch (PropName) {
        case 'allow_raw_sockets':
          NewValue = parseInt(this.properties[PropName]) === 1 ? 0 : 1;
          break
        case 'template':
          NewValue = this.properties[PropName] === 'no' ? 'yes' : 'no';
          break
        case 'boot':
          NewValue = this.properties[PropName] === 'off' ? 'on' : 'off';
          break
      }
      this.setProperty(PropName, NewValue)
    },
    wait4RuntimeConfig: function() {
      if (this.$store.getters.getRuntimeConfig.ServiceBaseUrl) {
        this.getProperties()
      } else {
        setTimeout(() => {
          this.wait4RuntimeConfig()
        }, 500)
      }
    },
    getProperties: function() {
      axios.get(this.$store.getters.getRuntimeConfig.ServiceBaseUrl + '/iocage/property/' + this.jailname + '/all')
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
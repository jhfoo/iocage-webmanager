<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2">
        </v-col>
        <v-col cols="12" md="7">
          <v-row>
            <v-col cols="12" md="6">
              <v-card>
                <v-toolbar dense flat>
                  <v-toolbar-title>Jails</v-toolbar-title>
                  <v-spacer></v-spacer>

                  <v-btn icon>
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>

                  <v-toolbar-items>
                    <v-switch v-model="isUpOnly" label="Only Up" class="pt-3"></v-switch>
                  </v-toolbar-items>
                </v-toolbar>

                <v-data-table :headers="JailHeaders" :items="jails" :footer-props="TableFooter" items-per-page="5" item-key="name">
                </v-data-table>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn text>Click</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
// import HelloWorld from '../components/HelloWorld'
import JailMixin from '../mixins/JailMixin'

export default {
  name: 'Home',
  components: {
  },
  mixins: [
    JailMixin
  ],
  data() {
    return {
      JailHeaders: [
        {text: 'Name', value: 'name'},
        {text: 'Status', value: 'state', align: 'center'},
      ],
      isUpOnly: true,
      TableFooter: {
        disableItemsPerPage: true,
        pageText: '',
      }
    }
  },
  mounted() {
    this.jmGetJails()
  },
  computed: {
    jails() {
      if (this.jmJails.length === 0) {
        return []
      }

      if (this.isUpOnly) {
        return this.jmJails.filter((jail) => {
          return jail.state === 'up'
        })
      } else {
        return this.jmJails
      }
    }
  },
  watch: {
    jmJails() {
      // console.log(this.jails[0])
    }
  }
};
</script>

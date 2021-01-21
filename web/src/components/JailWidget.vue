<template>
  <v-card>
    <v-toolbar color="blue" dense flat>
      <v-toolbar-title>Jails</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-toolbar-items>
        <v-switch v-model="isUpOnly" label="Only Up" class="pt-3" color="blue lighten-3"></v-switch>
      </v-toolbar-items>
    </v-toolbar>

    <v-card-text>
      <v-row>
        <v-col cols="4">Up: {{JailSummary.up}}</v-col>
        <v-col cols="4">Down: {{JailSummary.down}}</v-col>
        <v-col cols="4">Total: {{JailSummary.total}}</v-col>
      </v-row>
    </v-card-text>

    <v-data-table :headers="JailHeaders" :items="jails" :footer-props="TableFooter" :items-per-page="TableItemsPerPage" item-key="name" disable-sort>
    </v-data-table>
    <v-card-actions>
      <v-spacer/>
      <v-btn @click="$router.replace('/jails')" text>More</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import JailMixin from '../mixins/JailMixin'

export default {
  name: 'JailWidget',
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
      },
      JailSummary: {
        up: 0,
        down: 0,
        total: 0,
      },
      TableItemsPerPage: 5,
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
    jmJails(NewValue) {
      // update summary
      this.JailSummary = NewValue.reduce((final, jail) => {
        final.total++
        if (jail.state === 'up') {
          final.up++
        } else {
          final.down++
        }

        return final
      }, {
        up: 0,
        down: 0,
        total: 0
      })
    }
  }
};
</script>

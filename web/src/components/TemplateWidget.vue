<template>
  <v-card>
    <v-toolbar color="teal" dense flat>
      <v-toolbar-title>Templates</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card-text>
    <v-row>
      <v-col cols="4">Up: {{summary.up}}</v-col>
      <v-col cols="4">Down: {{summary.down}}</v-col>
      <v-col cols="4">Total: {{summary.total}}</v-col>
    </v-row>
    </v-card-text>

    <v-data-table :headers="DataTable.headers" :items="templates" :footer-props="DataTable.footer" :items-per-page="DataTable.ItemsPerPage" item-key="name" disable-sort>
    </v-data-table>
    <v-card-actions>
      <v-spacer/>
      <v-btn text>More</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import TemplateMixin from '../mixins/TemplateMixin'

export default {
  name: 'JailWidget',
  components: {
  },
  mixins: [
    TemplateMixin
  ],
  data() {
    return {
      DataTable: {
        headers: [
          {text: 'Name', value: 'name'},
          {text: 'Release', value: 'release', align: 'left'},
        ],
        footer: {
          disableItemsPerPage: true,
          pageText: '',
        },
        ItemsPerPage: 5,
      },
      isUpOnly: true,
      summary: {
        up: 0,
        down: 0,
        total: 0,
      },
    }
  },
  mounted() {
    this.tmGetTemplates()
  },
  computed: {
    templates() {
      console.log(this.tmTemplates)
      return this.tmTemplates
    }
  },
  watch: {
    tmTemplates(NewValue) {
      // update summary
      this.summary = NewValue.reduce((final, template) => {
        final.total++
        if (template.state === 'up') {
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

<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col md="3">
        </v-col>
        <v-col cols="12" md="9">
          <v-row>
            <v-col cols="12">
              <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8"><JailList v-on:SelectJailId="SelectedJailId = $event"/></v-col>
            <v-col cols="12" md="4"><JailDetail :JailId="SelectedJailId"/></v-col>
          </v-row>
          <v-row>
            <v-col md="12"></v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import JailList from '../components/JailList.vue'
import JailDetail from '../components/JailDetail.vue'

export default {
  components: {
    JailList,
    JailDetail
  },
  data: () => {
    return {
      SelectedJailId: null,
      breadcrumbs: [
        {
          text: 'Home',
          to: '/'
        },
        {
          text: 'Jails',
          to: '/jails'
        },
      ]
    }
  },
  // watch: {
  //   SelectedJailId: function() {
  //     console.log('Changed!')
  //   }
  // },
  mounted: function () {
  },
  methods: {
    onSelectJail(JailId) {
      console.log('%d selected', JailId)
    }
  }
}
</script>
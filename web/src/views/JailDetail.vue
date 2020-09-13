<template>
  <div>
    <v-container fluid>
      <v-row no-gutters>
        <v-col md="3">
        </v-col>
        <v-col md="9">
          <v-row>
            <v-col md="6">
              <JailList/>
            </v-col>
            <v-col md="6">
              <TemplateList/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script>
import JailList from '../components/JailList.vue'
import TemplateList from '../components/TemplateList.vue'

export default {
  components: {
    JailList,
    TemplateList
  },
  data: () => {
    return {
    }
  },
  mounted: function () {
  },
  methods: {
  }
}
</script>
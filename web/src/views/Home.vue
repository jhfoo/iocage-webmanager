<template>
  <div>
    <v-container fluid>
      <v-row>
        <v-col cols="12" md="2">
        </v-col>
        <v-col cols="12" md="7">
          <v-row>
            <v-col cols="12" md="6">
              <JailWidget/>
            </v-col>
            <v-col cols="12" md="6">
              <TemplateWidget/>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import JailWidget from '../components/JailWidget'
import TemplateWidget from '../components/TemplateWidget'

export default {
  name: 'Home',
  components: {
    JailWidget,
    TemplateWidget
  },
  mixins: [
  ],
  data() {
    return {
    }
  },
  mounted() {
  },
  computed: {
  },
  watch: {
  }
};
</script>

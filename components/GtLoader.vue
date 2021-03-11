<template>
  <v-container>
    <v-row justify="center">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      />
    </v-row>
    <v-row justify="center" style="margin-top: 24px">
      <span>Loading...</span>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'GtLoader'
}
</script>

<style scoped>

</style>

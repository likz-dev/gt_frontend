<template>
  <v-container>
    <gt-loader/>
  </v-container>

</template>

<script>
export default {
  mounted () {
    location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
  }
}
</script>

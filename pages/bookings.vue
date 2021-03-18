<template>
  <v-container>
    <gt-loader v-if="!isBookingsLoaded || isDeleting" />

    <v-list
      v-else
      subheader
      three-line
    >
      <v-list-item
        v-for="booking in userBookings"
        :key="booking.bookingId"
        class="user-booking"
        style="border: 1px solid #e7e7e7; margin-top: 8px"
      >
        <v-list-item-content>
          <v-list-item-title v-text="getCardTitle(booking)" />

          <v-list-item-subtitle
            style="margin-top: 8px;"
            v-text="booking.start + ' to ' + booking.end"
          />
          <v-list-item-subtitle style="margin-top: 8px;" v-text="booking.facilityName" />
        </v-list-item-content>

        <v-list-item-action>
          <v-btn icon>
            <v-icon color="grey lighten-1" @click="deleteBooking(booking.bookingId)">
              mdi-delete
            </v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-container>
</template>

<script>
import api from '@/assets/js/api'
import helper from '@/assets/js/helper'

export default {
  data () {
    return {
      userBookings: [],
      isDeleting: false
    }
  },
  computed: {
    isBookingsLoaded () {
      return !helper.arrayEmpty(this.userBookings)
    }
  },
  mounted () {
    this.setToken()
    this.get_user_bookings()
  },
  methods: {
    getCardTitle (booking) {
      if (helper.nullUndefinedOrBlank(booking.text)) {
        return 'Untitled'
      }
      return booking.text
    },
    setToken () {
      let token = this.$route.query.token
      let email = this.$route.query.email

      if (helper.nullUndefinedOrBlank(token)) {
        token = this.$auth.$storage.getLocalStorage('token')
        email = this.$auth.$storage.getLocalStorage('email')
      } else {
        this.$auth.$storage.setLocalStorage('token', token)
        this.$auth.$storage.setLocalStorage('email', email)
      }

      if (helper.nullUndefinedOrBlank(token)) {
        console.log('token is empty')
        location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
      }
      api.setToken(token)
    },
    get_user_bookings () {
      console.log('get_user_bookings')
      api.get(`/booking?booked_by=${this.$auth.$storage.getLocalStorage('email')}`).then((response) => {
        if (response.success) {
          this.userBookings = response.data.bookings
          console.log(this.userBookings)
        } else {
          console.log(response)
          if (response.data.code === 'token_expired') {
            location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
          }
        }
      })
    },
    deleteBooking (bookingId) {
      this.isDeleting = true
      api.delete('/booking', { booking_id: bookingId }).then((response) => {
        this.isDeleting = false
        if (response.success) {
          window.location.reload()
        } else {
          console.log(response)
          if (response.data.code === 'token_expired') {
            location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
          }
        }
      })
    }
  }
}
</script>

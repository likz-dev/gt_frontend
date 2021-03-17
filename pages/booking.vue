<template>
  <v-container v-if="scDataLoaded">
    <vue-scheduler-lite
      :schedule-data="scData"
      :setting="scSetting"
      @add-event="addEvent"
      @move-event="moveEvent"
      @edit-event="editEvent"
      @delete-event="deleteEvent"
    />

    <v-divider/>

    <v-row style="margin-top: 16px">
      <v-col cols="6">
        <v-text-field
          id="gt-booking-name-field"
          v-model="bookingName"
          label="Meeting Name"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          id="gt-meeting-room-field"
          v-model="selectedMeetingRoom"
          label="Meeting Room"
          readonly
          outlined
        />
      </v-col>
    </v-row>
    <v-row style="margin-top: -32px">
      <v-col cols="6">
        <v-text-field
          id="gt-booking-time-field"
          v-model="bookingTimeString"
          label="Time"
          readonly
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col v-if="errorMessage !== ''" style="margin-top: -32px">
        <span style="color: #a01f1f">
        {{ this.errorMessage }}
        </span>
      </v-col>
      <v-col cols="12" align-self="end" style="margin-top: -24px">
        <v-btn id="gt-submit-button" color="primary" style="float: right" @click="makeBooking" :loading="isSubmitting">
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else>
    <gt-loader/>
  </v-container>
</template>
<script>
import { vueSchedulerLite } from '@/assets/js/vue-scheduler-lite'
import schedulerHelper from '@/assets/js/scheduler_helper'
import api from '@/assets/js/api'
import helper from '@/assets/js/helper'
import GtLoader from '@/components/GtLoader.vue'

export default {
  components: {
    vueSchedulerLite,
    GtLoader
  },
  data () {
    return {
      apiResponse: {},
      scData: [],
      scSetting: {},
      meetingRooms: [],
      bookingName: '',
      startTime: '',
      endTime: '',
      bookingTimeString: '',
      selectedMeetingRoom: '',
      errorMessage: '',
      isSubmitting: false
    }
  },
  computed: {
    scDataLoaded () {
      return !helper.arrayEmpty(this.scData)
    }
  },
  mounted () {
    console.log('mounted')
    this.setToken()
    // console.log(this.$auth.$storage.getLocalStorage('token'))

    // Mount the required javascript file for scheduler
    const polyfillScript = document.createElement('script')
    polyfillScript.setAttribute('src', 'polyfill.js')
    document.head.appendChild(polyfillScript)

    this.getAllFacilities()
  },
  methods: {
    setToken () {
      let token = this.$route.query.token
      console.log(`token is ${token}`)
      if (helper.nullUndefinedOrBlank(token)) {
        token = this.$auth.$storage.getLocalStorage('token')
      } else {
        this.$auth.$storage.setLocalStorage('token', token)
      }

      if (helper.nullUndefinedOrBlank(token)) {
        console.log('token is empty')
        location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
      }
      api.setToken(token)
    },
    getAllFacilities () {
      console.log('getAllFacilities()')
      api.get('/facility/all').then((response) => {
        if (response.success) {
          console.log(response)
          console.log('success')
          console.log(response)
          this.apiResponse = response.data
          this.populateFacilities(response.data)
        } else {
          console.log('failed')
          console.log(response)
          if (response.data.code === 'token_expired') {
            location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
          }
        }
      })
    },
    makeBooking () {
      if (this.validate()) {
        this.isSubmitting = true
        api.post('/book', this.parseRequest()).then((response) => {
          if (response.success) {
            console.log('success')
            this.$router.go()
          } else {
            console.log(response)
            if (response.data.code === 'token_expired') {
              location.replace('http://gt-pi-loadb-uvdhlamggmba-1268143812.us-east-1.elb.amazonaws.com/login')
            }
          }
          this.isSubmitting = false
        })
      }
    },
    validate () {
      if (helper.nullUndefinedOrBlank(this.selectedMeetingRoom)) {
        this.errorMessage = 'Please select a booking slot'
        return false
      }
      return true
    },
    parseRequest () {
      return {
        booking_name: this.bookingName,
        start_time: this.startTime,
        end_time: this.endTime,
        facility_id: this.apiResponse.facilities[this.selectedMeetingRoom].facilityId,
        booked_by: 'likz'
      }
    },
    populateFacilities (apiResponse) {
      this.scData = schedulerHelper.getSchedulerData(apiResponse)
      this.scSetting = schedulerHelper.getSchedulerSettings(apiResponse)
      this.meetingRooms = Object.keys(apiResponse.facilities)
    },
    formatTimeField (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.bookingTimeString = `${startTime} to ${endTime}`
    },
    addEvent (rowIndex, startTime, endTime) {
      this.formatTimeField(startTime, endTime)
      this.selectedMeetingRoom = this.meetingRooms[rowIndex]
    },
    moveEvent (status, rowIndex, startTime, endTime) {
      this.formatTimeField(startTime, endTime)
      this.selectedMeetingRoom = this.meetingRooms[rowIndex]
    },
    editEvent (startTime, endTime) {
      this.formatTimeField(startTime, endTime)
    },
    deleteEvent () {
      this.startTime = ''
      this.endTime = ''
      this.bookingTimeString = ''
      this.selectedMeetingRoom = ''
    },
    clearErrors () {
      this.errorMessage = ''
    }
  }
}

</script>
<style>
.schedule .clear {
  clear: both;
  height: 0;
  line-height: 0;
}

.schedule .sc-rows {
  float: left;
  font-weight: bold;
  background: #4F5D75;
  border-color: #c0c0c0;
  color: white;
  position: relative;
}

.schedule .sc-rows .title {
  background: #2D3142;
}

.schedule .sc-rows .sc-rows-scroll {
  position: absolute;
  left: 0;
  top: 0;
}

.schedule .sc-main-scroll .sc-time {
  color: #FFFFFF;
  padding: 4px 0;
  line-height: 18px;
  height: 18px;
  display: block;
  float: left;
  border-right: solid 1px #CCC;
  text-align: center;
}

.schedule .sc-main-box {
  float: left;
  overflow-x: auto;
  overflow-y: auto;
  background: #e7e7e7;
}

.schedule .sc-main {
  position: relative;
}

.schedule .timeline {
  position: relative;
}

.schedule .sc-bar {
  position: absolute;
  color: #FFF;
  background: #ff4800;
  cursor: pointer;
  z-index: 10;
  border-bottom: 1px solid #333;
  border-right: 1px solid rgba(48, 48, 48, 0.5);
  box-shadow: 0 1px 1px #333;
  -moz-box-shadow: 0 1px 1px #333;
  -webkit-box-shadow: 0 1px 1px #333;
}

.schedule .ui-draggable-dragging,
.schedule .ui-resizeable {
  z-index: 20;
}

.schedule .sc-bar .head {
  display: block;
  padding: 6px 8px 0;
  font-size: 12px;
  height: 64px;
  overflow: hidden;
}

.schedule .sc-bar .text {
  display: block;
  padding: 5px 15px 0;
  font-weight: bold;
  height: 100px;
  overflow: hidden;
}

.schedule .timeline,
.schedule .sc-main .tb {
  border-bottom: solid 1px #666;
}

.schedule .sc-rows .timeline {
  overflow: hidden;
}

.schedule .sc-rows .timeline span {
  padding: 10px;
  display: block;
}

.schedule .sc-rows .timeline span.photo {
  float: left;
  width: 36px;
  height: 36px;
  padding: 10px 0 10px 10px;
}

.schedule .sc-rows .timeline span.title {
  float: left;
  padding: 10px 0 10px 10px;
  width: 92px;
}

.schedule .sc-main-scroll .sc-main .tl {
  float: left;
  height: 100%;
  border-right: solid 1px #737373;
}

.schedule .sc-main-scroll .sc-main .tl:hover {
  background: #F0F0F0;
}

.schedule .sc_header .sc_date {
  width: 100%;
  text-align: center;
  background: black;
  color: white;
  float: left;
  border: 1px solid white;
}

.schedule .sc_header_time {
  float: left;
}

.schedule .sc-time {
  font-size: 10px;
}

.schedule .cant-res {
  background-color: #919191 !important;
}

.schedule .isMe {
  background-color: #108000 !important;
}

.schedule .notMe {
  background-color: #cb6f6f !important;
}

.schedule .newAdd {
  background-color: #108000 !important;
}

.schedule .resizable-e {
  cursor: e-resize;
  width: 10px;
  right: -5px;
  top: 0;
  height: 100%;
  z-index: 90;
  position: absolute;
  font-size: 0.1px;
  display: block;
}

.sample {
  width: 10px;
  height: 10px;
  margin: 5px;
  border: 1px solid black;
}

.cant-res {
  background-color: #999 !important;
}

.reserved {
  background-color: #ec920a !important;
}
</style>

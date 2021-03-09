<template>
  <v-container>
    <vue-scheduler-lite
      :schedule-data="scData"
      :setting="scSetting"
      @add-event="addEvent"
      @move-event="moveEvent"
      @edit-event="editEvent"
      @delete-event="deleteEvent"
    />

    <v-divider />

    <v-row style="margin-top: 16px">
      <v-col cols="6">
        <v-text-field
          v-model="bookingName"
          label="Meeting Name"
          outlined
          clearable
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
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
          v-model="bookingTimeString"
          label="Time"
          readonly
          outlined
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" align-self="end" style="margin-top: -32px">
        <v-btn color="primary" style="float: right">
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { vueSchedulerLite } from 'assets/js/vue-scheduler-lite'
import schedulerHelper from 'assets/js/scheduler_helper'

export default {
  components: {
    vueSchedulerLite
  },
  data () {
    return {
      scData: [],
      scSetting: {},
      meetingRooms: [],
      bookingName: '',
      bookingTimeString: '',
      selectedMeetingRoom: '',
      apiResponse: {
        startDate: '2021/03/09',
        endDate: '2021/03/15',
        facilities: {
          Novena: {
            description: {
              level: 1,
              pax: 4
            },
            schedule: [{
              text: 'Mr.A reserved',
              start: '2021/03/09 18:00',
              end: '2021/03/09 20:00',
              isMe: false
            },
            {
              text: 'Mr.B reserved',
              start: '2021/03/10 15:00',
              end: '2021/03/10 17:00',
              isMe: false
            }
            ]
          },
          'Dhoby Ghaut': {
            description: {
              level: 1,
              pax: 1
            },
            schedule: [{
              text: 'Mr.C reserved',
              start: '2021/03/9 12:00',
              end: '2021/03/9 17:00',
              isMe: false
            }]
          },
          Marina: {
            description: {
              level: 1,
              pax: 8
            },
            schedule: [{
              text: 'Mr.D reserved',
              start: '2021/03/10 12:00',
              end: '2021/03/10 18:00',
              isMe: false
            }]
          }
        }
      }
    }
  },
  created () {
    this.populateFacilities(this.apiResponse)
  },
  mounted () {
    // Mount the required javascript file for scheduler
    const polyfillScript = document.createElement('script')
    polyfillScript.setAttribute('src', 'polyfill.js')
    document.head.appendChild(polyfillScript)
  },
  methods: {
    populateFacilities (apiResponse) {
      this.scData = schedulerHelper.getSchedulerData(apiResponse)
      this.scSetting = schedulerHelper.getSchedulerSettings(apiResponse)
      this.meetingRooms = Object.keys(apiResponse.facilities)
    },
    dateClickEvent (date) {
      console.log('------')
      console.log('DateClickEvent:')
      console.log('Date:' + date)
    },
    rowClickEvent (rowIndex, text) {
      console.log('------')
      console.log('RowClickEvent:')
      console.log('RowIndex:' + rowIndex)
      console.log('RowTitle:' + text)
    },
    clickEvent (startDate, endDate, text, other) {
      console.log('------')
      console.log('ClickEvent:')
      console.log('StartDate:' + startDate)
      console.log('EndDate:' + endDate)
      console.log('ContentText:' + text)
      if (other) {
        console.log('OtherData:')
        console.log(other)
      }
    },
    addEvent (rowIndex, startDate, endDate) {
      console.log('------')
      console.log('AddEvent:')
      console.log('RowIndex:' + rowIndex)
      console.log('StartDate:' + startDate)
      console.log('EndDate:' + endDate)

      this.bookingTimeString = `${startDate} to ${endDate}`
      this.selectedMeetingRoom = this.meetingRooms[rowIndex]
    },
    moveEvent (status, rowIndex, newStartDate, newEndDate) {
      console.log('------')
      console.log('MoveEvent:')
      if (status === 1) {
        console.log('rowIndex:' + rowIndex)
        console.log('NewStartDate:' + newStartDate)
        console.log('NewEndDate:' + newEndDate)
      } else if (status === 2) {
        console.log('Has other event, can\'t move.')
      } else {
        console.log('Not businessDay, can\'t move.')
      }
      this.bookingTimeString = `${newStartDate} to ${newEndDate}`
      this.selectedMeetingRoom = this.meetingRooms[rowIndex]
    },
    editEvent (newStartDate, newEndDate) {
      console.log('------')
      console.log('EditEvent:')
      console.log('NewStartDate:' + newStartDate)
      console.log('NewEndDate:' + newEndDate)
      this.bookingTimeString = `${newStartDate} to ${newEndDate}`
    },
    deleteEvent (row, index) {
      console.log('------')
      console.log('DeleteEvent:')
      console.log('Row:' + row)
      console.log('Index:' + index)
      this.bookingTimeString = ''
      this.selectedMeetingRoom = ''
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
  box-shadow: 1px 1px 1px #333;
  -moz-box-shadow: 1px 1px 1px #333;
  -webkit-box-shadow: 1px 1px 1px #333;
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
  background-color: #ff7a7a !important;
}

.schedule .isMe {
  background-color: #108000 !important;
}

.schedule .notMe {
  background-color: #5d5d5d !important;
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

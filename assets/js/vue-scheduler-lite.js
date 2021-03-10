/**
 * vue-scheduler-lite
 *
 * A support drag and drop scheduler on vue.js
 *
 * @date   2020/04/18
 * @author Lin Masahiro(k80092@hotmail.com)
 * @see https://github.com/linmasahiro/vue-scheduler-lite
 *
 * (c) 2020 Lin masahiro
 * Released under the MIT License.
 */

const unitDiv = {
  props: {
    rowIndex: Number,
    keyIndex: Number,
    width: String,
    rowData: Object,
    isBusiness: Boolean,
    isSelecting: Boolean,
    isSelectingRowIndex: Number
  },
  data () {
    return {}
  },
  methods: {
    mousedown () {
      if (!this.isBusiness) {
        return false
      }
      this.$emit('mouse-down', this.rowIndex, this.keyIndex)
    },
    mouseenter () {
      if (!this.isSelecting || this.rowIndex !== this.isSelectingRowIndex || !this.isBusiness) {
        return false
      }
      this.$emit('mouse-enter', this.keyIndex)
    },
    mouseup () {
      this.$emit('mouse-up')
    },
    setDragenterRowAndIndex () {
      if (!this.isBusiness) {
        return false
      }
      this.$emit('set-dragenter-row-and-index', this.rowIndex, this.keyIndex)
    }
  },
  template: `
    <div
      :class="['tl', isBusiness ? 'can-res' : 'cant-res']"
      :style="{width: width}"
      @mousedown="mousedown"
      @mouseenter="mouseenter"
      @mouseup="mouseup"
      @dragenter="setDragenterRowAndIndex"
    >
    </div>
  `
}

const reservedDiv = {
  props: {
    rowIndex: Number,
    keyNo: Number,
    unitWidth: Number,
    unitHeight: Number,
    titleDivWidth: Number,
    borderWidth: Number,
    startText: String,
    endText: String,
    contentText: String,
    minDate: String,
    maxDate: String,
    unit: Number,
    clearSwitch: Boolean,
    dragenterRowIndex: Number,
    dragenterKeyIndex: Number,
    isSelecting: Boolean,
    isSelectingRowIndex: Number,
    isSelectingIndex: Number,
    isMe: Boolean
  },
  data () {
    return {
      styleObject: {
        Opacity: 1,
        left: '0px',
        width: '0px',
        height: '64px',
        overflow: 'hidden'
      },
      isShow: false,
      mouseXStarted: null,
      startLineNo: null,
      endLineNo: null,
      isEdit: false,
      isMove: false
    }
  },
  created () {
    if ((new Date(this.startText) - new Date(this.minDate)) < 0 && (new Date(this.endText) - new Date(this.minDate)) < 0) {
      return
    }
    this.setLeftPosition()
    this.setWidth()
    this.isShow = true
  },
  watch: {
    startText (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.startDate = newVal
        this.setLeftPosition()
      }
    },
    endText (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.endDate = newVal
        this.setWidth()
        if (this.isSelecting &&
          this.mouseXStarted &&
          this.rowIndex === this.isSelectingRowIndex &&
          this.keyNo === this.isSelectingIndex
        ) {
          const diff = this.getMinutesDiff(new Date(oldVal), new Date(newVal))
          const cnt = parseInt(diff / this.unit)
          this.mouseXStarted += this.unitWidth * cnt
        }
      }
    },
    dragenterKeyIndex (newVal, oldVal) {
      if (newVal !== oldVal && this.dragenterRowIndex === this.rowIndex && this.isEdit) {
        this.editting()
      }
    },
    clearSwitch (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.editEnd()
      }
    }
  },
  methods: {
    /**
     * Set the Block left pixel
     *
     * @returns void
     */
    setLeftPosition () {
      const leftDiff = this.getMinutesDiff(new Date(this.minDate), new Date(this.startText))
      const shiftCnt = parseInt(leftDiff / this.unit)
      this.startLineNo = shiftCnt
      const shiftLeft = this.unitWidth * shiftCnt
      this.styleObject.left = shiftLeft + 'px'
    },
    /**
     * Set the Block width pixel
     *
     * @returns void
     */
    setWidth () {
      const rightDiff = this.getMinutesDiff(new Date(this.startText), new Date(this.endText))
      const widthCnt = parseInt(rightDiff / this.unit)
      this.endLineNo = this.startLineNo + widthCnt
      const width = this.unitWidth * widthCnt
      this.styleObject.width = width + 'px'
    },
    /**
     * Set the Block to edit status
     *
     * @param Object e Event
     *
     * @returns void
     */
    editStart (e) {
      if (this.isSelecting) {
        e.preventDefault()
        return
      }
      this.isEdit = true
      this.mouseXStarted = e.clientX
      this.styleObject.Opacity = 0.5
    },
    /**
     * Adjust time event
     *
     * @param Obejct e Event
     *
     * @returns void
     */
    editting (e) {
      if (this.isSelecting) {
        e.preventDefault()
        return
      }
      if (this.isEdit) {
        if (e) {
          const width = e.x + e.layerX
          if (this.mouseXStarted > width) {
            this.mouseXStarted = width
            return
          }

          // adjust by Mouse X-axio
          const movePx = e.clientX - this.mouseXStarted
          const unitCnt = parseInt(movePx / this.unitWidth)
          if (unitCnt !== 0) {
            this.mouseXStarted = e.clientX
            this.$emit('edit-schedule-data', this.rowIndex, this.keyNo, unitCnt)
          }
        } else {
          // adjust by current unit-div number
          // eslint-disable-next-line no-lonely-if
          if (this.dragenterKeyIndex > this.startLineNo) {
            this.mouseXStarted += this.unitWidth
            const unitCnt = parseInt(this.dragenterKeyIndex - this.endLineNo)
            this.$emit('edit-schedule-data', this.rowIndex, this.keyNo, unitCnt)
          }
        }
      }
    },
    /**
     * End edit and set new data
     *
     * @returns void
     */
    editEnd () {
      if (this.isEdit) {
        this.$emit('edit-event', this.startText, this.endText)
      }
      this.isEdit = false
      this.styleObject.Opacity = 1
      this.mouseXStarted = null
    },
    /**
     * Set the block to move status
     *
     * @param Object e
     */
    moveStart (e) {
      if (this.isSelecting) {
        e.preventDefault()
        return
      }
      if (!this.isEdit) {
        this.styleObject.Opacity = 0.5
        this.isMove = true
        this.mouseXStarted = e.clientX
        this.$emit('set-dragenter-row-and-index', this.rowIndex, null)
      }
    },
    /**
     * End move and set new data
     *
     * @returns void
     */
    moveEnd (e) {
      const mouseXEnd = e.clientX
      // Check move status and move block
      if (this.isMove && (mouseXEnd !== this.mouseXStarted || this.dragenterRowIndex !== this.rowIndex)) {
        // get x-axis moved count
        const moveXPx = mouseXEnd - this.mouseXStarted
        let unitCnt = parseInt(moveXPx / this.unitWidth)
        const halfWidth = parseInt(this.unitWidth / 2)
        const modXPx = parseInt(moveXPx % this.unitWidth)
        if (moveXPx < 0 && Math.abs(modXPx) >= halfWidth) {
          unitCnt--
        }
        this.mouseXStarted = null

        if (unitCnt !== 0 || this.dragenterRowIndex !== this.rowIndex) {
          // result pass to father component's method
          this.$emit('move-schedule-data', this.rowIndex, this.keyNo, unitCnt)
        }
      }

      // Return block all status and opacity
      this.isEdit = false
      this.isMove = false
      this.styleObject.Opacity = 1
    },
    /**
     * Delete this event
     */
    deleteEvent () {
      this.$emit('delete-schedule-data', this.rowIndex, this.keyNo)
    },
    /**
     * Mouse move event for Add new schedule
     */
    mousemove (e) {
      if (
        this.rowIndex === this.isSelectingRowIndex &&
        this.keyNo === this.isSelectingIndex
      ) {
        if (this.isSelecting && this.mouseXStarted) {
          const movePx = e.clientX - this.mouseXStarted
          const unitCnt = parseInt(movePx / this.unitWidth)
          if (unitCnt !== 0 && unitCnt < 0) {
            this.mouseXStarted = e.clientX + this.unitWidth
            this.$emit('edit-schedule-data', this.rowIndex, this.keyNo, unitCnt)
          }
        }
        if (this.isSelecting && !this.mouseXStarted) {
          this.mouseXStarted = e.clientX
          this.styleObject.Opacity = 0.5
        }
      }
    },
    /**
     * Mouse up event for Add new schedule
     */
    mouseup () {
      this.$emit('mouse-up', this.startText, this.endText)
    },
    /**
     * Get minutes diff between date1 and date2
     *
     * @param Object date1 DateObject1
     * @param Object date2 DateObject2
     *
     * @returns Int
     */
    getMinutesDiff (date1, date2) {
      const diffTime = date2 - date1
      return Math.ceil(diffTime / (1000 * 60))
    }
  },
  template: `
    <div
      v-if="isShow"
      :class="['sc-bar', isMe ? 'isMe' : 'notMe']"
      :style="styleObject"
      :draggable="'true'"
      @dragstart="moveStart"
      @dragend="moveEnd"
      @dragover="editting($event)"
      @mouseup="mouseup"
      @mousemove="mousemove"
      @click="$emit('click-event')"
    >
    <span v-if="isMe" style="float: right; padding: 5px" @click="deleteEvent">✖</span>
    <span class="head">
      <span class="time">{{ contentText }}</span>
<!--              <span class="startTime time">{{ startText }}</span>～<span class="endTime time">{{ endText }}</span>-->
    </span>
    <div
      class="resizable-e"
      :draggable="'true'"
      @dragstart="editStart"
      @dragend="editEnd"
    ></div>
    </div>
  `
}

// eslint-disable-next-line no-unused-vars
export const vueSchedulerLite = {
  components: {
    'unit-div': unitDiv,
    'reserved-div': reservedDiv
  },
  props: {
    scheduleData: Array,
    setting: Object
  },
  data () {
    return {
      settingData: {
        startDate: '2020/04/20',
        endDate: '2020/04/26',
        weekdayText: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        unit: 60,
        borderW: 1,
        dateDivH: 25,
        timeDivH: 25,
        unitDivW: 25,
        titleDivW: 200,
        rowH: 135
      },
      padding: 0,
      timeDivW: 0,
      dateDivW: 0,
      contentH: 0,
      contentW: 0,
      dateCnt: 0,
      unitCnt: 0,
      isSelecting: false,
      isSelectingRowIndex: null,
      isSelectingIndex: null,
      dragenterRowIndex: null,
      dragenterKeyIndex: null,
      clearSwitch: false
    }
  },
  created () {
    this.settingData = Object.assign(this.settingData, this.setting)
    this.dateCnt = this.getDateDiff(new Date(this.settingData.startDate), new Date(this.settingData.endDate)) + 1
    const oneDayCnt = parseInt(1440 / this.settingData.unit)
    this.unitCnt = oneDayCnt * this.dateCnt
    this.padding = this.settingData.dateDivH + this.settingData.timeDivH + (this.settingData.borderW * 4)
    this.dateDivW = this.settingData.unitDivW * oneDayCnt + (oneDayCnt - this.settingData.borderW)
    this.contentH = ((this.settingData.rowH + this.settingData.borderW * 2) * this.scheduleData.length)
    this.contentW = this.dateDivW * this.dateCnt + (this.dateCnt * this.settingData.borderW)
    this.timeDivW = 60 / this.settingData.unit * (this.settingData.unitDivW + this.settingData.borderW) - 1
  },
  methods: {
    /**
     * Draggable Enter Event
     *
     * @param int rowIndex Row Index
     *
     * @returns void
     */
    setDragenterRow (rowIndex) {
      this.dragenterRowIndex = rowIndex
    },
    /**
     * Draggable Enter Event
     *
     * @param int rowIndex     Row Index
     * @param int currentIndex Current Index
     *
     * @returns void
     */
    setDragenterRowAndIndex (rowIndex, currentIndex) {
      this.dragenterRowIndex = rowIndex
      this.dragenterKeyIndex = currentIndex
    },
    /**
     * Disable HTML5 DragEnd animation and Set mouse position
     *
     * @param Obejct e Event
     */
    disableDragendAnimation (e) {
      e.preventDefault()
    },
    /**
     * Get header area date-text
     *
     * @param Int n Col index
     *
     * @returns String
     */
    getHeaderDate (n) {
      const startDate = this.addDays(new Date(this.settingData.startDate), n)
      return this.dateFormatter(startDate, true)
    },
    /**
     * Get header area time-text
     *
     * @param {*} n Col index
     */
    getHeaderTime (n) {
      return n % 24
    },
    /**
     * Get diff day between date1 and date2
     *
     * @param Object date1 DateObejct1
     * @param Object date2 DateObejct2
     *
     * @returns Int
     */
    getDateDiff (date1, date2) {
      const diffTime = Math.abs(date2 - date1)
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    },
    /**
     * Custom date formatter
     *
     * @param Obejct  dateObj     DateObejct
     * @param Boolean withWeekDay If u need weekday, set True
     *
     * @returns String
     */
    dateFormatter (dateObj, withWeekDay) {
      const year = dateObj.getFullYear()
      let month = dateObj.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      const date = dateObj.getDate()
      if (withWeekDay) {
        const day = dateObj.getDay()
        const dayText = this.settingData.weekdayText[day]
        return year + '/' + month + '/' + date + '(' + dayText + ')'
      }
      return year + '/' + month + '/' + date
    },
    /**
     * Custom datetime formatter
     *
     * @param Obejct  dateObj     DateObejct
     *
     * @returns String
     */
    datetimeFormatter (dateObj) {
      const year = dateObj.getFullYear()
      let month = dateObj.getMonth() + 1
      if (month < 10) {
        month = '0' + month
      }
      const date = dateObj.getDate()
      let hours = dateObj.getHours()
      if (hours < 10) {
        hours = '0' + hours
      }
      let minutes = dateObj.getMinutes()
      if (minutes < 10) {
        minutes = '0' + minutes
      }
      return year + '/' + month + '/' + date + ' ' + hours + ':' + minutes
    },
    /**
     * Add days to object
     *
     * @param Obejct dateObj DateObject
     * @param Int    n       Add number
     *
     * @returns Object
     */
    addDays (dateObj, n) {
      dateObj.setTime(dateObj.getTime() + (n * 60 * 60 * 24 * 1000))
      return dateObj
    },
    /**
     * Add minutes to date object
     *
     * @param Obejct dateObj DateObject
     * @param Int    n       Add number
     *
     * @returns Object
     */
    addMinutes (dateObj, n) {
      dateObj.setTime(dateObj.getTime() + (n * 60 * 1000))
      return dateObj
    },
    /**
     * Check this div is business or not
     *
     * @param Int rowIndex Row index
     * @param Int n        Col index
     *
     * @returns Boolean
     */
    isBusiness (rowIndex, n) {
      // first check this div business day
      const startDate = new Date(this.settingData.startDate)
      const oneDayCnt = parseInt(1440 / this.settingData.unit)
      const thisDate = this.addDays(startDate, parseInt(n / oneDayCnt))
      const noBusinessDate = this.scheduleData[rowIndex].noBusinessDate
      if (noBusinessDate.includes(this.dateFormatter(thisDate))) {
        // today not business day
        return false
      }

      // and check this div time business hour
      const weekDay = thisDate.getDay()
      const businessHour = this.scheduleData[rowIndex].businessHours[weekDay]
      if (businessHour.start === '00:00' && businessHour.end === '24:00') {
        // alltime
        return true
      }

      // has business hour
      const businessStartTime = businessHour.start.replace(':', '')
      const businessEndTime = businessHour.end.replace(':', '')
      const dateMod = n % oneDayCnt
      const divStartCnt = dateMod * this.settingData.unit
      let divStartHour = parseInt(divStartCnt / 60)
      if (divStartHour < 10) {
        divStartHour = '0' + divStartHour
      }
      let divStartMin = parseInt(divStartCnt % 60)
      if (divStartMin < 10) {
        divStartMin = '0' + divStartMin
      }
      const divStartTime = divStartHour + '' + divStartMin
      if (divStartTime >= businessStartTime && divStartTime < businessEndTime) {
        return true
      }
      return false
    },
    /**
     * Check this range is business or not
     *
     * @param Int    rowIndex      Row index
     * @param String startDateText StartDate text
     * @param String endDateText   EndDate text
     *
     * @returns Boolean
     */
    isBusinessOnRange (rowIndex, startDateText, endDateText) {
      const startDiff = this.getMinutesDiff(new Date(this.settingData.startDate), new Date(startDateText))
      const startCnt = parseInt(startDiff / this.settingData.unit)
      const endDiff = this.getMinutesDiff(new Date(this.settingData.startDate), new Date(endDateText))
      const endCnt = parseInt(endDiff / this.settingData.unit)
      let result = true
      for (let i = startCnt; i < endCnt; i++) {
        if (!this.isBusiness(rowIndex, i)) {
          result = false
        }
      }
      return result
    },
    /**
     * Check this range has other event
     *
     * @param Int    index         Data index
     * @param Int    oldRowIndex   Old row index
     * @param Int    newRowIndex   New row index
     * @param String startDateText StartDate text
     * @param String endDateText   EndDate text
     *
     * @returns Boolean
     */
    hasOtherEvent (index, oldRowIndex, newRowIndex, startDateText, endDateText) {
      for (let n = 0; n < this.scheduleData[newRowIndex].schedule.length; n++) {
        if (n !== index || oldRowIndex !== newRowIndex) {
          const diffData = this.scheduleData[newRowIndex].schedule[n]
          if (
            new Date(diffData.start) - new Date(startDateText) >= 0 &&
            new Date(diffData.end) - new Date(endDateText) <= 0
          ) {
            return true
          }
          if (
            new Date(diffData.start) - new Date(startDateText) >= 0 &&
            new Date(diffData.start) - new Date(endDateText) < 0
          ) {
            return true
          }
          if (
            new Date(diffData.start) - new Date(startDateText) <= 0 &&
            new Date(diffData.end) - new Date(startDateText) > 0
          ) {
            return true
          }
        }
      }
      return false
    },
    /**
     * The column are click start event
     *
     * @param Object e Event
     *
     * @returns void
     */
    selectStartTime (rowIndex, keyIndex) {
      this.isSelecting = true
      this.isSelectingRowIndex = rowIndex
      const addMinutes = (keyIndex - 1) * this.settingData.unit
      const addMinutes2 = keyIndex * this.settingData.unit
      const newStartDateObj = this.addMinutes(new Date(this.settingData.startDate), addMinutes)
      const newEndDateObj = this.addMinutes(new Date(this.settingData.startDate), addMinutes2)
      this.deleteAllIsMe()
      this.scheduleData[rowIndex].schedule.push({
        text: 'New',
        start: this.datetimeFormatter(newStartDateObj),
        end: this.datetimeFormatter(newEndDateObj),
        isMe: true
      })
      this.isSelectingIndex = (this.scheduleData[this.isSelectingRowIndex].schedule.length - 1)
    },

    deleteAllIsMe () {
      for (let i = 0; i < this.scheduleData.length; i++) {
        const data = this.scheduleData[i].schedule
        this.scheduleData[i].schedule = data.filter(e => !e.isMe)
      }
    },
    /**
     * New event adjust event
     *
     * @param int keyIndex
     */
    adjustTimeRange (keyIndex) {
      const targetIndex =
        this.scheduleData[this.isSelectingRowIndex].schedule.length - 1
      const targetData = this.scheduleData[this.isSelectingRowIndex].schedule[
        targetIndex
      ]

      if (targetData) {
        const addMinutes = keyIndex * this.settingData.unit
        const newEndDateObj = this.addMinutes(
          new Date(this.settingData.startDate),
          addMinutes
        )
        const newEndDateText = this.datetimeFormatter(newEndDateObj)
        let isPermission = true

        // Check other event
        if (
          this.hasOtherEvent(
            targetIndex,
            this.isSelectingRowIndex,
            this.isSelectingRowIndex,
            targetData.start,
            newEndDateText
          )
        ) {
          isPermission = false
        }

        // Check Businessday
        if (isPermission) {
          isPermission = this.isBusinessOnRange(
            this.isSelectingRowIndex,
            targetData.start,
            newEndDateText
          )
        }
        if (isPermission) {
          targetData.end = newEndDateText
        }
      }
    },
    /**
     * Add new block event
     *
     * @param Boolean isAdd     Is add event action
     * @param String  startDate StartDate text
     * @param String  endDate   EndDate text
     *
     * @returns void
     */
    selectEndTime (startDate, endDate) {
      if (this.isSelecting) {
        if (startDate === undefined) {
          const targetData = this.scheduleData[this.isSelectingRowIndex].schedule[this.scheduleData[this.isSelectingRowIndex].schedule.length - 1]
          startDate = targetData.start
          endDate = targetData.end
        }
        this.$emit('add-event', this.isSelectingRowIndex, startDate, endDate)
      }
      this.isSelecting = false
      this.isSelectingRowIndex = null
      this.isSelectingIndex = null
      this.clearSwitch = !this.clearSwitch
    },
    /**
     * Edit Schedule Datetime Text
     *
     * @param int rowIndex     Row Index
     * @param int keyNo        Key
     * @param int unitCnt      Moved unit count
     *
     * @returns void
     */
    moveScheduleData (rowIndex, keyNo, unitCnt) {
      const targetData = this.scheduleData[rowIndex].schedule[keyNo]
      if (targetData && targetData.isMe) {
        let status = 0
        let isBusinessFlag = true
        let isBusinessChecked = false
        const changeDatetimeText = (datetimeText) => {
          const addMinutes = unitCnt * this.settingData.unit
          const dateObj = new Date(datetimeText)
          const newDateObj = this.addMinutes(dateObj, addMinutes)
          return this.datetimeFormatter(newDateObj)
        }
        const newStartDatetime = changeDatetimeText(targetData.start)
        const newEndDatetime = changeDatetimeText(targetData.end)

        if (unitCnt !== 0) {
          if (
            this.hasOtherEvent(
              keyNo,
              rowIndex,
              this.dragenterRowIndex,
              newStartDatetime,
              newEndDatetime
            )
          ) {
            status = 2
          } else {
            isBusinessFlag = this.isBusinessOnRange(
              this.dragenterRowIndex,
              newStartDatetime,
              newEndDatetime
            )
            if (isBusinessFlag) {
              targetData.start = newStartDatetime
              targetData.end = newEndDatetime
              status = 1
            }
            isBusinessChecked = true
          }
        }
        if (
          rowIndex !== this.dragenterRowIndex &&
          this.scheduleData[this.dragenterRowIndex]
        ) {
          if (isBusinessChecked && !isBusinessFlag) {
            this.$emit('move-event', status)
            return
          }
          if (!isBusinessChecked && isBusinessFlag) {
            if (
              this.hasOtherEvent(
                keyNo,
                rowIndex,
                this.dragenterRowIndex,
                newStartDatetime,
                newEndDatetime
              )
            ) {
              status = 2
              this.$emit('move-event', status)
              return
            }
            isBusinessFlag = this.isBusinessOnRange(
              this.dragenterRowIndex,
              targetData.start,
              targetData.end
            )
            isBusinessChecked = true
          }
          if (isBusinessChecked && isBusinessFlag) {
            this.scheduleData[this.dragenterRowIndex].schedule.push(targetData)
            this.scheduleData[rowIndex].schedule.splice(keyNo, 1)
            status = 1
          }
        }
        this.$emit('move-event', status, this.dragenterRowIndex, targetData.start, targetData.end)
      }
    },
    /**
     * Edit Schedule Datetime Text
     *
     * @param int rowIndex  Row
     * @param int keyNo     Key
     * @param int unitCnt   Moved unit count
     *
     * @returns void
     */
    editScheduleData (rowIndex, keyNo, unitCnt) {
      const targetData = this.scheduleData[rowIndex].schedule[keyNo]
      if (targetData && targetData.isMe) {
        const changeDatetimeText = (datetimeText) => {
          const addMinutes = unitCnt * this.settingData.unit
          const dateObj = new Date(datetimeText)
          const newDateObj = this.addMinutes(dateObj, addMinutes)
          return this.datetimeFormatter(newDateObj)
        }
        const newEndText = changeDatetimeText(targetData.end)
        if (this.hasOtherEvent(keyNo, rowIndex, rowIndex, targetData.start, newEndText)) {
          return
        }
        targetData.end = newEndText
      }
    },
    /**
     * Delete Schedule
     *
     * @param int rowIndex  Row
     * @param int keyNo     Key
     *
     * @returns void
     */
    deleteScheduleData (rowIndex, keyNo) {
      this.scheduleData[rowIndex].schedule.splice(keyNo, 1)
      this.$emit('delete-event', rowIndex, keyNo)
    },
    /**
     * Get minutes diff between date1 and date2
     *
     * @param Object date1 DateObject1
     * @param Object date2 DateObject2
     *
     * @returns Int
     */
    getMinutesDiff (date1, date2) {
      const diffTime = Math.abs(date2 - date1)
      return Math.ceil(diffTime / (1000 * 60))
    }
  },
  template: `
    <div
      class="schedule"
      @dragover="disableDragendAnimation"
    >
    <div>
      <div
        class="sc-rows"
        :style="{width: settingData.titleDivW + '%', height: contentH + 'px'}"
      >
        <div
          class="sc-rows-scroll"
          :style="{width: '100%'}"
        >
          <div :style="{height: padding-4 + 'px', 'border-bottom': '1px solid #333', 'background-color': 'white'}">
            <span>Rooms</span>
          </div>

          <div
            v-for="(row, index) in scheduleData"
            :key="index"
            :class="'timeline title'"
            :style="{'height': settingData.rowH + 'px'}"
            @click="$emit('row-click-event', index, row.title)"
          >
            <div style="cursor: pointer; height: 64px">
              <span style="font-size: 16px; margin-top: -4px; font-weight: bold;">{{ row.title }}</span>
              <span style="font-size: 12px; margin-top: -32px; font-weight: normal;">Level {{row.level}}, Max Pax: {{row.pax}}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="sc-main-box" :style="{width: (100 - settingData.titleDivW) + '%'}">
        <div
          class="sc-main-scroll"
          :style="{width: contentW - 336 + 'px'}"
        >
          <div class="sc-main">
            <div
              class="timeline"
              :style="{height: settingData.dateDivH + 'px', background: '#2D3142'}"
            >
              <div
                v-for="n in dateCnt"
                :key="n"
                class="sc-time"
                :style="{width: dateDivW - 47 + 'px', cursor: 'pointer'}"
                @click="$emit('date-click-event', getHeaderDate(n-1))"
              >
                {{ getHeaderDate(n - 1) }}
              </div>
            </div>
            <div
              class="timeline"
              :style="{height: settingData.timeDivH + 'px', background: '#4F5D75'}"
            >
              <div
                v-for="n in (dateCnt * 24)"
                :key="n"
                class="sc-time"
                :style="{width: timeDivW - 1 + 'px'}"
              >
                {{ getHeaderTime(n - 1) }}
              </div>
            </div>
            <div
              v-for="(row, index) in scheduleData"
              :key="index"
              :class="'timeline'"
              :style="{'height': settingData.rowH + 'px'}"
              @dragenter="setDragenterRow(index)"
            >
              <unit-div
                v-for="n in unitCnt"
                :key="'unit' + n"
                :row-index="index"
                :key-index="n"
                :row-data="row"
                :is-business="isBusiness(index, (n - 1))"
                :is-selecting="isSelecting"
                :is-selecting-row-index="isSelectingRowIndex"
                :width="settingData.unitDivW + 'px'"
                @mouse-down="selectStartTime"
                @mouse-enter="adjustTimeRange"
                @mouse-up="selectEndTime"
                @set-dragenter-row-and-index="setDragenterRowAndIndex"
              ></unit-div>
              <reserved-div
                v-for="(detail, keyNo) in row.schedule"
                :key="'res' + keyNo"
                :schedule-detail="detail"
                :row-index="index"
                :key-no="keyNo"
                :isMe="detail.isMe"
                :start-text="detail.start"
                :end-text="detail.end"
                :content-text="detail.text"
                :description-text="row.description"
                :unit-width="settingData.unitDivW"
                :unit-height="settingData.rowH"
                :title-div-width="settingData.titleDivW"
                :border-width="settingData.borderW"
                :min-date="settingData.startDate"
                :max-date="settingData.endDate"
                :unit="settingData.unit"
                :clear-switch="clearSwitch"
                :dragenter-row-index="dragenterRowIndex"
                :dragenter-key-index="dragenterKeyIndex"
                :is-selecting="isSelecting"
                :is-selecting-row-index="isSelectingRowIndex"
                :is-selecting-index="isSelectingIndex"
                @set-dragenter-row-and-index="setDragenterRowAndIndex"
                @move-schedule-data="moveScheduleData"
                @edit-schedule-data="editScheduleData"
                @delete-schedule-data="deleteScheduleData"
                @mouse-up="selectEndTime"
                @move-event="$emit('move-event')"
                @edit-event="$emit('edit-event', detail.start, detail.end)"
                @click-event="$emit('click-event', detail.start, detail.end, detail.text, detail.data)"
              ></reserved-div>
            </div>
          </div>
        </div>
      </div>
      <br class="clear">
    </div>
    </div>
  `
}

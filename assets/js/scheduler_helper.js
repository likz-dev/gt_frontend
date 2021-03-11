// /**
//  * Sample
//  *
//  * @date   2020/04/18
//  * @author Lin Masahiro(k80092@hotmail.com)
//  * @see https://github.com/linmasahiro/vue-scheduler-lite
//  */
//
import helper from '@/assets/js/helper'

const businessHours = [{
  start: '00:00',
  end: '24:00'
},
{
  start: '00:00',
  end: '24:00'
},
{
  start: '00:00',
  end: '24:00'
},
{
  start: '00:00',
  end: '24:00'
},
{
  start: '00:00',
  end: '24:00'
},
{
  start: '00:00',
  end: '24:00'
},
{
  start: '00:00',
  end: '24:00'
}]

function getBusinessHours () {
  const weekDay = helper.getCurrentDay()
  businessHours[weekDay] = {
    start: helper.getCurrentTime(),
    end: '24:00'
  }
  return businessHours
}

const schedulerHelper = {
  getSchedulerData (apiResponse) {
    const data = []
    for (const [key, value] of Object.entries(apiResponse.facilities)) {
      data.push({
        title: key,
        level: value.level,
        pax: value.pax,
        noBusinessDate: [],
        businessHours: getBusinessHours(),
        schedule: value.schedule,
        data: {
          something: 'something'
        }
      })
    }
    return data
  },

  getSchedulerSettings (apiResponse) {
    return {
      startDate: apiResponse.startDate,
      endDate: apiResponse.endDate,
      weekdayText: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      unit: 30, // Minutes
      borderW: 1, // Px
      dateDivH: 25, // Px
      timeDivH: 25, // Px
      unitDivW: 24, // Px
      titleDivW: 16, // Percent
      rowH: 64 // Px
    }
  }
}

export default schedulerHelper

// console.log(data)
//
// export const schedulerData = data
//
// export const schedulerSettings =
// export const sampleSetting = {
//   startDate: '2021/03/08',
//   endDate: '2021/03/14',
//   weekdayText: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//   unit: 60, // Minutes
//   borderW: 1, // Px
//   dateDivH: 25, // Px
//   timeDivH: 25, // Px
//   unitDivW: 24, // Px
//   titleDivW: 16, // Percent
//   rowH: 64 // Px
// }

// /**
//  * Sample
//  *
//  * @date   2020/04/18
//  * @author Lin Masahiro(k80092@hotmail.com)
//  * @see https://github.com/linmasahiro/vue-scheduler-lite
//  */
//
import helper from 'assets/js/helper'

// eslint-disable-next-line no-unused-vars
const sampleAPIResponse = {
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

const data = []
for (const [key, value] of Object.entries(sampleAPIResponse.facilities)) {
  data.push({
    title: key,
    description: value.description,
    noBusinessDate: [],
    businessHours: getBusinessHours(),
    schedule: value.schedule,
    data: {
      something: 'something'
    }
  })
}
console.log(data)

export const schedulerData = data

export const schedulerSettings = {
  startDate: sampleAPIResponse.startDate,
  endDate: sampleAPIResponse.endDate,
  weekdayText: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  unit: 30, // Minutes
  borderW: 1, // Px
  dateDivH: 25, // Px
  timeDivH: 25, // Px
  unitDivW: 24, // Px
  titleDivW: 16, // Percent
  rowH: 64 // Px
}
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

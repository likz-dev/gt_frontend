// /**
//  * Sample
//  *
//  * @date   2020/04/18
//  * @author Lin Masahiro(k80092@hotmail.com)
//  * @see https://github.com/linmasahiro/vue-scheduler-lite
//  */
//
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

export const sampleData = [{
  title: 'Novena',
  noBusinessDate: [
    // '2020/04/20'
  ],
  businessHours,
  schedule: [{
    text: 'Mr.A reserved',
    start: '2020/04/21 06:00',
    end: '2020/04/22 01:00',
    isMe: false,
    data: {
      something: 'something'
    }
  },
  {
    text: 'Mr.B reserved',
    start: '2020/04/22 06:00',
    end: '2020/04/22 12:00',
    isMe: false,
    data: {
      something: 'something'
    }
  }
  ]
},
{
  title: 'Dhoby Ghaut',
  noBusinessDate: [],
  businessHours,
  schedule: [{
    text: 'Mr.C reserved',
    start: '2020/04/20 12:00',
    end: '2020/04/20 17:00',
    isMe: false,
    data: {
      something: 'something'
    }
  }]
},
{
  title: 'Marina',
  noBusinessDate: [],
  businessHours,
  schedule: [{
    text: 'Mr.D reserved',
    start: '2020/04/20 12:00',
    end: '2020/04/20 18:00',
    isMe: true,
    data: {
      something: 'something'
    }
  }]
}
]

export const sampleSetting = {
  startDate: '2020/04/20',
  endDate: '2020/04/26',
  weekdayText: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  unit: 60, // Minutes
  borderW: 1, // Px
  dateDivH: 25, // Px
  timeDivH: 25, // Px
  unitDivW: 24, // Px
  titleDivW: 16, // Percent
  rowH: 64 // Px
}

// new Vue({
//   el: '#app',
//   components: {
//     sc: vueSchedulerLite
//   },
//   data () {
//     return {
//       scData: sampleData,
//       setting: sampleSetting
//     }
//   },
//   methods: {
//     dateClickEvent (date) {
//       console.log('------')
//       console.log('DateClickEvent:')
//       console.log('Date:' + date)
//     },
//     rowClickEvent (rowIndex, text) {
//       console.log('------')
//       console.log('RowClickEvent:')
//       console.log('RowIndex:' + rowIndex)
//       console.log('RowTitle:' + text)
//     },
//     clickEvent (startDate, endDate, text, other) {
//       console.log('------')
//       console.log('ClickEvent:')
//       console.log('StartDate:' + startDate)
//       console.log('EndDate:' + endDate)
//       console.log('ContentText:' + text)
//       if (other) {
//         console.log('OtherData:')
//         console.log(other)
//       }
//     },
//     addEvent (rowIndex, startDate, endDate) {
//       console.log('------')
//       console.log('AddEvent:')
//       console.log('RowIndex:' + rowIndex)
//       console.log('StartDate:' + startDate)
//       console.log('EndDate:' + endDate)
//     },
//     moveEvent (status, newStartDate, newEndDate) {
//       console.log('------')
//       console.log('MoveEvent:')
//       if (status == 1) {
//         console.log('NewStartDate:' + newStartDate)
//         console.log('NewEndDate:' + newEndDate)
//       } else if (status == 2) {
//         console.log('Has other event, can\'t move.')
//       } else {
//         console.log('Not businessDay, can\'t move.')
//       }
//     },
//     editEvent (newStartDate, newEndDate) {
//       console.log('------')
//       console.log('EditEvent:')
//       console.log('NewStartDate:' + newStartDate)
//       console.log('NewEndDate:' + newEndDate)
//     },
//     deleteEvent (row, index) {
//       console.log('------')
//       console.log('DeleteEvent:')
//       console.log('Row:' + row)
//       console.log('Index:' + index)
//     },
//     addNewRow () {
//       const newTitle = 'Room' + (this.scData.length + 1)
//       this.scData.push({
//         title: newTitle,
//         noBusinessDate: [],
//         businessHours: [{
//           start: '00:00',
//           end: '24:00'
//         },
//         {
//           start: '00:00',
//           end: '24:00'
//         },
//         {
//           start: '00:00',
//           end: '24:00'
//         },
//         {
//           start: '00:00',
//           end: '24:00'
//         },
//         {
//           start: '00:00',
//           end: '24:00'
//         },
//         {
//           start: '00:00',
//           end: '24:00'
//         },
//         {
//           start: '00:00',
//           end: '24:00'
//         }
//         ],
//         schedule: []
//       })
//     }
//   }
// })

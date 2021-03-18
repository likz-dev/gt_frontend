import { shallowMount } from '@vue/test-utils'
import booking from '@/pages/booking.vue'
import api from '@/assets/js/api'

const sampleAPIResponse = {
  startDate: '2021/03/09',
  endDate: '2021/03/15',
  facilities: {
    Novena: {
      level: 1,
      pax: 4,
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
      level: 1,
      pax: 1,
      schedule: [{
        text: 'Mr.C reserved',
        start: '2021/03/9 12:00',
        end: '2021/03/9 17:00',
        isMe: false
      }]
    },
    Marina: {
      level: 1,
      pax: 8,
      schedule: [{
        text: 'Mr.D reserved',
        start: '2021/03/10 12:00',
        end: '2021/03/10 18:00',
        isMe: false
      }]
    }
  }
}

const $route = {
  path: '/',
  query: {
    token: 'sample_token',
    email: 'likz'
  }
}

const $auth = {
  $storage: {
    getLocalStorage (key) {
      if (key === 'email') {
        return 'likz'
      }
    },
    setLocalStorage (key, val) {

    }
  }
}

const $router = {
  push: jest.fn()
}

const { location } = window

describe('Booking page', () => {
  let wrapper
  beforeEach(() => {
    wrapper = shallowMount(booking, {
      propsData: {},
      mocks: {
        $route,
        $auth,
        $router
      }
    })

    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-03-11 08:00').getTime())

    jest.spyOn(api, 'get').mockImplementation(() => Promise.resolve({
      success: true,
      data: sampleAPIResponse
    }))
  })

  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('contains the right components', () => {
    expect(wrapper.find('vue-scheduler-lite')).toBeTruthy()
    expect(wrapper.find('#gt-booking-name-field')).toBeTruthy()
    expect(wrapper.find('#gt-meeting-room-field')).toBeTruthy()
    expect(wrapper.find('#gt-booking-time-field')).toBeTruthy()
    expect(wrapper.find('#gt-submit-button')).toBeTruthy()
    expect(wrapper.find('#gt-my-bookings')).toBeTruthy()
  })

  test('parses api response correctly', () => {
    expect(wrapper.vm.$data.scData).toStrictEqual([{
      businessHours: [{
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '08:0'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }],
      data: { something: 'something' },
      level: 1,
      noBusinessDate: [],
      pax: 4,
      schedule: [{
        end: '2021/03/09 20:00',
        isMe: false,
        start: '2021/03/09 18:00',
        text: 'Mr.A reserved'
      }, {
        end: '2021/03/10 17:00',
        isMe: false,
        start: '2021/03/10 15:00',
        text: 'Mr.B reserved'
      }],
      title: 'Novena'
    }, {
      businessHours: [{
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '08:0'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }],
      data: { something: 'something' },
      level: 1,
      noBusinessDate: [],
      pax: 1,
      schedule: [{
        end: '2021/03/9 17:00',
        isMe: false,
        start: '2021/03/9 12:00',
        text: 'Mr.C reserved'
      }],
      title: 'Dhoby Ghaut'
    }, {
      businessHours: [{
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '08:0'
      }, {
        end: '24:00',
        start: '00:00'
      }, {
        end: '24:00',
        start: '00:00'
      }],
      data: { something: 'something' },
      level: 1,
      noBusinessDate: [],
      pax: 8,
      schedule: [{
        end: '2021/03/10 18:00',
        isMe: false,
        start: '2021/03/10 12:00',
        text: 'Mr.D reserved'
      }],
      title: 'Marina'
    }])
    expect(wrapper.vm.$data.scSetting).toStrictEqual({
      borderW: 1,
      dateDivH: 25,
      endDate: '2021/03/15',
      rowH: 64,
      startDate: '2021/03/09',
      timeDivH: 25,
      titleDivW: 16,
      unit: 30,
      unitDivW: 24,
      weekdayText: [
        'Sun',
        'Mon',
        'Tue',
        'Wed',
        'Thu',
        'Fri',
        'Sat'
      ]
    })
    expect(wrapper.vm.$data.meetingRooms).toStrictEqual([
      'Novena',
      'Dhoby Ghaut',
      'Marina'
    ])
  })

  test('emit addEvent', () => {
    wrapper.vm.addEvent(1, '2020/01/01 00:00:00', '2020/01/01/ 01:00:00')
    expect(wrapper.vm.$data.bookingTimeString).toBe('2020/01/01 00:00:00 to 2020/01/01/ 01:00:00')
    expect(wrapper.vm.$data.selectedMeetingRoom).toBe('Dhoby Ghaut')
  })

  test('emit moveEvent', () => {
    wrapper.vm.moveEvent(0, 1, '2020/01/01 00:00:00', '2020/01/01/ 01:00:00')
    expect(wrapper.vm.$data.bookingTimeString).toBe('2020/01/01 00:00:00 to 2020/01/01/ 01:00:00')
    expect(wrapper.vm.$data.selectedMeetingRoom).toBe('Dhoby Ghaut')
  })

  test('emit editEvent', () => {
    wrapper.vm.editEvent('2020/01/01 00:00:00', '2020/01/01/ 01:00:00')
    expect(wrapper.vm.$data.bookingTimeString).toBe('2020/01/01 00:00:00 to 2020/01/01/ 01:00:00')
  })

  test('emit deleteEvent', () => {
    wrapper.vm.deleteEvent()
    expect(wrapper.vm.$data.bookingTimeString).toBe('')
  })

  test('validate success', () => {
    wrapper.vm.$data.selectedMeetingRoom = 'test'
    expect(wrapper.vm.validate()).toBeTruthy()
  })

  test('validate failure', () => {
    wrapper.vm.$data.selectedMeetingRoom = ''
    expect(wrapper.vm.validate()).toBeFalsy()
    expect(wrapper.vm.$data.errorMessage).toBe('Please select a booking slot')
  })

  test('parses form correctly', () => {
    wrapper.vm.$data.bookingName = 'booking1'
    wrapper.vm.$data.startTime = '2021/03/12 11:00:00'
    wrapper.vm.$data.endTime = '2021/03/12 13:00:00'
    wrapper.vm.$data.apiResponse = {
      facilities: {
        room1: {
          facilityId: 1
        }
      }
    }
    wrapper.vm.$data.selectedMeetingRoom = 'room1'

    expect(wrapper.vm.parseRequest()).toStrictEqual({
      booked_by: 'likz',
      booking_name: 'booking1',
      end_time: '2021/03/12 13:00:00',
      facility_id: 1,
      start_time: '2021/03/12 11:00:00'
    })
  })

  test('no token - redirect to homepage', () => {
    delete window.location
    window.location = { replace: jest.fn() }

    const $route = {
      path: '/',
      query: {
        token: '',
        email: ''
      }
    }

    wrapper = shallowMount(booking, {
      propsData: {},
      mocks: {
        $route,
        $auth,
        $router
      }
    })

    expect(window.location.replace).toHaveBeenCalled()
  })
})

describe('API', () => {
  test('token expired', () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2021-03-11 08:00').getTime())

    jest.spyOn(api, 'get').mockImplementation(() => Promise.resolve({
      success: false,
      data: {
        code: 'token_expired',
        description: 'token is expired'
      }
    }))

    shallowMount(booking, {
      propsData: {},
      mocks: {
        $route,
        $auth,
        $router
      }
    })

    expect(window.location.replace).toHaveBeenCalled()

    window.location = location
  })
})

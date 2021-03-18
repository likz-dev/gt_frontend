import { shallowMount } from '@vue/test-utils'
import bookings from '@/pages/bookings.vue'
import api from '@/assets/js/api'

const sampleAPIResponse = {
  bookings: [
    {
      bookingId: 40,
      facilityId: 4,
      text: 'test 2',
      start: '2021/03/18 07:30',
      end: '2021/03/18 10:00',
      bookedBy: 'test@test.com',
      facilityName: 'Clementi',
      facilityPax: 4,
      facilityLevel: 12,
      isMe: false
    },
    {
      bookingId: 41,
      facilityId: 2,
      text: 'test 3',
      start: '2021/03/18 15:00',
      end: '2021/03/18 17:00',
      bookedBy: 'test@test.com',
      facilityName: 'Jurong',
      facilityPax: 4,
      facilityLevel: 12,
      isMe: false
    },
    {
      bookingId: 43,
      facilityId: 2,
      text: 'test 4',
      start: '2021/03/18 02:00',
      end: '2021/03/18 03:30',
      bookedBy: 'test@test.com',
      facilityName: 'Jurong',
      facilityPax: 4,
      facilityLevel: 12,
      isMe: false
    }
  ]
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

describe('Bookings page', () => {
  const oldLocation = window

  let wrapper

  beforeAll(() => {
    delete window.location
    window.location = {
      reload: jest.fn(),
      replace: jest.fn()
    }
  })

  afterAll(() => {
    window.location = oldLocation
  })

  beforeEach(() => {
    wrapper = shallowMount(bookings, {
      propsData: {},
      mocks: {
        $route,
        $auth
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

  test('parses api response correctly', () => {
    const bookingComponents = wrapper.findAll('.user-booking')
    expect(bookingComponents).toHaveLength(3)

    expect(wrapper.vm.$data.userBookings).toStrictEqual([
      {
        bookedBy: 'test@test.com',
        bookingId: 40,
        end: '2021/03/18 10:00',
        facilityId: 4,
        facilityLevel: 12,
        facilityName: 'Clementi',
        facilityPax: 4,
        isMe: false,
        start: '2021/03/18 07:30',
        text: 'test 2'
      },
      {
        bookedBy: 'test@test.com',
        bookingId: 41,
        end: '2021/03/18 17:00',
        facilityId: 2,
        facilityLevel: 12,
        facilityName: 'Jurong',
        facilityPax: 4,
        isMe: false,
        start: '2021/03/18 15:00',
        text: 'test 3'
      },
      {
        bookedBy: 'test@test.com',
        bookingId: 43,
        end: '2021/03/18 03:30',
        facilityId: 2,
        facilityLevel: 12,
        facilityName: 'Jurong',
        facilityPax: 4,
        isMe: false,
        start: '2021/03/18 02:00',
        text: 'test 4'
      }
    ])
  })

  it('no token - redirect to homepage', () => {
    const $route = {
      path: '/',
      query: {
        token: '',
        email: ''
      }
    }

    wrapper = shallowMount(bookings, {
      propsData: {},
      mocks: {
        $route,
        $auth
      }
    })

    expect(window.location.replace).toHaveBeenCalled()
  })

  it('deletes successfully', async () => {
    jest.spyOn(api, 'delete').mockImplementation(() => Promise.resolve({
      success: true
    }))

    await wrapper.vm.deleteBooking(1)

    expect(window.location.reload).toHaveBeenCalled()
  })

  it('delete failed', async () => {
    jest.spyOn(api, 'delete').mockImplementation(() => Promise.resolve({
      success: false
    }))

    await wrapper.vm.deleteBooking(1)

    expect(window.location.replace).toHaveBeenCalled()
  })
})

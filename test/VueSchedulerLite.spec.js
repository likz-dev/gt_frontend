import { mount } from '@vue/test-utils'
import { vueSchedulerLite } from '@/assets/js/vue-scheduler-lite'
import { sampleData, sampleSetting } from '@/assets/js/scheduler_app'

describe('FacilitiesScheduler', () => {
  let wrapper
  beforeEach(() => {
    wrapper = mount(vueSchedulerLite, {
      propsData: {
        scheduleData: sampleData,
        settings: sampleSetting
      }
    })
  })

  test('is a Vue instance', () => {
    expect(wrapper.vm).toBeTruthy()
  })

  test('parses cells correctly', () => {
    wrapper.setProps({
      scData: sampleData,
      scSetting: sampleSetting
    })
    wrapper.vm.$nextTick()

    // Creates all 24 * 7 + 7 cells
    const scTimeComponents = wrapper.findAll('.sc-time')
    expect(scTimeComponents).toHaveLength(175)

    // Existing business hours
    const cantResComponents = wrapper.findAll('.cant-res')
    expect(cantResComponents).toHaveLength(36)

    // 3 rooms
    const titleComponents = wrapper.findAll('.title')
    expect(titleComponents).toHaveLength(3)

    // 4 existing bookings
    const scBarComponents = wrapper.findAll('.sc-bar')
    expect(scBarComponents).toHaveLength(4)
  })
})
